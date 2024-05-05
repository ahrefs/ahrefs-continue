const { exec } = require("child_process");
const fs = require("fs");

const args = process.argv.slice(2);
let isPreRelease = false;
let target = "";
if (args.includes("--pre-release")) {
  isPreRelease = True;
}
else {
  const targetIndex = args.indexOf("--target") + 1;
  if (targetIndex > 0 && targetIndex < args.length) {
    target = args[targetIndex]; // Corrected to get the value following "--target"
  }
}



if (!fs.existsSync("build")) {
  fs.mkdirSync("build");
}

const command = isPreRelease
  ? "vsce package --out ./build patch --pre-release" // --yarn"
  : "vsce package --out ./build patch --target ${target}"; // --yarn";

exec(command, (error) => {
  if (error) throw error;
  console.log(
    "vsce package completed - extension created at extensions/vscode/build/continue-patch.vsix",
  );
});
