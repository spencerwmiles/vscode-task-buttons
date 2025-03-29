import { vi } from 'vitest';

// Store registered commands
const registeredCommands = new Map<string, (...args: unknown[]) => unknown>();

// Define type for command disposable
type CommandDisposable = { dispose: ReturnType<typeof vi.fn> };

// Store command disposables
let commandDisposables: CommandDisposable[] = [];

// Mock implementation for Disposable
const mockDisposable = {
  dispose: vi.fn(() => {
    // Optionally, remove the command from the map when disposed
    // This requires registerCommand to return the commandId or pass it to dispose
  }),
};

// Define an interface for the mock StatusBarItem
// Use the inferred type from vi.fn() instead of explicit Mock<>
interface MockStatusBarItem {
  show: ReturnType<typeof vi.fn>;
  hide: ReturnType<typeof vi.fn>;
  dispose: ReturnType<typeof vi.fn>;
  text: string;
  tooltip: string;
  command:
    | string
    | { command: string; title: string; tooltip?: string; arguments?: unknown[] }
    | undefined;
  alignment: number | undefined;
  priority: number | undefined;
}

// Keep track of created status bar items within a test run
let createdStatusBarItems: MockStatusBarItem[] = [];

// Mock implementation for StatusBarItem
const createMockStatusBarItem = (alignment: number, priority?: number): MockStatusBarItem => ({
  show: vi.fn(),
  hide: vi.fn(),
  dispose: vi.fn(),
  text: '',
  tooltip: '',
  command: undefined,
  alignment,
  priority,
});

// Mock implementation for window API
const mockWindow = {
  // Return a fresh mock each time, but keep track of them
  createStatusBarItem: vi.fn((alignment: number, priority?: number): MockStatusBarItem => {
    const newItem = createMockStatusBarItem(alignment, priority);
    createdStatusBarItems.push(newItem);
    return newItem;
  }),
  showQuickPick: vi.fn(),
  // Helper for tests to get the created items
  getCreatedStatusBarItems: (): MockStatusBarItem[] => createdStatusBarItems,
};

// Mock implementation for workspace API
const mockWorkspace = {
  getConfiguration: vi.fn(() => ({
    // Mock WorkspaceConfiguration
    get: vi.fn((key: string, defaultValue?: unknown) => {
      // Provide default mock values based on TaskButtons usage
      if (key === 'tasks') return defaultValue ?? [];
      if (key === 'showCounter') return defaultValue ?? true;
      return defaultValue;
    }),
    // Add other WorkspaceConfiguration methods if needed (update, inspect, etc.)
    has: vi.fn(),
    update: vi.fn(),
    inspect: vi.fn(),
  })),
  onDidChangeConfiguration: vi.fn(() => mockDisposable), // Returns a disposable
};

// Mock implementation for commands API
const mockCommands = {
  registerCommand: vi.fn(
    (commandId: string, callback: (...args: unknown[]) => unknown): CommandDisposable => {
      registeredCommands.set(commandId, callback);
      const disposable: CommandDisposable = {
        // Return a disposable specific to this registration
        dispose: vi.fn(() => {
          registeredCommands.delete(commandId);
        }),
      };
      commandDisposables.push(disposable); // Keep track of the disposable
      return disposable;
    }
  ),
  executeCommand: vi.fn(async (commandId: string, ...args: unknown[]) => {
    const callback = registeredCommands.get(commandId);
    if (callback) {
      return await callback(...args); // Execute the registered callback
    }
    // Optionally handle cases where the command is not found
    console.warn(`Mock executeCommand: Command '${commandId}' not registered.`);
    return undefined;
  }),
  // Helper to get tracked command disposables
  getCommandDisposables: (): CommandDisposable[] => commandDisposables,
};

// Mock Enums (using simple objects/numbers)
export const StatusBarAlignment = {
  Left: 1,
  Right: 2,
};

// Export the mocked APIs
export const window = mockWindow;
export const workspace = mockWorkspace;
export const commands = mockCommands;
export const Disposable = {
  from: vi.fn(() => mockDisposable), // Mock static Disposable.from if needed
};

// Export other types/interfaces if needed by tests
export interface ExtensionContext {
  subscriptions: { push: (disposable: { dispose: () => void }) => void }[];
  // Add other context properties if needed
}

// Helper to reset mocks between tests
export const resetMocks = vi.fn(() => {
  mockDisposable.dispose.mockClear();
  // Clear mocks for individual status bar items
  createdStatusBarItems.forEach((item) => {
    item.show.mockClear();
    item.hide.mockClear();
    item.dispose.mockClear();
  });
  createdStatusBarItems = []; // Reset the list of created items

  // Clear mocks for command disposables
  commandDisposables.forEach((disposable) => {
    disposable.dispose.mockClear();
  });
  commandDisposables = []; // Reset the list

  mockWindow.createStatusBarItem.mockClear();
  mockWindow.showQuickPick.mockClear();
  mockWorkspace.getConfiguration.mockClear();
  mockWorkspace.getConfiguration().get.mockClear(); // Clear mocks on the returned object too
  mockWorkspace.onDidChangeConfiguration.mockClear();
  mockCommands.registerCommand.mockClear();
  mockCommands.executeCommand.mockClear();
  Disposable.from.mockClear();
  registeredCommands.clear(); // Clear the registered commands map
});

// You might need to export more specific types or interfaces
// based on what TaskButtons.ts imports and uses.
