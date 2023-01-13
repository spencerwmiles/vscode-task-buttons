import * as vscode from "vscode";

type Task = {
  task: string;
  label: string;
  tasks: SubTask[];
  tooltip: string;
  alignment: "left" | "right";
  StatusBarItem: vscode.StatusBarItem;
  Command: vscode.Disposable;
  args: string[];
  condition: string;
};

type SubTask = {
  task: string;
  label: string;
  description: string;
  condition: string;
};

/**
 * Commands used by the extension
 */
const COMMANDS = {
  RUN_TASK: "workbench.action.tasks.runTask",
  SHOW_QUICK_PICK: "workbench.action.tasks.showQuickPick",
};

/**
 * Configuration section name
 *
 * This is the section name that is used in the settings.json file to configure the extension.
 *
 */
const CONFIGURATION_SECTION = "VsCodeTaskButtons";

class TaskButtons {
  tasks: Task[];
  showCounter: boolean;
  onDidChangeConfiguration!: vscode.Disposable;
  CounterStatusBarItem!: vscode.StatusBarItem;

  //TODO: condition
  constructor({ tasks, showCounter }: { tasks: Task[]; showCounter: boolean }) {
    this.tasks = tasks || [];
    this.showCounter = showCounter === false ? false : true;

    this.activate = this.activate.bind(this);
  }

  buildCommand(task: Task, index: number) {
    const tasks = task.tasks || [];
    const taskName = task?.label || task.task;
    const condition = task.condition || null;

    if (tasks.length > 0) {
      return {
        title: taskName,
        command: `${COMMANDS.SHOW_QUICK_PICK}.${index}`,
        tooltip: task.tooltip || task.task,
        arguments: task.tasks.map((subTask: SubTask, index: number) => ({
          sequence: index,
          label: subTask.label || subTask.task,
          description: subTask.description || "",
          condition: subTask.condition || null,
          command: {
            title: subTask.task,
            command: COMMANDS.RUN_TASK,
            arguments: [subTask.task],
          },
        })),
      };
    }

    return {
      title: taskName,
      command: COMMANDS.RUN_TASK,
      arguments: [task.task],
      condition: condition,
    };
  }

  createStatusBarItemForTask(task: Task, index: number) {
    const StatusBarItem = vscode.window.createStatusBarItem(
      task.alignment === "right"
        ? vscode.StatusBarAlignment.Right
        : vscode.StatusBarAlignment.Left
    );

    StatusBarItem.command = this.buildCommand(task, index);

    if (!task.tasks) {
      StatusBarItem.text = task.label || task.task;
      StatusBarItem.tooltip = task.tooltip || task.task;
    } else {
      StatusBarItem.text = task.label;
      StatusBarItem.tooltip = task.tooltip || task.label;
    }

    return StatusBarItem;
  }

  activate() {
    this.onDidChangeConfiguration = vscode.workspace.onDidChangeConfiguration(
      () => {
        this.update(vscode.workspace.getConfiguration(CONFIGURATION_SECTION));
      }
    );

    if (this.showCounter) {
      this.CounterStatusBarItem = vscode.window.createStatusBarItem(
        vscode.StatusBarAlignment.Left
      );
      this.CounterStatusBarItem.text = `${this.tasks.length} task${
        this.tasks.length > 1 ? "s" : ""
      }`;
      this.CounterStatusBarItem.tooltip = "Number of tasks";
      this.CounterStatusBarItem.show();
    }

    this.tasks.forEach((task, key, tasksArray) => {
      task.StatusBarItem = this.createStatusBarItemForTask(task, key);

      if (task?.tasks?.length > 0) {
        task.Command = vscode.commands.registerCommand(
          "workbench.action.tasks.showQuickPick." + key,
          async () => {
            await vscode.window.showQuickPick(task.tasks).then((subTask) => {
              if (!subTask) return;

              vscode.commands.executeCommand(`${COMMANDS.RUN_TASK}`, [
                subTask.task,
              ]);
            });
          }
        );
      }

      task.StatusBarItem.show();
      tasksArray[key] = task;
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

    if (this.CounterStatusBarItem) {
      this.CounterStatusBarItem.dispose();
    }
  }

  update({
    tasks,
    showCounter,
  }:
    | { tasks: Task[]; showCounter: boolean; showRunningTaskCounter: boolean }
    | vscode.WorkspaceConfiguration) {
    this.deactivate();

    this.tasks = tasks || [];
    this.showCounter = showCounter || false;

    this.activate();
  }
}

export default TaskButtons;

export { CONFIGURATION_SECTION };
