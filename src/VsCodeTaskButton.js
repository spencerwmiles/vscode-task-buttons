const vscode = require("vscode");
const TaskButton = require("./TaskButton");

class VsCodeTaskButton {
  constructor(config) {
    this.tasks = config.tasks || [];

    this.buttons = [];
    this.status;
    this.label = "No tasks";
  }

  activate() {
    var _this = this;

    this.createStatusBar();
    this.tasks.forEach(function (task, key) {
      task.sequence = key;
      var button = new TaskButton(task);
      button.create();
      _this.buttons.push(button);
    });
  }

  updateConfiguration(config) {
    this.tasks = config.tasks || [];
    this.deactivate();
    this.activate();
  }

  deactivate() {
    this.status.dispose();
    this.buttons.forEach(function (button) {
      button.button.dispose();
    });
  }

  createStatusBar() {
    this.status = vscode.window.createStatusBarItem(
      vscode.StatusBarAlignment.Left
    );

    if (this.tasks.length) {
      this.label =
        this.tasks.length + " " + (this.tasks.length == 1 ? "task" : "tasks");
    }

    this.status.text = this.label;
    this.status.show();
  }
}

module.exports = VsCodeTaskButton;
