import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import * as vscodeMock from './vscode.js'; // Import our mock with .js extension

// Tell Vitest to use our mock implementation for the 'vscode' module
vi.mock('vscode', () => vscodeMock);

import TaskButtons, { type Task } from '../TaskButtons.js'; // Import with .js extension

describe('TaskButtons', () => {
  let mockConfig: ReturnType<typeof vscodeMock.workspace.getConfiguration>;

  beforeEach(() => {
    // Reset mocks before each test to ensure isolation
    vscodeMock.resetMocks();

    // Get a reference to the mock configuration object
    mockConfig = vscodeMock.workspace.getConfiguration();

    // Default mock implementation for getConfiguration().get
    vi.mocked(mockConfig.get).mockImplementation((key: string, defaultValue?: unknown) => {
      if (key === 'tasks') return []; // Default to empty tasks
      if (key === 'showCounter') return true; // Default to show counter
      return defaultValue;
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Initialization and Configuration Update', () => {
    it('should initialize with default configuration', () => {
      const taskButtons = new TaskButtons(mockConfig);
      expect(taskButtons).toBeDefined();
      expect(vscodeMock.window.createStatusBarItem).toHaveBeenCalledTimes(1); // Counter
      expect(vscodeMock.resetMocks).toHaveBeenCalledTimes(1);
    });

    it('should update tasks when configuration changes', () => {
      const taskButtons = new TaskButtons(mockConfig);
      vscodeMock.resetMocks();

      const newTasks: Task[] = [{ label: 'Test Task', task: 'test-task' }];
      vi.mocked(mockConfig.get).mockImplementation((key: string) => {
        if (key === 'tasks') return newTasks;
        if (key === 'showCounter') return true;
        return undefined;
      });

      taskButtons.update(mockConfig);

      expect(vscodeMock.resetMocks).toHaveBeenCalledTimes(2);
      expect(vscodeMock.window.createStatusBarItem).toHaveBeenCalledTimes(2); // Counter + 1 task
      const activeTasks = taskButtons.getActiveTasksForTest();
      expect(activeTasks).toHaveLength(1);
      expect(activeTasks[0].label).toBe('Test Task');
      expect(activeTasks[0].task).toBe('test-task');
    });

    it('should update counter visibility when configuration changes', () => {
      const taskButtons = new TaskButtons(mockConfig);
      expect(taskButtons.getCounterStatusForTest()).toBeDefined();
      vscodeMock.resetMocks();

      vi.mocked(mockConfig.get).mockImplementation((key: string) => {
        if (key === 'tasks') return [];
        if (key === 'showCounter') return false;
        return undefined;
      });
      taskButtons.update(mockConfig);
      expect(vscodeMock.resetMocks).toHaveBeenCalledTimes(2);
      expect(vscodeMock.window.createStatusBarItem).not.toHaveBeenCalled();
      expect(taskButtons.getCounterStatusForTest()).toBeUndefined();

      vscodeMock.resetMocks();
      vi.mocked(mockConfig.get).mockImplementation((key: string) => {
        if (key === 'tasks') return [];
        if (key === 'showCounter') return true;
        return undefined;
      });
      taskButtons.update(mockConfig);
      expect(vscodeMock.resetMocks).toHaveBeenCalledTimes(3);
      expect(vscodeMock.window.createStatusBarItem).toHaveBeenCalledTimes(1); // Just counter
      expect(taskButtons.getCounterStatusForTest()).toBeDefined();
    });
  });

  describe('Single Task Button Creation', () => {
    it('should create a status bar item for a single task', () => {
      const singleTaskConfig: Task[] = [{ task: 'build' }];
      vi.mocked(mockConfig.get).mockImplementation((key: string) => {
        if (key === 'tasks') return singleTaskConfig;
        if (key === 'showCounter') return false; // Disable counter for simplicity
        return undefined;
      });

      // Instantiate TaskButtons - this calls update -> _refreshUI internally
      const taskButtons = new TaskButtons(mockConfig);

      // Verify state after constructor initialization
      // createStatusBarItem is called once by constructor/update.
      // Since we disabled the counter, it should be called once for the task button.
      expect(vscodeMock.window.createStatusBarItem).toHaveBeenCalledTimes(1); // Only the task button
      const activeTasks = taskButtons.getActiveTasksForTest();
      expect(activeTasks).toHaveLength(1);
      // We can't directly check the internal _statusBarItem easily with the current mock setup
      // Instead, we rely on createStatusBarItem being called the correct number of times.
    });

    it('should set correct text, tooltip, and command for a single task', () => {
      const singleTaskConfig: Task[] = [
        { task: 'build', label: 'Build Project', tooltip: 'Run build task' },
      ];
      vi.mocked(mockConfig.get).mockImplementation((key: string) => {
        if (key === 'tasks') return singleTaskConfig;
        if (key === 'showCounter') return false; // Disable counter for simplicity
        return undefined;
      });

      const taskButtons = new TaskButtons(mockConfig);

      const activeTasks = taskButtons.getActiveTasksForTest();
      expect(activeTasks).toHaveLength(1);
      const task = activeTasks[0];
      expect(task.statusBarItemText).toBe('Build Project');
      expect(task.statusBarItemTooltip).toBe('Run build task');
      expect(task.commandId).toBe('workbench.action.tasks.runTask');
    });

    it('should handle alignment correctly for single tasks', () => {
      const singleTaskConfig: Task[] = [{ task: 'build', alignment: 'right' }];
      vi.mocked(mockConfig.get).mockImplementation((key: string) => {
        if (key === 'tasks') return singleTaskConfig;
        if (key === 'showCounter') return false; // Disable counter for simplicity
        return undefined;
      });

      const taskButtons = new TaskButtons(mockConfig);

      const activeTasks = taskButtons.getActiveTasksForTest();
      expect(activeTasks).toHaveLength(1);
      const task = activeTasks[0];
      expect(task.statusBarItemAlignment).toBe(vscodeMock.StatusBarAlignment.Right);
    });
  });

  describe('Multi-Task Button Creation', () => {
    it('should create a status bar item for a multi-task button', () => {
      const multiTaskConfig: Task[] = [
        {
          label: 'Multi Task',
          tasks: [
            { task: 'build', label: 'Build' },
            { task: 'test', label: 'Test' },
          ],
        },
      ];
      vi.mocked(mockConfig.get).mockImplementation((key: string) => {
        if (key === 'tasks') return multiTaskConfig;
        if (key === 'showCounter') return false; // Disable counter for simplicity
        return undefined;
      });

      const taskButtons = new TaskButtons(mockConfig);

      // Verify state after constructor initialization
      expect(vscodeMock.window.createStatusBarItem).toHaveBeenCalledTimes(1); // Only the multi-task button
      const activeTasks = taskButtons.getActiveTasksForTest();
      expect(activeTasks).toHaveLength(1);
      // We can't directly check the internal _statusBarItem easily with the current mock setup
    });

    it('should register a unique command for a multi-task button', () => {
      const multiTaskConfig: Task[] = [
        {
          label: 'Multi Task',
          tasks: [
            { task: 'build', label: 'Build' },
            { task: 'test', label: 'Test' },
          ],
        },
      ];
      vi.mocked(mockConfig.get).mockImplementation((key: string) => {
        if (key === 'tasks') return multiTaskConfig;
        if (key === 'showCounter') return false; // Disable counter for simplicity
        return undefined;
      });

      const taskButtons = new TaskButtons(mockConfig);

      const activeTasks = taskButtons.getActiveTasksForTest();
      expect(activeTasks).toHaveLength(1);
      const task = activeTasks[0];
      expect(task.commandId).toMatch(/^VsCodeTaskButtons\.showQuickPick\.\d+$/); // Check for unique command ID
      // Check that the command was actually registered
      expect(vscodeMock.commands.registerCommand).toHaveBeenCalledWith(
        task.commandId,
        expect.any(Function)
      );
    });

    it('should set correct text, tooltip, and command for a multi-task button', () => {
      const multiTaskConfig: Task[] = [
        {
          label: 'Multi Task',
          tooltip: 'Choose a task to run',
          tasks: [
            { task: 'build', label: 'Build' },
            { task: 'test', label: 'Test' },
          ],
        },
      ];
      vi.mocked(mockConfig.get).mockImplementation((key: string) => {
        if (key === 'tasks') return multiTaskConfig;
        if (key === 'showCounter') return false; // Disable counter for simplicity
        return undefined;
      });

      const taskButtons = new TaskButtons(mockConfig);

      const activeTasks = taskButtons.getActiveTasksForTest();
      expect(activeTasks).toHaveLength(1);
      const task = activeTasks[0];
      expect(task.statusBarItemText).toBe('Multi Task');
      expect(task.statusBarItemTooltip).toBe('Choose a task to run');
      expect(task.commandId).toMatch(/^VsCodeTaskButtons\.showQuickPick\.\d+$/); // Check for unique command ID
    });

    it('should handle alignment correctly for multi-tasks', () => {
      const multiTaskConfig: Task[] = [
        {
          label: 'Multi Task',
          alignment: 'right',
          tasks: [
            { task: 'build', label: 'Build' },
            { task: 'test', label: 'Test' },
          ],
        },
      ];
      vi.mocked(mockConfig.get).mockImplementation((key: string) => {
        if (key === 'tasks') return multiTaskConfig;
        if (key === 'showCounter') return false; // Disable counter for simplicity
        return undefined;
      });

      const taskButtons = new TaskButtons(mockConfig);

      const activeTasks = taskButtons.getActiveTasksForTest();
      expect(activeTasks).toHaveLength(1);
      const task = activeTasks[0];
      expect(task.statusBarItemAlignment).toBe(vscodeMock.StatusBarAlignment.Right);
    });

    it('should show quick pick when multi-task button command is executed', async () => {
      const subTasks = [
        { task: 'build', label: 'Build' },
        { task: 'test', label: 'Test' },
      ];
      const multiTaskConfig: Task[] = [
        {
          label: 'Multi Task',
          tasks: subTasks,
        },
      ];
      vi.mocked(mockConfig.get).mockImplementation((key: string) => {
        if (key === 'tasks') return multiTaskConfig;
        if (key === 'showCounter') return false; // Disable counter for simplicity
        return undefined;
      });

      const taskButtons = new TaskButtons(mockConfig);

      const activeTasks = taskButtons.getActiveTasksForTest();
      expect(activeTasks).toHaveLength(1);
      const task = activeTasks[0];

      // Ensure commandId is defined before executing
      if (task.commandId) {
        // Simulate command execution, passing the subTasks array as an argument
        await vscodeMock.commands.executeCommand(task.commandId, subTasks);
      } else {
        throw new Error('Command ID is undefined for multi-task button');
      }

      // Verify that showQuickPick was called
      expect(vscodeMock.window.showQuickPick).toHaveBeenCalled();
    });
  });

  describe('Counter Logic', () => {
    it('should display the correct count when counter is enabled', () => {
      const taskConfig: Task[] = [{ task: 'build' }, { task: 'test' }];
      vi.mocked(mockConfig.get).mockImplementation((key: string) => {
        if (key === 'tasks') return taskConfig;
        if (key === 'showCounter') return true;
        return undefined;
      });

      const taskButtons = new TaskButtons(mockConfig);

      const counterStatus = taskButtons.getCounterStatusForTest();
      expect(counterStatus).toBeDefined();
      expect(counterStatus?.text).toBe('2 tasks');
    });

    it('should handle singular vs plural "task(s)" correctly', () => {
      // Test with 1 task
      const singleTaskConfig: Task[] = [{ task: 'build' }];
      vi.mocked(mockConfig.get).mockImplementation((key: string) => {
        if (key === 'tasks') return singleTaskConfig;
        if (key === 'showCounter') return true;
        return undefined;
      });
      let taskButtons = new TaskButtons(mockConfig);
      let counterStatus = taskButtons.getCounterStatusForTest();
      expect(counterStatus?.text).toBe('1 task');

      // Test with 0 tasks
      const zeroTaskConfig: Task[] = [];
      vi.mocked(mockConfig.get).mockImplementation((key: string) => {
        if (key === 'tasks') return zeroTaskConfig;
        if (key === 'showCounter') return true;
        return undefined;
      });
      taskButtons = new TaskButtons(mockConfig); // Re-initialize with new config
      counterStatus = taskButtons.getCounterStatusForTest();
      expect(counterStatus?.text).toBe('0 tasks');

      // Test with multiple tasks (already covered by previous test, but good to be explicit)
      const multiTaskConfig: Task[] = [{ task: 'build' }, { task: 'test' }];
      vi.mocked(mockConfig.get).mockImplementation((key: string) => {
        if (key === 'tasks') return multiTaskConfig;
        if (key === 'showCounter') return true;
        return undefined;
      });
      taskButtons = new TaskButtons(mockConfig); // Re-initialize with new config
      counterStatus = taskButtons.getCounterStatusForTest();
      expect(counterStatus?.text).toBe('2 tasks');
    });

    it('should not create a counter item when disabled', () => {
      const taskConfig: Task[] = [{ task: 'build' }];
      vi.mocked(mockConfig.get).mockImplementation((key: string) => {
        if (key === 'tasks') return taskConfig;
        if (key === 'showCounter') return false; // Explicitly disable counter
        return undefined;
      });

      const taskButtons = new TaskButtons(mockConfig);

      const counterStatus = taskButtons.getCounterStatusForTest();
      expect(counterStatus).toBeUndefined();
      // Also check that createStatusBarItem was only called for the task button
      expect(vscodeMock.window.createStatusBarItem).toHaveBeenCalledTimes(1);
    });
  });

  describe('Cleanup Logic', () => {
    it('should dispose all status bar items on deactivate', () => {
      const taskConfig: Task[] = [{ task: 'build' }, { label: 'Multi', tasks: [{ task: 'test' }] }];
      vi.mocked(mockConfig.get).mockImplementation((key: string) => {
        if (key === 'tasks') return taskConfig;
        if (key === 'showCounter') return false; // Disable counter for this test
        return undefined;
      });

      const taskButtons = new TaskButtons(mockConfig);
      // Get the actual mock objects created
      const createdItems = vscodeMock.window.getCreatedStatusBarItems();
      expect(createdItems).toHaveLength(2); // Should have created 2 task buttons

      taskButtons.deactivate();

      // Check if dispose was called on each created status bar item mock
      createdItems.forEach((item) => {
        expect(item.dispose).toHaveBeenCalledTimes(1);
      });
    });

    it('should dispose all command disposables on deactivate', () => {
      const taskConfig: Task[] = [
        { task: 'build' }, // Single task - no command disposable
        { label: 'Multi1', tasks: [{ task: 'test1' }] }, // Multi task - has command disposable
        { label: 'Multi2', tasks: [{ task: 'test2' }] }, // Multi task - has command disposable
      ];
      vi.mocked(mockConfig.get).mockImplementation((key: string) => {
        if (key === 'tasks') return taskConfig;
        if (key === 'showCounter') return false;
        return undefined;
      });

      const taskButtons = new TaskButtons(mockConfig);
      // Get the command disposables tracked by the mock
      const commandDisposables = vscodeMock.commands.getCommandDisposables();
      // Should have registered commands for the two multi-tasks
      expect(commandDisposables).toHaveLength(2);

      taskButtons.deactivate();

      // Check if dispose was called on each command disposable
      commandDisposables.forEach((disposable) => {
        expect(disposable.dispose).toHaveBeenCalledTimes(1);
      });
    });

    it('should dispose counter item on deactivate', () => {
      const taskConfig: Task[] = [{ task: 'build' }]; // Need at least one task
      vi.mocked(mockConfig.get).mockImplementation((key: string) => {
        if (key === 'tasks') return taskConfig;
        if (key === 'showCounter') return true; // Ensure counter is enabled
        return undefined;
      });

      const taskButtons = new TaskButtons(mockConfig);
      // Get the created items - the first one should be the counter
      const createdItems = vscodeMock.window.getCreatedStatusBarItems();
      expect(createdItems.length).toBeGreaterThanOrEqual(1); // Should have counter + task button
      const counterItem = createdItems[0]; // Assuming counter is created first

      taskButtons.deactivate();

      // Check if dispose was called on the counter item
      expect(counterItem.dispose).toHaveBeenCalledTimes(1);
    });
  });
});
