import * as vscode from "vscode";
import { editorToSuggestions } from "../../../suggestions";
import { getMetaKeyLabel } from "../../../util/util";

export class SuggestionsCodeLensProvider implements vscode.CodeLensProvider {
  public provideCodeLenses(
    document: vscode.TextDocument,
    _: vscode.CancellationToken,
  ): vscode.CodeLens[] | Thenable<vscode.CodeLens[]> {
    const suggestions = editorToSuggestions.get(document.uri.toString());
    if (!suggestions) {
      return [];
    }

    const codeLenses: vscode.CodeLens[] = [];
    for (const suggestion of suggestions) {
      const range = new vscode.Range(
        suggestion.oldRange.start,
        suggestion.newRange.end,
      );
      codeLenses.push(
        new vscode.CodeLens(range, {
          title: "Accept",
          command: "ahrefs-continue.acceptSuggestion",
          arguments: [suggestion],
        }),
        new vscode.CodeLens(range, {
          title: "Reject",
          command: "ahrefs-continue.rejectSuggestion",
          arguments: [suggestion],
        }),
      );
      if (codeLenses.length === 2) {
        codeLenses.push(
          new vscode.CodeLens(range, {
            title: `(${getMetaKeyLabel()}⇧⏎/${getMetaKeyLabel()}⇧⌫ to accept/reject all)`,
            command: "",
          }),
        );
      }
    }

    return codeLenses;
  }
}
