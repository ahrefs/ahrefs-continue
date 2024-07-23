import { machineIdSync } from "node-machine-id";
<<<<<<< HEAD
import * as path from "path";
=======
import * as path from "node:path";
>>>>>>> v0.9.184-vscode
import * as vscode from "vscode";

export function translate(range: vscode.Range, lines: number): vscode.Range {
  return new vscode.Range(
    range.start.line + lines,
    range.start.character,
    range.end.line + lines,
    range.end.character,
  );
}

export function getNonce() {
  let text = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

export function getExtensionUri(): vscode.Uri {
<<<<<<< HEAD
  return vscode.extensions.getExtension("Ahrefs.ahrefs-continue")!.extensionUri;
=======
  return vscode.extensions.getExtension("Continue.continue")!.extensionUri;
>>>>>>> v0.9.184-vscode
}

export function getViewColumnOfFile(
  filepath: string,
): vscode.ViewColumn | undefined {
<<<<<<< HEAD
  for (let tabGroup of vscode.window.tabGroups.all) {
    for (let tab of tabGroup.tabs) {
=======
  for (const tabGroup of vscode.window.tabGroups.all) {
    for (const tab of tabGroup.tabs) {
>>>>>>> v0.9.184-vscode
      if (
        (tab?.input as any)?.uri &&
        (tab.input as any).uri.fsPath === filepath
      ) {
        return tabGroup.viewColumn;
      }
    }
  }
  return undefined;
}

export function getRightViewColumn(): vscode.ViewColumn {
  // When you want to place in the rightmost panel if there is already more than one, otherwise use Beside
  let column = vscode.ViewColumn.Beside;
<<<<<<< HEAD
  let columnOrdering = [
=======
  const columnOrdering = [
>>>>>>> v0.9.184-vscode
    vscode.ViewColumn.One,
    vscode.ViewColumn.Beside,
    vscode.ViewColumn.Two,
    vscode.ViewColumn.Three,
    vscode.ViewColumn.Four,
    vscode.ViewColumn.Five,
    vscode.ViewColumn.Six,
    vscode.ViewColumn.Seven,
    vscode.ViewColumn.Eight,
    vscode.ViewColumn.Nine,
  ];
<<<<<<< HEAD
  for (let tabGroup of vscode.window.tabGroups.all) {
=======
  for (const tabGroup of vscode.window.tabGroups.all) {
>>>>>>> v0.9.184-vscode
    if (
      columnOrdering.indexOf(tabGroup.viewColumn) >
      columnOrdering.indexOf(column)
    ) {
      column = tabGroup.viewColumn;
    }
  }
  return column;
}

let showTextDocumentInProcess = false;

export function openEditorAndRevealRange(
  editorFilename: string,
  range?: vscode.Range,
  viewColumn?: vscode.ViewColumn,
<<<<<<< HEAD
): Promise<vscode.TextEditor> {
  return new Promise((resolve, _) => {
    if (editorFilename.startsWith("~")) {
      editorFilename = path.join(
=======
  preview?: boolean,
): Promise<vscode.TextEditor> {
  return new Promise((resolve, _) => {
    let filename = editorFilename;
    if (editorFilename.startsWith("~")) {
      filename = path.join(
>>>>>>> v0.9.184-vscode
        process.env.HOME || process.env.USERPROFILE || "",
        editorFilename.slice(1),
      );
    }
<<<<<<< HEAD
    vscode.workspace.openTextDocument(editorFilename).then(async (doc) => {
=======
    vscode.workspace.openTextDocument(filename).then(async (doc) => {
>>>>>>> v0.9.184-vscode
      try {
        // An error is thrown mysteriously if you open two documents in parallel, hence this
        while (showTextDocumentInProcess) {
          await new Promise((resolve) => {
            setInterval(() => {
              resolve(null);
            }, 200);
          });
        }
        showTextDocumentInProcess = true;
        vscode.window
<<<<<<< HEAD
          .showTextDocument(
            doc,
            getViewColumnOfFile(editorFilename) || viewColumn,
          )
=======
          .showTextDocument(doc, {
            viewColumn: getViewColumnOfFile(editorFilename) || viewColumn,
            preview,
          })
>>>>>>> v0.9.184-vscode
          .then((editor) => {
            if (range) {
              editor.revealRange(range);
            }
            resolve(editor);
            showTextDocumentInProcess = false;
          });
      } catch (err) {
        console.log(err);
      }
    });
  });
}

function windowsToPosix(windowsPath: string): string {
  let posixPath = windowsPath.split("\\").join("/");
  if (posixPath[1] === ":") {
    posixPath = posixPath.slice(2);
  }
  // posixPath = posixPath.replace(" ", "\\ ");
  return posixPath;
}

function isWindowsLocalButNotRemote(): boolean {
  return (
    vscode.env.remoteName !== undefined &&
<<<<<<< HEAD
    ["wsl", "ssh-remote", "dev-container", "attached-container"].includes(
=======
    ["wsl", "ssh-remote", "dev-container", "attached-container", "tunnel"].includes(
>>>>>>> v0.9.184-vscode
      vscode.env.remoteName,
    ) &&
    process.platform === "win32"
  );
}

export function getPathSep(): string {
  return isWindowsLocalButNotRemote() ? "/" : path.sep;
}

export function uriFromFilePath(filepath: string): vscode.Uri {
<<<<<<< HEAD
  if (vscode.env.remoteName) {
    if (isWindowsLocalButNotRemote()) {
      filepath = windowsToPosix(filepath);
    }
    return vscode.Uri.parse(
      `vscode-remote://${vscode.env.remoteName}${filepath}`,
    );
  } else {
    return vscode.Uri.file(filepath);
=======
  let finalPath = filepath;
  if (vscode.env.remoteName) {
    if (isWindowsLocalButNotRemote()) {
      finalPath = windowsToPosix(filepath);
    }
    return vscode.Uri.parse(
      `vscode-remote://${vscode.env.remoteName}${finalPath}`,
    );
  } else {
    return vscode.Uri.file(finalPath);
>>>>>>> v0.9.184-vscode
  }
}

export function getUniqueId() {
  const id = vscode.env.machineId;
  if (id === "someValue.machineId") {
    return machineIdSync();
  }
  return vscode.env.machineId;
}
