<<<<<<< HEAD
import { ILLM } from "core";
import { ConfigHandler } from "core/config/handler";
import Ollama from "core/llm/llms/Ollama";
=======
import type { ILLM } from "core";
import { ConfigHandler } from "core/config/ConfigHandler";
import Ollama from "core/llm/llms/Ollama";
import { GlobalContext } from "core/util/GlobalContext";
>>>>>>> v0.9.184-vscode
import * as vscode from "vscode";

export class TabAutocompleteModel {
  private _llm: ILLM | undefined;
<<<<<<< HEAD
  private defaultTag: string = "starcoder2:3b";
  private defaultTagName: string = "Starcoder2 3b";

  private shownOllamaWarning: boolean = false;
  private shownDeepseekWarning: boolean = false;
=======
  private defaultTag = "starcoder2:3b";
  private defaultTagName = "Starcoder2 3b";
  private globalContext: GlobalContext = new GlobalContext();

  private shownOllamaWarning = false;
  private shownDeepseekWarning = false;
>>>>>>> v0.9.184-vscode

  private configHandler: ConfigHandler;

  constructor(configHandler: ConfigHandler) {
    this.configHandler = configHandler;
  }

  clearLlm() {
    this._llm = undefined;
  }

  async getDefaultTabAutocompleteModel() {
    const llm = new Ollama({
      model: this.defaultTag,
    });

    try {
      const models = await llm.listModels();
      if (!models.includes(this.defaultTag)) {
        if (!this.shownDeepseekWarning) {
          vscode.window
            .showWarningMessage(
              `Your local Ollama instance doesn't yet have ${this.defaultTagName}. To download this model, run \`ollama run ${this.defaultTag}\` (recommended). If you'd like to use a custom model for tab autocomplete, learn more in the docs`,
              "Documentation",
              "Copy Command",
            )
            .then((value) => {
              if (value === "Documentation") {
                vscode.env.openExternal(
                  vscode.Uri.parse(
<<<<<<< HEAD
                    "https://continue.dev/docs/walkthroughs/tab-autocomplete",
=======
                    "https://docs.continue.dev/walkthroughs/tab-autocomplete",
>>>>>>> v0.9.184-vscode
                  ),
                );
              } else if (value === "Copy Command") {
                vscode.env.clipboard.writeText(`ollama run ${this.defaultTag}`);
              }
            });
          this.shownDeepseekWarning = true;
        }
        return undefined;
      }
    } catch (e) {
      if (!this.shownOllamaWarning) {
        vscode.window
          .showWarningMessage(
            "Continue failed to connect to Ollama, which is used by default for tab-autocomplete. If you haven't downloaded it yet, you can do so at https://ollama.ai (recommended). If you'd like to use a custom model for tab autocomplete, learn more in the docs",
<<<<<<< HEAD
=======
            "Download Ollama",
>>>>>>> v0.9.184-vscode
            "Documentation",
          )
          .then((value) => {
            if (value === "Documentation") {
              vscode.env.openExternal(
                vscode.Uri.parse(
<<<<<<< HEAD
                  "https://continue.dev/docs/walkthroughs/tab-autocomplete",
                ),
              );
=======
                  "https://docs.continue.dev/walkthroughs/tab-autocomplete",
                ),
              );
            } else if (value === "Download Ollama") {
              vscode.env.openExternal(vscode.Uri.parse("https://ollama.ai"));
>>>>>>> v0.9.184-vscode
            }
          });
        this.shownOllamaWarning = true;
      }
      return undefined;
    }

    return llm;
  }

  async get() {
    if (!this._llm) {
<<<<<<< HEAD
      const ws_config = vscode.workspace.getConfiguration();
      const config = await this.configHandler.loadConfig();
      let completionModelName = ws_config.get("ahrefs-continue.completionModel", "")
      let completionModel: ILLM = config.tabAutocompleteModels.find((m) => m.title == completionModelName || m.model == completionModelName) || config.tabAutocompleteModels[0];
      this._llm = completionModel;
    }
=======
      const config = await this.configHandler.loadConfig();
      if (config.tabAutocompleteModels?.length) {
        const selected = this.globalContext.get("selectedTabAutocompleteModel");
        if (selected) {
          this._llm =
            config.tabAutocompleteModels?.find(
              (model) => model.title === selected,
            ) ?? config.tabAutocompleteModels?.[0];
        } else {
          if (config.tabAutocompleteModels[0].title) {
            this.globalContext.update(
              "selectedTabAutocompleteModel",
              config.tabAutocompleteModels[0].title,
            );
          }
          this._llm = config.tabAutocompleteModels[0];
        }
      } else {
        this._llm = await this.getDefaultTabAutocompleteModel();
      }
    }

>>>>>>> v0.9.184-vscode
    return this._llm;
  }
}
