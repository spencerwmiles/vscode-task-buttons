import * as vscode from "vscode";

/**
 * Task button class
 */
class TaskButton {
  /** Handle to status bar item */
  statusBarItem: vscode.StatusBarItem;

  /** Optional pick list command (for multi tasks list) */
  showQuickPickTasksListCommand!: vscode.Disposable;

  /**
   * Constructor task button
   */
  constructor(taskButtonConfig: any, buttonIndex: number) {
    //Check if at least a label defined
    if (!taskButtonConfig.label || taskButtonConfig.label.length === 0) {
      throw new Error("No task button label defined");
    }

    //Create the actual status bar button
    this.statusBarItem = vscode.window.createStatusBarItem(
      vscode.StatusBarAlignment.Left
    );

    //Set text label
    this.statusBarItem.text = taskButtonConfig.label;

    //Set tooltip text
    this.statusBarItem.tooltip = taskButtonConfig.tooltip || "";

    //If this is a single task button
    if (taskButtonConfig.task) {
      //Link a command to the status bar button that executes our configured task
      this.statusBarItem.command = {
        title: taskButtonConfig.task,
        command: "workbench.action.tasks.runTask",
        arguments: [taskButtonConfig.task],
      };

      //If this is a multi task (quick pick list) button
    } else if (taskButtonConfig.tasks) {
      //Create a quick-pick items list to select one of our configured tasks
      const quickPickTasksItems = taskButtonConfig.tasks.map(
        (subTask: any, sequence: any) => ({
          sequence: sequence,
          label: subTask.label || subTask.task,
          description: subTask.description || "",
          command: {
            title: subTask.task,
            command: "workbench.action.tasks.runTask",
            arguments: [subTask.task],
          },
        })
      );

      //Create command that shows the quick-pick with our task items
      this.showQuickPickTasksListCommand = vscode.commands.registerCommand(
        "workbench.action.tasks.showQuickPick." + buttonIndex,
        async () => {
          await vscode.window
            .showQuickPick(quickPickTasksItems)
            .then((clickedItem: any) => {
              //If an item is clicked, execute its task
              if (clickedItem) {
                vscode.commands.executeCommand(
                  clickedItem.command.command,
                  clickedItem.command.arguments[0]
                );
              }
            });
        }
      );

      //Set our created "show quick pick" command as button command
      this.statusBarItem.command = {
        title: taskButtonConfig.label,
        command: "workbench.action.tasks.showQuickPick." + buttonIndex,
        arguments: [],
      };
    } else {
      throw new Error("No task(s) defined for button");
    }

    //Show the status bar item
    this.statusBarItem.show();
  }

  /**
   * Dispose of this task button
   */
  dispose() {
    //The linked command
    if (this.showQuickPickTasksListCommand) {
      this.showQuickPickTasksListCommand.dispose();
    }

    //The status bar item itself
    if (this.statusBarItem) {
      this.statusBarItem.dispose();
    }
  }
}

export default TaskButton;
