<<<<<<< HEAD
import * as fs from "fs";
import { getDevDataFilePath } from "./paths";
=======
import { writeFileSync } from "fs";
import { getDevDataFilePath } from "./paths.js";
>>>>>>> v0.9.184-vscode

export function logDevData(tableName: string, data: any) {
  const filepath: string = getDevDataFilePath(tableName);
  const jsonLine = JSON.stringify(data);
<<<<<<< HEAD
  fs.writeFileSync(filepath, `${jsonLine}\n`, { flag: "a" });
=======
  writeFileSync(filepath, `${jsonLine}\n`, { flag: "a" });
>>>>>>> v0.9.184-vscode
}
