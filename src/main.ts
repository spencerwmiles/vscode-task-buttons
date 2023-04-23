import * as vscode from "vscode";
import TaskButtons, { CONFIGURATION_SECTION } from "./TaskButtons";

const config = vscode.workspace.getConfiguration(CONFIGURATION_SECTION);

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
