/**
 * This is the entry point for the extension.
 */

<<<<<<< HEAD
=======
import { setupCa } from "core/util/ca";
>>>>>>> v0.9.184-vscode
import { Telemetry } from "core/util/posthog";
import * as vscode from "vscode";
import { getExtensionVersion } from "./util/util";

async function dynamicImportAndActivate(context: vscode.ExtensionContext) {
  const { activateExtension } = await import("./activation/activate");
  try {
<<<<<<< HEAD
    await activateExtension(context);
=======
    return activateExtension(context);
>>>>>>> v0.9.184-vscode
  } catch (e) {
    console.log("Error activating extension: ", e);
    vscode.window
      .showInformationMessage(
<<<<<<< HEAD
        "Error activating the Ahrefs-Continue extension.",
=======
        "Error activating the Continue extension.",
>>>>>>> v0.9.184-vscode
        "View Logs",
        "Retry",
      )
      .then((selection) => {
        if (selection === "View Logs") {
<<<<<<< HEAD
          vscode.commands.executeCommand("ahrefs-continue.viewLogs");
=======
          vscode.commands.executeCommand("continue.viewLogs");
>>>>>>> v0.9.184-vscode
        } else if (selection === "Retry") {
          // Reload VS Code window
          vscode.commands.executeCommand("workbench.action.reloadWindow");
        }
      });
  }
}

export function activate(context: vscode.ExtensionContext) {
<<<<<<< HEAD
  dynamicImportAndActivate(context);
}

export function deactivate() {
  Telemetry.capture("deactivate", {
    extensionVersion: getExtensionVersion(),
  });

  Telemetry.shutdownPosthogClient();
}
=======
  setupCa();
  return dynamicImportAndActivate(context);
}

export function deactivate() {
  Telemetry.capture(
    "deactivate",
    {
      extensionVersion: getExtensionVersion(),
    },
    true,
  );

  Telemetry.shutdownPosthogClient();
}
>>>>>>> v0.9.184-vscode
