import {
  ToCoreFromWebviewProtocol,
  ToWebviewFromCoreProtocol,
} from "./coreWebview.js";
import { ToCoreFromIdeProtocol, ToIdeFromCoreProtocol } from "./ideCore.js";
import {
  ToIdeFromWebviewProtocol,
  ToWebviewFromIdeProtocol,
} from "./ideWebview.js";

export type IProtocol = Record<string, [any, any]>;

// IDE
export type ToIdeProtocol = ToIdeFromWebviewProtocol & ToIdeFromCoreProtocol;
export type FromIdeProtocol = ToWebviewFromIdeProtocol &
  ToCoreFromIdeProtocol & {
    didChangeActiveTextEditor: [{ filepath: string }, void];
  };

// Webview
export type ToWebviewProtocol = ToWebviewFromIdeProtocol &
  ToWebviewFromCoreProtocol;
export type FromWebviewProtocol = ToIdeFromWebviewProtocol &
  ToCoreFromWebviewProtocol;

// Core
export type ToCoreProtocol = ToCoreFromIdeProtocol | ToCoreFromWebviewProtocol;
export type FromCoreProtocol = ToWebviewFromCoreProtocol &
  ToIdeFromCoreProtocol;
