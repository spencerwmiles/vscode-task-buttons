import * as vscode from "vscode";
import TaskButtonsBar from "./TaskButtonsBar";

const Extension = new TaskButtonsBar();

function activate(context: vscode.ExtensionContext) {
  Extension.activate();
}

function deactivate() {
  Extension.deactivate();
}

export { activate, deactivate };
