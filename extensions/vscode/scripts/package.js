const { exec } = require("child_process");
const fs = require("fs");

const args = process.argv.slice(2);
<<<<<<< HEAD
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


=======
let target;

if (args[0] === "--target") {
  target = args[1];
}
>>>>>>> v0.9.184-vscode

if (!fs.existsSync("build")) {
  fs.mkdirSync("build");
}

<<<<<<< HEAD
const command = isPreRelease
  ? "vsce package --out ./build patch --pre-release" // --yarn"
  : "vsce package --out ./build patch --target ${target}"; // --yarn";
=======
const isPreRelease = args.includes("--pre-release");

let command = isPreRelease
? "npx vsce package --out ./build patch --pre-release --no-dependencies" // --yarn"
: "npx vsce package --out ./build patch --no-dependencies"; // --yarn";

if (target) command += ` --target ${target}`;
>>>>>>> v0.9.184-vscode

exec(command, (error) => {
  if (error) throw error;
  console.log(
    "vsce package completed - extension created at extensions/vscode/build/continue-patch.vsix",
  );
});
