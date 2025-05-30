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
  backgroundColor?: ThemeColor;
  color?: ThemeColor;
}

// Keep track of created status bar items within a test run
let createdStatusBarItems: MockStatusBarItem[] = [];

// Add ThemeColor class
export class ThemeColor {
  constructor(public id: string) {}
}

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
  backgroundColor: undefined,
  color: undefined,
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
  // Update to accept a listener and return a disposable
  onDidChangeConfiguration: vi.fn(
    (_listener: (e: { affectsConfiguration: (section: string) => boolean }) => void) => {
      // In a real test setup, you might store and invoke the listener
      // For now, just return the standard mock disposable
      return mockDisposable;
    }
  ),
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

// Mock Uri class with more properties to match vscode.Uri
export class Uri {
  scheme: string;
  authority: string;
  path: string;
  query: string;
  fragment: string;

  constructor(scheme: string, authority: string, path: string, query: string, fragment: string) {
    this.scheme = scheme;
    this.authority = authority;
    this.path = path;
    this.query = query;
    this.fragment = fragment;
  }

  static parse(value: string): Uri {
    // Very basic parser, assumes file URI or simple path
    if (value.startsWith('file://')) {
      const path = value.substring(7);
      // Crude split, doesn't handle complex authorities, queries, fragments
      return new Uri('file', '', path, '', '');
    }
    // Assume it's just a path for simplicity in mock
    return new Uri('file', '', value, '', '');
  }

  get fsPath(): string {
    // Basic conversion, might need refinement for different OS/formats
    return this.scheme === 'file' ? this.path : `/non/file/path/${this.path}`;
  }

  toString(_skipEncoding?: boolean): string {
    // Prefix unused parameter
    // Simple mock toString
    return `${this.scheme}://${this.authority}${this.path}${this.query ? `?${this.query}` : ''}${this.fragment ? `#${this.fragment}` : ''}`;
  }

  // Add other methods like with, toJSON if needed by tests
  with(change: {
    scheme?: string;
    authority?: string;
    path?: string;
    query?: string;
    fragment?: string;
  }): Uri {
    return new Uri(
      change.scheme ?? this.scheme,
      change.authority ?? this.authority,
      change.path ?? this.path,
      change.query ?? this.query,
      change.fragment ?? this.fragment
    );
  }

  // Define a type for the JSON representation
  toJSON(): { $mid: number; scheme: string; path: string; fsPath: string; external: string } {
    return {
      $mid: 1, // Mock value
      scheme: this.scheme,
      path: this.path,
      fsPath: this.fsPath,
      external: this.toString(),
    };
  }
}

// Mock Enums needed by ExtensionContext
export const ExtensionMode = {
  Production: 1,
  Development: 2,
  Test: 3,
};

export const ExtensionKind = {
  UI: 1,
  Workspace: 2,
};

// Export the mocked APIs
export const window = mockWindow;
export const workspace = mockWorkspace;
export const commands = mockCommands;
export const Disposable = {
  from: vi.fn(() => mockDisposable), // Mock static Disposable.from if needed
};

// --- Basic Mock Types/Interfaces ---
// These are needed to satisfy the 'as unknown as vscode.Type' casts in main.test.ts
// They don't need full implementations unless the tests actually use their methods.

export interface EnvironmentVariableCollection {
  persistent: boolean;
  replace(variable: string, value: string): void;
  append(variable: string, value: string): void;
  prepend(variable: string, value: string): void;
  get(variable: string): string | undefined;
  forEach(
    callback: (
      variable: string,
      mutator: unknown, // Use unknown instead of any
      collection: EnvironmentVariableCollection
    ) => unknown, // Use unknown instead of any
    thisArg?: unknown // Use unknown instead of any
  ): void;
  delete(variable: string): void;
  clear(): void;
  // Add the missing method based on the error in main.test.ts
  getScoped(scope: unknown): unknown; // Use unknown instead of any
}

export interface SecretStorage {
  get(key: string): Promise<string | undefined>;
  store(key: string, value: string): Promise<void>;
  delete(key: string): Promise<void>;
  onDidChange: unknown; // Use unknown instead of any
}

export interface Memento {
  keys(): readonly string[];
  get<T>(key: string): T | undefined;
  get<T>(key: string, defaultValue: T): T;
  update(key: string, value: unknown): Promise<void>; // Use unknown instead of any
  // Add the missing method based on the error in main.test.ts
  setKeysForSync(keys: readonly string[]): void; // Make non-optional for globalState
}

export interface Extension<T> {
  readonly id: string;
  readonly extensionUri: Uri;
  readonly extensionPath: string;
  readonly isActive: boolean;
  readonly packageJSON: unknown; // Use unknown instead of any
  readonly extensionKind: (typeof ExtensionKind)[keyof typeof ExtensionKind];
  readonly exports: T;
  activate(): Promise<T>;
}

// --- End Basic Mock Types/Interfaces ---

// Export other types/interfaces if needed by tests
// Keep the original simple ExtensionContext for basic structure if preferred,
// but the main.test.ts uses the ActualVscode.ExtensionContext type now.
// export interface ExtensionContext {
//   subscriptions: { push: (disposable: { dispose: () => void }) => void }[];
//   // Add other context properties if needed
// }

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
