const vscode = require("vscode");

class TaskButton {
  constructor(label, task) {
    this.label = label;
    this.task = task;

    this.button = vscode.window.createStatusBarItem(
      vscode.StatusBarAlignment.Left
    );
  }

  create() {
    if (this.task) {
      this.button.text = this.label || this.task;
      this.button.command = {
        command: "workbench.action.tasks.runTask",
        arguments: [this.task],
      };
      this.button.show();
    }
  }
}

module.exports = TaskButton;
