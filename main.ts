import * as vscode from "vscode";
import TaskButtons from "./TaskButtons";

const config = vscode.workspace.getConfiguration("VsCodeTaskButtons");

const Extension = new TaskButtons({
  tasks: config.tasks,
  showCounter: config.showCounter,
});

function activate(context: vscode.ExtensionContext) {
  Extension.activate();
}

function deactivate() {
  Extension.deactivate();
}

export { activate, deactivate };
