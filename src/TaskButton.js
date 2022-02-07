const vscode = require("vscode");

class TaskButton {
  constructor({ task, label, tooltip }) {
    this.label = label;
    this.task = task;
    this.tooltip = tooltip;

    this.button = vscode.window.createStatusBarItem(
      vscode.StatusBarAlignment.Left
    );
  }

  create() {
    if (this.task) {
      this.button.text = this.label || this.task;
      this.button.tooltip = this.tooltip || this.task;
      this.button.command = {
        command: "workbench.action.tasks.runTask",
        arguments: [this.task],
      };
      this.button.show();
    }
  }
}

module.exports = TaskButton;
