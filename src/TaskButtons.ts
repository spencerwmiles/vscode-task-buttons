import * as vscode from 'vscode';

// --- Types remain the same ---
export type Task = {
  task?: string; // Optional for multi-task
  label?: string; // Optional, defaults to task
  tasks?: SubTask[]; // For multi-task buttons
  tooltip?: string;
  alignment?: 'left' | 'right';
  // Internal state managed by the class
  _statusBarItem?: vscode.StatusBarItem;
  _commandDisposable?: vscode.Disposable;
};

export type SubTask = {
  task: string;
  label?: string; // Optional, defaults to task
  description?: string;
};

const COMMANDS = {
  RUN_TASK: 'workbench.action.tasks.runTask',
  // We generate unique command IDs for each multi-task button
};

export const CONFIGURATION_SECTION = 'VsCodeTaskButtons';

class TaskButtons {
  private configTasks: Task[] = []; // Store the raw config
  private showCounter: boolean = true;
  private activeTasks: Task[] = []; // Store tasks with their active UI elements
  private counterStatusBarItem?: vscode.StatusBarItem;
  // Listener is managed externally in main.ts now

  constructor(initialConfig: vscode.WorkspaceConfiguration) {
    // Initialize directly from the first config read
    this.update(initialConfig);
  }

  // --- Getter for testing purposes ---
  public getActiveTasksForTest(): ReadonlyArray<
    Readonly<
      Partial<
        Task & {
          // Use Partial as internal state might not be fully populated
          statusBarItemText: string | undefined;
          statusBarItemTooltip: string | undefined; // Ensure tooltip is string for test comparison
          statusBarItemAlignment: vscode.StatusBarAlignment | undefined;
          commandId: string | undefined;
        }
      >
    >
  > {
    // Return a read-only view of active tasks
    return this.activeTasks.map((task) => {
      const tooltip = task._statusBarItem?.tooltip;
      return {
        ...task,
        // Expose limited, safe-to-read properties of UI elements if needed
        statusBarItemText: task._statusBarItem?.text,
        statusBarItemTooltip: typeof tooltip === 'string' ? tooltip : tooltip?.value, // Convert MarkdownString to string
        statusBarItemAlignment: task._statusBarItem?.alignment,
        commandId:
          typeof task._statusBarItem?.command === 'string'
            ? task._statusBarItem.command
            : task._statusBarItem?.command?.command,
      };
    });
  }

  public getCounterStatusForTest(): { text?: string; tooltip?: string } | undefined {
    if (!this.counterStatusBarItem) return undefined;
    const tooltip = this.counterStatusBarItem.tooltip;
    return {
      text: this.counterStatusBarItem.text,
      tooltip: typeof tooltip === 'string' ? tooltip : tooltip?.value, // Convert MarkdownString to string
    };
  }

  // --- Private helper to dispose UI elements ---
  private _disposeUIElements(): void {
    // Dispose task buttons
    this.activeTasks.forEach((task) => {
      task._commandDisposable?.dispose();
      task._statusBarItem?.dispose();
    });
    this.activeTasks = []; // Clear the array

    // Dispose counter
    this.counterStatusBarItem?.dispose();
    this.counterStatusBarItem = undefined;
  }

  // --- Private helper to build the command for a button ---
  private _buildCommand(taskConfig: Task, index: number): vscode.Command {
    const subTasks = taskConfig.tasks || [];
    const label = taskConfig.label || taskConfig.task || `Task ${index + 1}`; // Default label
    const tooltip = taskConfig.tooltip || label; // Default tooltip

    if (subTasks.length > 0) {
      // For multi-task, command triggers a quick pick
      return {
        title: label,
        command: `${CONFIGURATION_SECTION}.showQuickPick.${index}`, // Unique command ID
        tooltip,
        arguments: [subTasks], // Pass subtasks as arguments
      };
    } else if (taskConfig.task) {
      // For single-task, command runs the task directly
      return {
        title: label,
        command: COMMANDS.RUN_TASK,
        tooltip,
        arguments: [taskConfig.task], // Pass task name as argument
      };
    } else {
      // Invalid configuration (should ideally be caught by validation)
      return {
        title: 'Invalid Task',
        command: '', // No-op command
        tooltip: 'Invalid task configuration',
      };
    }
  }

  // --- Private helper to create and register commands/UI ---
  private _refreshUI(): void {
    // 1. Dispose existing elements
    this._disposeUIElements();

    // 2. Create Counter (if enabled)
    if (this.showCounter) {
      // Use a high negative priority to place it far left
      this.counterStatusBarItem = vscode.window.createStatusBarItem(
        vscode.StatusBarAlignment.Left,
        -9999
      );
      this.counterStatusBarItem.text = `${this.configTasks.length} task${this.configTasks.length !== 1 ? 's' : ''}`;
      this.counterStatusBarItem.tooltip = 'Number of configured task buttons';
      this.counterStatusBarItem.show();
    }

    // 3. Create Task Buttons
    this.configTasks.forEach((taskConfig, index) => {
      const alignment =
        taskConfig.alignment === 'right'
          ? vscode.StatusBarAlignment.Right
          : vscode.StatusBarAlignment.Left;
      // Adjust priority: Left items get higher positive numbers, Right items get lower positive numbers
      const priority = alignment === vscode.StatusBarAlignment.Left ? 100 - index : index + 1;
      const statusBarItem = vscode.window.createStatusBarItem(alignment, priority);

      const command = this._buildCommand(taskConfig, index);
      statusBarItem.command = command;
      statusBarItem.text = command.title; // Use title from command
      statusBarItem.tooltip = command.tooltip;

      let commandDisposable: vscode.Disposable | undefined;

      // Register command specifically for multi-task quick picks
      if ((taskConfig.tasks || []).length > 0) {
        commandDisposable = vscode.commands.registerCommand(
          command.command,
          async (subTasks: SubTask[]) => {
            const quickPickItems = subTasks.map((st) => ({
              label: st.label || st.task,
              description: st.description,
              taskName: st.task, // Store task name to execute
            }));

            const selected = await vscode.window.showQuickPick(quickPickItems, {
              placeHolder: `Select a task for '${command.title}'`,
            });

            if (selected?.taskName) {
              vscode.commands.executeCommand(COMMANDS.RUN_TASK, selected.taskName);
            }
          }
        );
      }

      statusBarItem.show();

      // Store the active task with its UI elements
      this.activeTasks.push({
        ...taskConfig, // Copy original config
        _statusBarItem: statusBarItem,
        _commandDisposable: commandDisposable,
      });
    });
  }

  // --- Public method called on initial activation ---
  public activate(): void {
    // Initial UI creation based on constructor-set config
    this._refreshUI();
  }

  // --- Public method called when configuration changes ---
  public update(newConfig: vscode.WorkspaceConfiguration): void {
    // Extract config values safely
    const newTasks = newConfig.get<Task[]>('tasks', []);
    const newShowCounter = newConfig.get<boolean>('showCounter', true);

    // Basic check if config actually changed (can be more sophisticated)
    // For simplicity, we'll refresh if either potentially changed.
    // A deep comparison could be added for optimization.
    // if (JSON.stringify(this.configTasks) !== JSON.stringify(newTasks) || this.showCounter !== newShowCounter) {

    this.configTasks = newTasks;
    this.showCounter = newShowCounter;

    // Refresh the UI based on the new state
    this._refreshUI();
    // }
  }

  // --- Public method called on extension deactivation ---
  public deactivate(): void {
    // Dispose all UI elements created by this instance
    this._disposeUIElements();
    // Note: The external listener in main.ts is disposed by the ExtensionContext
  }
}

export default TaskButtons;
