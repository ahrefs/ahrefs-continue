import * as fs from "node:fs";
<<<<<<< HEAD
=======
import * as path from "node:path";
>>>>>>> v0.9.184-vscode
import {
  ContinueRcJson,
  FileType,
  IDE,
  IdeInfo,
<<<<<<< HEAD
  IndexTag,
  Problem,
  Range,
  Thread,
} from "../index.js";
=======
  IdeSettings,
  IndexTag,
  Location,
  Problem,
  Range,
  RangeInFile,
  Thread,
} from "../index.d.js";
>>>>>>> v0.9.184-vscode

import { getContinueGlobalPath } from "./paths.js";

class FileSystemIde implements IDE {
<<<<<<< HEAD
=======
  constructor(private readonly workspaceDir: string) {}
  pathSep(): Promise<string> {
    return Promise.resolve(path.sep);
  }
  fileExists(filepath: string): Promise<boolean> {
    return Promise.resolve(fs.existsSync(filepath));
  }

  gotoDefinition(location: Location): Promise<RangeInFile[]> {
    throw new Error("Method not implemented.");
  }
  onDidChangeActiveTextEditor(callback: (filepath: string) => void): void {
    throw new Error("Method not implemented.");
  }

  async getIdeSettings(): Promise<IdeSettings> {
    return {
      remoteConfigServerUrl: undefined,
      remoteConfigSyncPeriod: 60,
      userToken: "",
      enableControlServerBeta: false,
    };
  }
>>>>>>> v0.9.184-vscode
  async getGitHubAuthToken(): Promise<string | undefined> {
    return undefined;
  }
  getLastModified(files: string[]): Promise<{ [path: string]: number }> {
    return new Promise((resolve) => {
      resolve({
        [files[0]]: 1234567890,
      });
    });
  }
  getGitRootPath(dir: string): Promise<string | undefined> {
    return Promise.resolve(dir);
  }
  async listDir(dir: string): Promise<[string, FileType][]> {
    const all: [string, FileType][] = fs
      .readdirSync(dir, { withFileTypes: true })
      .map((dirent: any) => [
<<<<<<< HEAD
        dirent.path,
        dirent.isDirectory()
          ? FileType.Directory
          : dirent.isSymbolicLink()
            ? FileType.SymbolicLink
            : FileType.File,
=======
        dirent.name,
        dirent.isDirectory()
          ? (2 as FileType.Directory)
          : dirent.isSymbolicLink()
            ? (64 as FileType.SymbolicLink)
            : (1 as FileType.File),
>>>>>>> v0.9.184-vscode
      ]);
    return Promise.resolve(all);
  }
  infoPopup(message: string): Promise<void> {
    return Promise.resolve();
  }
  errorPopup(message: string): Promise<void> {
    return Promise.resolve();
  }
  getRepoName(dir: string): Promise<string | undefined> {
    return Promise.resolve(undefined);
  }

  getTags(artifactId: string): Promise<IndexTag[]> {
    return Promise.resolve([]);
  }

  getIdeInfo(): Promise<IdeInfo> {
    return Promise.resolve({
      ideType: "vscode",
      name: "na",
      version: "0.1",
      remoteName: "na",
      extensionVersion: "na",
    });
  }

  readRangeInFile(filepath: string, range: Range): Promise<string> {
    return Promise.resolve("");
  }

  isTelemetryEnabled(): Promise<boolean> {
<<<<<<< HEAD
    return Promise.resolve(false);
=======
    return Promise.resolve(true);
>>>>>>> v0.9.184-vscode
  }

  getUniqueId(): Promise<string> {
    return Promise.resolve("NOT_UNIQUE");
  }

  getWorkspaceConfigs(): Promise<ContinueRcJson[]> {
    return Promise.resolve([]);
  }

  getDiff(): Promise<string> {
    return Promise.resolve("");
  }

  getTerminalContents(): Promise<string> {
    return Promise.resolve("");
  }

  async getDebugLocals(threadIndex: number): Promise<string> {
    return Promise.resolve("");
  }

  async getTopLevelCallStackSources(
    threadIndex: number,
    stackDepth: number,
  ): Promise<string[]> {
    return Promise.resolve([]);
  }

  async getAvailableThreads(): Promise<Thread[]> {
    return Promise.resolve([]);
  }

  showLines(
    filepath: string,
    startLine: number,
    endLine: number,
  ): Promise<void> {
    return Promise.resolve();
  }

<<<<<<< HEAD
  listWorkspaceContents(
    directory?: string,
    useGitIgnore?: boolean,
  ): Promise<string[]> {
    return new Promise((resolve, reject) => {
      fs.readdir("/tmp/continue", (err, files) => {
        if (err) {
          reject(err);
        }
        resolve(files);
      });
    });
  }

  getWorkspaceDirs(): Promise<string[]> {
    return new Promise((resolve, reject) => {
      fs.mkdtemp("/tmp/continue", (err, folder) => {
        if (err) {
          reject(err);
        }
        resolve([folder]);
      });
    });
=======
  getWorkspaceDirs(): Promise<string[]> {
    return Promise.resolve([this.workspaceDir]);
>>>>>>> v0.9.184-vscode
  }

  listFolders(): Promise<string[]> {
    return Promise.resolve([]);
  }

  writeFile(path: string, contents: string): Promise<void> {
    return new Promise((resolve, reject) => {
      fs.writeFile(path, contents, (err) => {
        if (err) {
          reject(err);
        }
        resolve();
      });
    });
  }

  showVirtualFile(title: string, contents: string): Promise<void> {
    return Promise.resolve();
  }

  getContinueDir(): Promise<string> {
    return Promise.resolve(getContinueGlobalPath());
  }

  openFile(path: string): Promise<void> {
    return Promise.resolve();
  }

  runCommand(command: string): Promise<void> {
    return Promise.resolve();
  }

  saveFile(filepath: string): Promise<void> {
    return Promise.resolve();
  }

  readFile(filepath: string): Promise<string> {
    return new Promise((resolve, reject) => {
      fs.readFile(filepath, "utf8", (err, contents) => {
        if (err) {
          reject(err);
        }
        resolve(contents);
      });
    });
  }

  showDiff(
    filepath: string,
    newContents: string,
    stepIndex: number,
  ): Promise<void> {
    return Promise.resolve();
  }

  getBranch(dir: string): Promise<string> {
    return Promise.resolve("");
  }

  getOpenFiles(): Promise<string[]> {
    return Promise.resolve([]);
  }

  getCurrentFile(): Promise<string | undefined> {
    return Promise.resolve("");
  }

  getPinnedFiles(): Promise<string[]> {
    return Promise.resolve([]);
  }

  async getSearchResults(query: string): Promise<string> {
    return "";
  }

  async getProblems(filepath?: string | undefined): Promise<Problem[]> {
    return Promise.resolve([]);
  }

  async subprocess(command: string): Promise<[string, string]> {
    return ["", ""];
  }
}

<<<<<<< HEAD
export default FileSystemIde;
=======
export default FileSystemIde;
>>>>>>> v0.9.184-vscode
