import * as vscode from "vscode";

type Task = {
  task: string;
  label: string;
  tasks: SubTask[];
  tooltip: string;
  StatusBarItem: vscode.StatusBarItem;
  Command: vscode.Disposable;
  args: string[];
};

type SubTask = {
  task: string;
  label: string;
  description: string;
};

class TaskButtons {
  tasks: Task[];
  showCounter: boolean;
  onDidChangeConfiguration!: vscode.Disposable;
  StatusBarItem!: vscode.StatusBarItem;

  constructor({ tasks, showCounter }: { tasks: Task[]; showCounter: boolean }) {
    this.tasks = tasks || [];
    this.showCounter = showCounter === false ? false : true;
    this.activate = this.activate.bind(this);
  }

  activate() {
    this.onDidChangeConfiguration = vscode.workspace.onDidChangeConfiguration(
      () => {
        const config = vscode.workspace.getConfiguration("VsCodeTaskButtons");
        this.update({ tasks: config.tasks, showCounter: config.showCounter });
      }
    );

    if (this.showCounter) {
      this.StatusBarItem = vscode.window.createStatusBarItem(
        vscode.StatusBarAlignment.Left
      );
      this.StatusBarItem.text =
        this.tasks.length + " " + (this.tasks.length == 1 ? "task" : "tasks");
      this.StatusBarItem.show();
    }

    this.tasks.forEach((taskConfig, key) => {
      const task = { ...taskConfig, sequence: key };

      task.StatusBarItem = vscode.window.createStatusBarItem(
        vscode.StatusBarAlignment.Left
      );

      task.StatusBarItem.text = task.label;

      if (task.task) {
        task.StatusBarItem.command = {
          title: task.task,
          command: "workbench.action.tasks.runTask",
          arguments: [task.task],
        };
      } else if (task.tasks) {
        const QuickPickItems = task.tasks.map((subTask, sequence) => ({
          sequence: sequence,
          label: subTask.label || subTask.task,
          description: subTask.description || "",
          command: {
            title: subTask.task,
            command: "workbench.action.tasks.runTask",
            arguments: [subTask.task],
          },
        }));

        task.Command = vscode.commands.registerCommand(
          "workbench.action.tasks.showQuickPick." + key,
          async () => {
            await vscode.window.showQuickPick(QuickPickItems).then((item) => {
              if (item) {
                vscode.commands.executeCommand(
                  item.command.command,
                  item.command.arguments
                );
              }
            });
          }
        );
        task.StatusBarItem.command = {
          title: task.label,
          command: "workbench.action.tasks.showQuickPick." + key,
          arguments: [],
        };
      }

      task.StatusBarItem.show();

      taskConfig = task;
    });
  }

  deactivate() {
    this.tasks.forEach((task) => {
      if (task.Command) {
        task.Command.dispose();
      }

      if (task.StatusBarItem) {
        task.StatusBarItem.dispose();
      }
    });

    if (this.onDidChangeConfiguration) {
      this.onDidChangeConfiguration.dispose();
    }

    if (this.StatusBarItem) {
      this.StatusBarItem.dispose();
    }
  }

  update({ tasks, showCounter }: { tasks: Task[]; showCounter: boolean }) {
    this.tasks = tasks || [];
    this.showCounter = showCounter || false;
    this.deactivate();
    this.activate();
  }
}

export default TaskButtons;
