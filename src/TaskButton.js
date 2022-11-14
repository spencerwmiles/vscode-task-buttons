const vscode = require("vscode");

class TaskButton {
  constructor({ task, label, tooltip, tasks, sequence }) {
    this.label = label;
    this.task = task;
    this.tooltip = tooltip;
    this.tasks = tasks;
    this.sequence = sequence;

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
    } else if(this.tasks) {
      this.button.text = this.label || false;
      this.button.tooltip = this.tooltip || 'Click for more options';
      var quickPickItems = [];
      this.tasks.forEach(task => {
        quickPickItems.push({
          label: task.label || task.task,
          description: task.description || '',
          command: {
            command: "workbench.action.tasks.runTask",
            arguments: task.task,
          }
        });
      });

      var showQuickPickCommand = 'workbench.action.tasks.showQuickPick.' + this.sequence;
      this.command = vscode.commands.registerCommand(showQuickPickCommand, async () => {
          await vscode.window.showQuickPick(quickPickItems).then(item => {
            if (!item || !item.command || item.command.length === 0) {
              return;
            }
            vscode.commands.executeCommand(item.command.command, item.command.arguments);
          });
      });

      this.button.command = showQuickPickCommand;
      this.isQuickPick = true;

      this.button.show();
    }
  }

  dispose() {
    this.button.dispose();

    //We only make register a command with Quick Pick buttons
    if(this.isQuickPick) {
      this.command.dispose();
    }
  }
}

module.exports = TaskButton;
