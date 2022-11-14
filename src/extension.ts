import * as vscode from "vscode";
import TaskButtons from "./TaskButtons";

const Extension = new TaskButtons();

function activate(context: vscode.ExtensionContext) {
  Extension.activate();
}

function deactivate() {
  Extension.deactivate();
}

export { activate, deactivate };
