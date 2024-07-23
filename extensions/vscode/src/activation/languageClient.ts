/**
 * If we wanted to run or use another language server from our extension, this is how we would do it.
 */

<<<<<<< HEAD
import * as path from "path";
import { ExtensionContext, extensions, workspace } from "vscode";

import {
  LanguageClient,
  LanguageClientOptions,
  ServerOptions,
  State,
  StateChangeEvent,
=======
import * as path from "node:path";
import { type ExtensionContext, extensions, workspace } from "vscode";

import {
  LanguageClient,
  type LanguageClientOptions,
  type ServerOptions,
  State,
  type StateChangeEvent,
>>>>>>> v0.9.184-vscode
  TransportKind,
} from "vscode-languageclient/node";
import { getExtensionUri } from "../util/vscode";

let client: LanguageClient;

export async function startLanguageClient(context: ExtensionContext) {
<<<<<<< HEAD
  let pythonLS = startPythonLanguageServer(context);
=======
  const pythonLS = startPythonLanguageServer(context);
>>>>>>> v0.9.184-vscode
  pythonLS.start();
}

export async function makeRequest(method: string, param: any): Promise<any> {
  if (!client) {
    return;
  } else if (client.state === State.Starting) {
    return new Promise((resolve, reject) => {
<<<<<<< HEAD
      let stateListener = client.onDidChangeState((e: StateChangeEvent) => {
=======
      const stateListener = client.onDidChangeState((e: StateChangeEvent) => {
>>>>>>> v0.9.184-vscode
        if (e.newState === State.Running) {
          stateListener.dispose();
          resolve(client.sendRequest(method, param));
        } else if (e.newState === State.Stopped) {
          stateListener.dispose();
          reject(new Error("Language server stopped unexpectedly"));
        }
      });
    });
  } else {
    return client.sendRequest(method, param);
  }
}

export function deactivate(): Thenable<void> | undefined {
  if (!client) {
    return undefined;
  }
  return client.stop();
}

function startPythonLanguageServer(context: ExtensionContext): LanguageClient {
<<<<<<< HEAD
  let extensionPath = getExtensionUri().fsPath;
=======
  const extensionPath = getExtensionUri().fsPath;
>>>>>>> v0.9.184-vscode
  const command = `cd ${path.join(
    extensionPath,
    "scripts",
  )} && source env/bin/activate.fish && python -m pyls`;
  const serverOptions: ServerOptions = {
    command: command,
    args: ["-vv"],
  };
  const clientOptions: LanguageClientOptions = {
    documentSelector: ["python"],
    synchronize: {
      configurationSection: "pyls",
    },
  };
<<<<<<< HEAD
  return new LanguageClient(command, serverOptions, clientOptions);
}

async function startPylance(context: ExtensionContext) {
  let pylance = extensions.getExtension("ms-python.vscode-pylance");
=======
  return new LanguageClient(command, serverOptions, clientOptions)
}

async function startPylance(context: ExtensionContext) {
  const pylance = extensions.getExtension("ms-python.vscode-pylance");
>>>>>>> v0.9.184-vscode
  await pylance?.activate();
  if (!pylance) {
    return;
  }
<<<<<<< HEAD
  let { path: lsPath } = await pylance.exports.languageServerFolder();

  // The server is implemented in node
  let serverModule = context.asAbsolutePath(lsPath);
  // The debug options for the server
  // --inspect=6009: runs the server in Node's Inspector mode so VS Code can attach to the server for debugging
  let debugOptions = { execArgv: ["--nolazy", "--inspect=6009"] };

  // If the extension is launched in debug mode then the debug server options are used
  // Otherwise the run options are used
  let serverOptions: ServerOptions = {
=======
  const { path: lsPath } = await pylance.exports.languageServerFolder();

  // The server is implemented in node
  const serverModule = context.asAbsolutePath(lsPath);
  // The debug options for the server
  // --inspect=6009: runs the server in Node's Inspector mode so VS Code can attach to the server for debugging
  const debugOptions = { execArgv: ["--nolazy", "--inspect=6009"] };

  // If the extension is launched in debug mode then the debug server options are used
  // Otherwise the run options are used
  const serverOptions: ServerOptions = {
>>>>>>> v0.9.184-vscode
    run: { module: serverModule, transport: TransportKind.ipc },
    debug: {
      module: serverModule,
      transport: TransportKind.ipc,
      options: debugOptions,
    },
  };

  // Options to control the language client
<<<<<<< HEAD
  let clientOptions: LanguageClientOptions = {
=======
  const clientOptions: LanguageClientOptions = {
>>>>>>> v0.9.184-vscode
    // Register the server for plain text documents
    documentSelector: [{ scheme: "file", language: "python" }],
    synchronize: {
      // Notify the server about file changes to '.clientrc files contained in the workspace
      fileEvents: workspace.createFileSystemWatcher("**/.clientrc"),
    },
  };

  // Create the language client and start the client.
  client = new LanguageClient(
    "languageServerExample",
    "Language Server Example",
    serverOptions,
    clientOptions,
  );
  return client;
}
<<<<<<< HEAD
=======

>>>>>>> v0.9.184-vscode
