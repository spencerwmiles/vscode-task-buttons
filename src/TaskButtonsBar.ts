import * as vscode from "vscode";
import TaskButton from "./TaskButton";

/**
 * Main tasks buttons (bar)
 */
class TaskButtonsBar {
  /** Array of instances of active task buttons */
  activeTaskButtons: TaskButton[] = [];

  /** Instances of task count button/label */
  taskCountButton!: vscode.StatusBarItem;

  /** Configuration change handle */
  onDidChangeConfigurationHandler!: vscode.Disposable;

  /**
   * Constructor of extension, run once at init
   */
  constructor() {
    //Register activation handler
    this.activate = this.activate.bind(this);
  }

  /**
   * Activate handler, run on every extension activation
   */
  activate() {
    //Register event handle for configuration change
    this.onDidChangeConfigurationHandler =
      vscode.workspace.onDidChangeConfiguration(() => {
        this.handleConfigChange();
      });

    //If enabled, create button that shows number of task buttons
    const showTasksCounterConfig = vscode.workspace
      .getConfiguration("VsCodeTaskButtons")
      .get("showCounter", true);
    if (showTasksCounterConfig) {
      this.taskCountButton = vscode.window.createStatusBarItem(
        vscode.StatusBarAlignment.Left
      );
      this.taskCountButton.text =
        this.activeTaskButtons.length +
        " " +
        (this.activeTaskButtons.length == 1 ? "task" : "tasks");
      this.taskCountButton.show();
    }

    //Get the configured task buttons
    const tasksButtonConfig: unknown[] = vscode.workspace
      .getConfiguration("VsCodeTaskButtons")
      .get("tasks", []);

    //Create a task button for each config
    tasksButtonConfig.forEach((taskButtonConfig: any, index: number) => {
      try {
        //Create task button
        const newTaskButton = new TaskButton(taskButtonConfig, index);

        //Add to active buttons array
        this.activeTaskButtons.push(newTaskButton);
      } catch (e) {
        console.log("Error creating task button: " + e);
      }
    });
  }

  /**
   * De-activate handler, deactivates all extension components
   */
  deactivate() {
    //Dispose configuration change handler
    if (this.onDidChangeConfigurationHandler) {
      this.onDidChangeConfigurationHandler.dispose();
    }

    //Dispose task count button (if existing)
    if (this.taskCountButton) {
      this.taskCountButton.dispose();
    }

    //Dispose all active task buttons
    this.activeTaskButtons.forEach((taskButton) => {
      //Dispose of task button
      taskButton.dispose();
    });

    //Clear active buttons array
    this.activeTaskButtons = [];
  }

  /**
   * Configuration change handler, applies a changed configuration to the current context
   */
  handleConfigChange() {
    //Remove current instances
    this.deactivate();

    //Activate new instace
    this.activate();
  }
}

export default TaskButtonsBar;
