import * as fs from "fs";
import { getDevDataFilePath } from "./paths";

export function logDevData(tableName: string, data: any) {
  const filepath: string = getDevDataFilePath(tableName);
  const jsonLine = JSON.stringify(data);
  fs.writeFileSync(filepath, `${jsonLine}\n`, { flag: "a" });
}
