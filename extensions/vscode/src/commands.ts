import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import * as vscode from "vscode";

import { IDE, ContinueSDK } from "core";
import { AutocompleteOutcome } from "core/autocomplete/completionProvider";
import { ConfigHandler } from "core/config/handler";
import { fetchwithRequestOptions } from "core/util/fetchWithOptions";
import { logDevData } from "core/util/devdata";
import { Telemetry } from "core/util/posthog";
import { ContinueGUIWebviewViewProvider } from "./debugPanel";
import { DiffManager } from "./diff/horizontal";
import { VerticalPerLineDiffManager } from "./diff/verticalPerLine/manager";
import { getPlatform } from "./util/util";
import { VsCodeWebviewProtocol } from "./webviewProtocol";

function getFullScreenTab() {
  const tabs = vscode.window.tabGroups.all.flatMap((tabGroup) => tabGroup.tabs);
  return tabs.find(
    (tab) => (tab.input as any)?.viewType?.endsWith("ahrefs-continue.ahrefs-continueGUIView"),
  );
}

function addHighlightedCodeToContext(
  edit: boolean,
  webviewProtocol: VsCodeWebviewProtocol | undefined,
) {
  const editor = vscode.window.activeTextEditor;
  if (editor) {
    const selection = editor.selection;
    if (selection.isEmpty) return;
    const range = new vscode.Range(selection.start, selection.end);
    const contents = editor.document.getText(range);
    const rangeInFileWithContents = {
      filepath: editor.document.uri.fsPath,
      contents,
      range: {
        start: {
          line: selection.start.line,
          character: selection.start.character,
        },
        end: {
          line: selection.end.line,
          character: selection.end.character,
        },
      },
    };

    webviewProtocol?.request("highlightedCode", {
      rangeInFileWithContents,
    });
  }
}

async function addEntireFileToContext(
  filepath: vscode.Uri,
  edit: boolean,
  webviewProtocol: VsCodeWebviewProtocol | undefined,
) {
  // If a directory, add all files in the directory
  const stat = await vscode.workspace.fs.stat(filepath);
  if (stat.type === vscode.FileType.Directory) {
    const files = await vscode.workspace.fs.readDirectory(filepath);
    for (const [filename, type] of files) {
      if (type === vscode.FileType.File) {
        addEntireFileToContext(
          vscode.Uri.joinPath(filepath, filename),
          edit,
          webviewProtocol,
        );
      }
    }
    return;
  }

  // Get the contents of the file
  const contents = (await vscode.workspace.fs.readFile(filepath)).toString();
  const rangeInFileWithContents = {
    filepath: filepath.fsPath,
    contents: contents,
    range: {
      start: {
        line: 0,
        character: 0,
      },
      end: {
        line: contents.split(os.EOL).length - 1,
        character: 0,
      },
    },
  };

  webviewProtocol?.request("highlightedCode", {
    rangeInFileWithContents,
  });
}

// Copy everything over from extension.ts
const commandsMap: (
  ide: IDE,
  extensionContext: vscode.ExtensionContext,
  sidebar: ContinueGUIWebviewViewProvider,
  configHandler: ConfigHandler,
  diffManager: DiffManager,
  verticalDiffManager: VerticalPerLineDiffManager,
) => { [command: string]: (...args: any) => any } = (
  ide,
  extensionContext,
  sidebar,
  configHandler,
  diffManager,
  verticalDiffManager,
) => ({
  "ahrefs-continue.acceptDiff": async (newFilepath?: string | vscode.Uri) => {
    if (newFilepath instanceof vscode.Uri) {
      newFilepath = newFilepath.fsPath;
    }
    verticalDiffManager.clearForFilepath(newFilepath, true);
    await diffManager.acceptDiff(newFilepath);
  },
  "ahrefs-continue.rejectDiff": async (newFilepath?: string | vscode.Uri) => {
    if (newFilepath instanceof vscode.Uri) {
      newFilepath = newFilepath.fsPath;
    }
    verticalDiffManager.clearForFilepath(newFilepath, false);
    await diffManager.rejectDiff(newFilepath);
  },
  "ahrefs-continue.acceptVerticalDiffBlock": (filepath?: string, index?: number) => {
    verticalDiffManager.acceptRejectVerticalDiffBlock(true, filepath, index);
  },
  "ahrefs-continue.rejectVerticalDiffBlock": (filepath?: string, index?: number) => {
    verticalDiffManager.acceptRejectVerticalDiffBlock(false, filepath, index);
  },
  "ahrefs-continue.quickFix": async (message: string, code: string, edit: boolean) => {
    sidebar.webviewProtocol?.request("newSessionWithPrompt", {
      prompt: `${edit ? "/edit " : ""
        }${code}\n\nHow do I fix this problem in the above code?: ${message}`,
    });

    if (!edit) {
      vscode.commands.executeCommand("ahrefs-continue.continueGUIView.focus");
    }
  },
  "ahrefs-continue.focusContinueInput": async () => {
    if (!getFullScreenTab()) {
      vscode.commands.executeCommand("ahrefs-continue.continueGUIView.focus");
    }
    sidebar.webviewProtocol?.request("focusContinueInput", undefined);
    addHighlightedCodeToContext(false, sidebar.webviewProtocol);
  },
  "ahrefs-continue.focusContinueInputWithoutClear": async () => {
    if (!getFullScreenTab()) {
      vscode.commands.executeCommand("ahrefs-continue.continueGUIView.focus");
    }
    sidebar.webviewProtocol?.request(
      "focusContinueInputWithoutClear",
      undefined,
    );
    addHighlightedCodeToContext(true, sidebar.webviewProtocol);
  },
  "ahrefs-continue.toggleAuxiliaryBar": () => {
    vscode.commands.executeCommand("workbench.action.toggleAuxiliaryBar");
  },
  "ahrefs-continue.selectCommandModel": async () => {
    const config = await configHandler.loadConfig();
    const commandModels = config.commandModels.map(m => m.title || m.model)
    const pick = await vscode.window.showQuickPick(commandModels, {
      placeHolder: 'Select Command Execution Model (e.g. Ahrefs-Continue: Quick Edit)',
      onDidSelectItem: item => vscode.window.showInformationMessage(`Selected: ${item}`)
    });

    if (pick) {
      const config = vscode.workspace.getConfiguration();
      await config.update('ahrefs-continue.commandModel', pick, vscode.ConfigurationTarget.Global);
      vscode.window.showInformationMessage(`commandModel has been set to ${pick}`);
    }
  },
  "ahrefs-continue.selectCompletionModel": async () => {
    const config = await configHandler.loadConfig();
    const commandModels = config.tabAutocompleteModels.map(m => m.title || m.model)
    const pick = await vscode.window.showQuickPick(commandModels, {
      placeHolder: 'Select model for code completion',
      onDidSelectItem: item => vscode.window.showInformationMessage(`Selected: ${item}`)
    });

    if (pick) {
      const config = vscode.workspace.getConfiguration();
      await config.update('ahrefs-continue.completionModel', pick, vscode.ConfigurationTarget.Global);
      vscode.window.showInformationMessage(`completionModel has been set to ${pick}`);
    }
  },
  "ahrefs-continue.quickEdit": async () => {
    const selectionEmpty = vscode.window.activeTextEditor?.selection.isEmpty;

    const editor = vscode.window.activeTextEditor;
    const existingHandler = verticalDiffManager.getHandlerForFile(
      editor?.document.uri.fsPath ?? "",
    );
    const previousInput = existingHandler?.input;

    const config = await configHandler.loadConfig();
    const ws_config = vscode.workspace.getConfiguration();
    let commandModelTitle = ws_config.get('ahrefs-continue.commandModel', '');

    if (commandModelTitle === "") {
      commandModelTitle = config.commandModels[0].title ?? config.commandModels[0].model;
    }


    const quickPickItems =
      config.contextProviders
        ?.filter((provider) => provider.description.type === "normal")
        .map((provider) => {
          return {
            label: provider.description.displayTitle,
            description: provider.description.title,
            detail: provider.description.description,
          };
        }) || [];

    const addContextMsg = quickPickItems.length
      ? " (or press enter to add context first)"
      : "";
    const textInputOptions: vscode.InputBoxOptions = {
      placeHolder: selectionEmpty
        ? `Type instructions to generate code${addContextMsg}`
        : `Describe how to edit the highlighted code${addContextMsg}`,
      title: `${getPlatform() === "mac" ? "Cmd" : "Ctrl"}+I`,
      prompt: `[${commandModelTitle}]`,
    };
    if (previousInput) {
      textInputOptions.value = previousInput + ", ";
      textInputOptions.valueSelection = [
        textInputOptions.value.length,
        textInputOptions.value.length,
      ];
    }

    let text = await vscode.window.showInputBox(textInputOptions);

    if (text === undefined) {
      return;
    }

    if (text.length > 0 || quickPickItems.length === 0) {
      await verticalDiffManager.streamEdit(text, commandModelTitle);
    } else {
      // Pick context first
      const selectedProviders = await vscode.window.showQuickPick(
        quickPickItems,
        {
          title: "Add Context",
          canPickMany: true,
        },
      );

      let text = await vscode.window.showInputBox(textInputOptions);
      if (text) {
        const llm = await configHandler.llmFromTitle();
        const config = await configHandler.loadConfig();
        const context = (
          await Promise.all(
            selectedProviders?.map((providerTitle) => {
              const provider = config.contextProviders?.find(
                (provider) =>
                  provider.description.title === providerTitle.description,
              );
              if (!provider) {
                return [];
              }

              return provider.getContextItems("", {
                embeddingsProvider: config.embeddingsProvider,
                reranker: config.reranker,
                ide,
                llm,
                fullInput: text || "",
                selectedCode: [],
                fetch: (url, init) =>
                  fetchwithRequestOptions(url, init, config.requestOptions),
              });
            }) || [],
          )
        ).flat();

        text =
          context.map((item) => item.content).join("\n\n") +
          "\n\n---\n\n" +
          text;

        await verticalDiffManager.streamEdit(text, commandModelTitle);
      }
    }
  },

  // "continue.writeCommentsForCode": async () => {
  //   await verticalDiffManager.streamEdit(
  //     (await configHandler.loadConfig()).experimental?.contextMenuPrompts
  //       ?.comment ||
  //     "Write comments for this code. Do not change anything about the code itself.",
  //     await sidebar.webviewProtocol.request("getDefaultModelTitle", undefined),
  //   );
  // },
  // "continue.writeDocstringForCode": async () => {
  //   await verticalDiffManager.streamEdit(
  //     (await configHandler.loadConfig()).experimental?.contextMenuPrompts
  //       ?.docstring ||
  //     "Write a docstring for this code. Do not change anything about the code itself.",
  //     await sidebar.webviewProtocol.request("getDefaultModelTitle", undefined),
  //   );
  // },
  // "continue.fixCode": async () => {
  //   await verticalDiffManager.streamEdit(
  //     (await configHandler.loadConfig()).experimental?.contextMenuPrompts
  //       ?.fix || "Fix this code",
  //     await sidebar.webviewProtocol.request("getDefaultModelTitle", undefined),
  //   );
  // },
  // "continue.optimizeCode": async () => {
  //   await verticalDiffManager.streamEdit(
  //     (await configHandler.loadConfig()).experimental?.contextMenuPrompts
  //       ?.optimize || "Optimize this code",
  //     await sidebar.webviewProtocol.request("getDefaultModelTitle", undefined),
  //   );
  // },
  // "continue.fixGrammar": async () => {
  //   await verticalDiffManager.streamEdit(
  //     (await configHandler.loadConfig()).experimental?.contextMenuPrompts
  //       ?.fixGrammar ||
  //     "If there are any grammar or spelling mistakes in this writing, fix them. Do not make other large changes to the writing.",
  //     await sidebar.webviewProtocol.request("getDefaultModelTitle", undefined),
  //   );
  // },

  "ahrefs-continue.viewLogs": async () => {
    // Open ~/.continue/continue.log
    const logFile = path.join(os.homedir(), ".ahrefs-continue", "ahrefs-continue.log");
    // Make sure the file/directory exist
    if (!fs.existsSync(logFile)) {
      fs.mkdirSync(path.dirname(logFile), { recursive: true });
      fs.writeFileSync(logFile, "");
    }

    const uri = vscode.Uri.file(logFile);
    await vscode.window.showTextDocument(uri);
  },
  "ahrefs-continue.debugTerminal": async () => {
    const terminalContents = await ide.getTerminalContents();
    vscode.commands.executeCommand("ahrefs-continue.continueGUIView.focus");
    sidebar.webviewProtocol?.request("userInput", {
      input: `I got the following error, can you please help explain how to fix it?\n\n${terminalContents.trim()}`,
    });
  },
  "ahrefs-continue.hideInlineTip": () => {
    vscode.workspace
      .getConfiguration("ahrefs-continue")
      .update("showInlineTip", false, vscode.ConfigurationTarget.Global);
  },

  // Commands without keyboard shortcuts
  "ahrefs-continue.addModel": () => {
    vscode.commands.executeCommand("ahrefs-continue.continueGUIView.focus");
    sidebar.webviewProtocol?.request("addModel", undefined);
  },
  "ahrefs-continue.openSettingsUI": () => {
    vscode.commands.executeCommand("ahrefs-continue.continueGUIView.focus");
    sidebar.webviewProtocol?.request("openSettings", undefined);
  },
  "ahrefs-continue.sendMainUserInput": (text: string) => {
    sidebar.webviewProtocol?.request("userInput", {
      input: text,
    });
  },
  "ahrefs-continue.saveChatSession": () => {
    sidebar.webviewProtocol.request("sendSessionChatHistory", undefined);
  },
  "ahrefs-continue.selectRange": (startLine: number, endLine: number) => {
    if (!vscode.window.activeTextEditor) {
      return;
    }
    vscode.window.activeTextEditor.selection = new vscode.Selection(
      startLine,
      0,
      endLine,
      0,
    );
  },
  "ahrefs-continue.foldAndUnfold": (
    foldSelectionLines: number[],
    unfoldSelectionLines: number[],
  ) => {
    vscode.commands.executeCommand("editor.unfold", {
      selectionLines: unfoldSelectionLines,
    });
    vscode.commands.executeCommand("editor.fold", {
      selectionLines: foldSelectionLines,
    });
  },
  "ahrefs-continue.sendToTerminal": (text: string) => {
    ide.runCommand(text);
  },
  "ahrefs-continue.newSession": () => {
    sidebar.webviewProtocol?.request("newSession", undefined);
  },
  "ahrefs-continue.viewHistory": () => {
    sidebar.webviewProtocol?.request("viewHistory", undefined);
  },
  "ahrefs-continue.toggleFullScreen": () => {
    // Check if full screen is already open by checking open tabs
    const fullScreenTab = getFullScreenTab();

    // Check if the active editor is the Continue GUI View
    if (fullScreenTab && fullScreenTab.isActive) {
      //Full screen open and focused - close it
      vscode.commands.executeCommand("workbench.action.closeActiveEditor"); //this will trigger the onDidDispose listener below
      return;
    }

    if (fullScreenTab) {
      //Full screen open, but not focused - focus it
      // Focus the tab
      const openOptions = {
        preserveFocus: true,
        preview: fullScreenTab.isPreview,
        viewColumn: fullScreenTab.group.viewColumn,
      };

      vscode.commands.executeCommand(
        "vscode.open",
        (fullScreenTab.input as any).uri,
        openOptions,
      );
      return;
    }

    //Full screen not open - open it

    // Close the sidebar.webviews
    // vscode.commands.executeCommand("workbench.action.closeSidebar");
    vscode.commands.executeCommand("workbench.action.closeAuxiliaryBar");
    // vscode.commands.executeCommand("workbench.action.toggleZenMode");

    //create the full screen panel
    let panel = vscode.window.createWebviewPanel(
      "ahrefs-continue.continueGUIView",
      "Ahrefs-Continue",
      vscode.ViewColumn.One,
    );

    //Add content to the panel
    panel.webview.html = sidebar.getSidebarContent(
      extensionContext,
      panel,
      ide,
      configHandler,
      verticalDiffManager,
      undefined,
      undefined,
      true,
    );

    //When panel closes, reset the webview and focus
    panel.onDidDispose(
      () => {
        sidebar.resetWebviewProtocolWebview();
        vscode.commands.executeCommand("ahrefs-continue.focusContinueInput");
      },
      null,
      extensionContext.subscriptions,
    );
  },
  "ahrefs-continue.selectFilesAsContext": (
    firstUri: vscode.Uri,
    uris: vscode.Uri[],
  ) => {
    vscode.commands.executeCommand("ahrefs-continue.continueGUIView.focus");

    for (const uri of uris) {
      addEntireFileToContext(uri, false, sidebar.webviewProtocol);
    }
  },
  "ahrefs-continue.updateAllReferences": (filepath: vscode.Uri) => {
    // Get the cursor position in the editor
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      return;
    }
    const position = editor.selection.active;
    sidebar.sendMainUserInput(
      `/references ${filepath.fsPath} ${position.line} ${position.character}`,
    );
  },
  "ahrefs-continue.logAutocompleteOutcome": (
    outcome: AutocompleteOutcome,
    logRejectionTimeout: NodeJS.Timeout,
  ) => {
    clearTimeout(logRejectionTimeout);
    outcome.accepted = true;
    logDevData("autocomplete", outcome);
    Telemetry.capture("autocomplete", {
      accepted: outcome.accepted,
      modelName: outcome.modelName,
      modelProvider: outcome.modelProvider,
      time: outcome.time,
      cacheHit: outcome.cacheHit,
    });
  },
  "ahrefs-continue.toggleTabAutocompleteEnabled": () => {
    const config = vscode.workspace.getConfiguration("ahrefs-continue");
    const enabled = config.get("enableTabAutocomplete");
    config.update(
      "enableTabAutocomplete",
      !enabled,
      vscode.ConfigurationTarget.Global,
    );
  },
});

export function registerAllCommands(
  context: vscode.ExtensionContext,
  ide: IDE,
  extensionContext: vscode.ExtensionContext,
  sidebar: ContinueGUIWebviewViewProvider,
  configHandler: ConfigHandler,
  diffManager: DiffManager,
  verticalDiffManager: VerticalPerLineDiffManager,
) {
  for (const [command, callback] of Object.entries(
    commandsMap(
      ide,
      extensionContext,
      sidebar,
      configHandler,
      diffManager,
      verticalDiffManager,
    ),
  )) {
    context.subscriptions.push(
      vscode.commands.registerCommand(command, callback),
    );
  }
}
