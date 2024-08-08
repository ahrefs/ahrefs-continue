import { getTsConfigPath, getContinueRcPath, migrate } from "core/util/paths";
import { Telemetry } from "core/util/logging";
import path from "node:path";
import * as vscode from "vscode";
import { VsCodeExtension } from "../extension/VsCodeExtension";
import registerQuickFixProvider from "../lang-server/codeActions";
import { WorkOsAuthProvider } from "../stubs/WorkOsAuthProvider";
import { getExtensionVersion } from "../util/util";
import { getExtensionUri } from "../util/vscode";
import { VsCodeContinueApi } from "./api";
import { setupInlineTips } from "./inlineTips";
import axios from 'axios';

const EXTENSION_ID = 'ahrefs.ahrefs-continue';
const CURRENT_VERSION = vscode.extensions.getExtension(EXTENSION_ID)?.packageJSON.version;

async function checkForExtensionUpdate() {
    try {
        const response = await axios.get(`https://marketplace.visualstudio.com/_apis/public/gallery/extensionquery`, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json;api-version=3.0-preview.1'
            },
            data: {
                filters: [{
                    criteria: [{ filterType: 7, value: EXTENSION_ID }]
                }],
                flags: 131
            }
        });

        const latestVersion = response.data.results[0].extensions[0].versions[0].version;

        if (latestVersion !== CURRENT_VERSION) {
            notifyUpdateAvailable(latestVersion);
        }
    } catch (error) {
        console.error('Failed to check for updates:', error);
    }
}

function notifyUpdateAvailable(latestVersion: string) {
    const message = `A new version (${latestVersion}) of Ahrefs-Continue is available!`;
    const updateAction = 'Update Now';

    vscode.window.showInformationMessage(message, updateAction).then(selection => {
        if (selection === updateAction) {
            vscode.commands.executeCommand('extension.open', EXTENSION_ID);
        }
    });
}

export async function activateExtension(context: vscode.ExtensionContext) {
  // Add necessary files
  checkForExtensionUpdate();
  getTsConfigPath();
  getContinueRcPath();

  // Register commands and providers
  registerQuickFixProvider();
  setupInlineTips(context);

  // Register auth provider
  const workOsAuthProvider = new WorkOsAuthProvider(context);
  await workOsAuthProvider.initialize();
  context.subscriptions.push(workOsAuthProvider);

  const vscodeExtension = new VsCodeExtension(context);

  migrate("showWelcome_1", () => {
    vscode.commands.executeCommand(
      "markdown.showPreview",
      vscode.Uri.file(
        path.join(getExtensionUri().fsPath, "media", "welcome.md"),
      ),
    );

    vscode.commands.executeCommand("ahrefs-continue.focusContinueInput");
  });

  // Load Continue configuration
  if (!context.globalState.get("hasBeenInstalled")) {
    context.globalState.update("hasBeenInstalled", true);
    Telemetry.capture(
      "install",
      {
        extensionVersion: getExtensionVersion(),
      }
    );
  }

  const api = new VsCodeContinueApi(vscodeExtension);
  const continuePublicApi = {
    registerCustomContextProvider: api.registerCustomContextProvider.bind(api),
  };

  // 'export' public api-surface
  // or entire extension for testing
  return process.env.NODE_ENV === "test"
    ? {
        ...continuePublicApi,
        extension: vscodeExtension,
      }
    : continuePublicApi;
}
