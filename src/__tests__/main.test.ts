import { afterEach, beforeEach, describe, expect, it, type Mock, vi } from 'vitest'; // Combine imports
import type * as ActualVscode from 'vscode'; // Import actual vscode types
import * as vscode from './vscode.js'; // Import the mock
import { activate, deactivate, getExtension } from '../main.js'; // Import functions to test (removed CONFIGURATION_SECTION)
import TaskButtons, { CONFIGURATION_SECTION } from '../TaskButtons.js'; // Import the original class AND constant

// Mock the TaskButtons class
const mockTaskButtonsInstance = {
  activate: vi.fn(),
  deactivate: vi.fn(),
  update: vi.fn(),
  _refreshUI: vi.fn(), // Add other methods if needed by main.ts indirectly
};
vi.mock('../TaskButtons', () => {
  // Default export needs to be handled like this
  return {
    default: vi.fn().mockImplementation(() => mockTaskButtonsInstance),
    CONFIGURATION_SECTION: 'taskButtons', // Ensure the constant is exported
  };
});

// Define a type for the mock WorkspaceConfiguration using correct Mock syntax
type MockWorkspaceConfiguration = {
  get: Mock<(key: string, defaultValue?: unknown) => unknown>;
  has: Mock<(key: string) => boolean>;
  update: Mock<
    (
      key: string,
      value: unknown,
      configurationTarget?: boolean | ActualVscode.ConfigurationTarget
    ) => Promise<void>
  >; // Use actual type for target
  inspect: Mock<
    (key: string) =>
      | {
          key: string;
          globalValue?: unknown;
          workspaceValue?: unknown;
          workspaceFolderValue?: unknown;
        }
      | undefined
  >; // Expanded inspect result type
};

// Define a more complete mock ExtensionContext based on vscode.d.ts and error messages
// Use the actual vscode types for casting where needed
const mockContext: ActualVscode.ExtensionContext = {
  extensionUri: vscode.Uri.parse('file:///mock/extension/path'),
  storageUri: vscode.Uri.parse('file:///mock/storage/path'), // Added based on error
  globalStorageUri: vscode.Uri.parse('file:///mock/globalStorage/path'), // Added based on error
  logUri: vscode.Uri.parse('file:///mock/log/path'), // Added based on error
  storagePath: '/mock/storage/path', // Deprecated but might be needed
  globalStoragePath: '/mock/globalStorage/path', // Deprecated but might be needed
  logPath: '/mock/log/path', // Deprecated but might be needed
  extensionMode: vscode.ExtensionMode.Test,
  extensionPath: '/mock/extension/path', // Deprecated but might be needed
  environmentVariableCollection: {
    persistent: false,
    description: undefined, // Add missing property
    replace: vi.fn(),
    append: vi.fn(),
    prepend: vi.fn(),
    get: vi.fn(),
    forEach: vi.fn(),
    delete: vi.fn(),
    clear: vi.fn(),
    [Symbol.iterator]: vi.fn(),
    getScoped: vi.fn(), // Add missing method
  }, // Remove cast
  secrets: {
    get: vi.fn(),
    store: vi.fn(),
    delete: vi.fn(),
    onDidChange: vi.fn(() => ({ dispose: vi.fn() })),
  } as unknown as ActualVscode.SecretStorage, // Mock vscode.SecretStorage
  globalState: {
    get: vi.fn(),
    update: vi.fn(),
    keys: vi.fn(() => []),
    setKeysForSync: vi.fn(), // Add missing method
  }, // Remove cast
  workspaceState: {
    get: vi.fn(),
    update: vi.fn(),
    keys: vi.fn(() => []),
  } as unknown as ActualVscode.Memento, // Mock vscode.Memento
  subscriptions: [], // Initialize as an empty array
  extension: {
    // Mock vscode.Extension
    id: 'mock.extension',
    extensionUri: vscode.Uri.parse('file:///mock/extension/path'),
    extensionPath: '/mock/extension/path',
    isActive: true,
    packageJSON: {},
    extensionKind: vscode.ExtensionKind.Workspace,
    exports: {},
    activate: vi.fn().mockResolvedValue({}),
  } as unknown as ActualVscode.Extension<unknown>, // Use unknown instead of any
  asAbsolutePath: (relativePath: string) => `/mock/extension/path/${relativePath}`,
  // Add missing property based on TS error
  languageModelAccessInformation: {
    onDidChange: vi.fn(() => ({ dispose: vi.fn() })),
    canSendRequest: vi.fn(() => true), // Mock implementation
  },
};

// Define the type for the configuration change event and listener
type ConfigurationChangeEvent = { affectsConfiguration: (section: string) => boolean };
type ConfigurationChangeListener = (e: ConfigurationChangeEvent) => void;

// Helper to trigger the configuration change listener
let configChangeListener: ConfigurationChangeListener | undefined;

describe('Extension Main', () => {
  beforeEach(() => {
    // Reset mocks and context before each test
    vi.clearAllMocks();
    // Clear the subscriptions array instead of reassigning (it's readonly)
    while (mockContext.subscriptions.length > 0) {
      mockContext.subscriptions.pop()?.dispose(); // Dispose and remove
    }

    // Capture the listener registered by onDidChangeConfiguration
    // Use the correct listener type defined earlier
    vscode.workspace.onDidChangeConfiguration.mockImplementation(
      (listener: ConfigurationChangeListener) => {
        configChangeListener = listener; // Store the listener
        return { dispose: vi.fn() }; // Return a mock disposable
      }
    );
    // NOTE: deactivate() moved to afterEach to prevent interfering with mock call counts
  });

  afterEach(() => {
    // Reset the internal state of main.ts AFTER each test
    deactivate();
    configChangeListener = undefined; // Clean up listener reference
  });

  describe('activate', () => {
    it('should create a TaskButtons instance with initial configuration', () => {
      // Use the defined type for the mock config
      const mockConfig: MockWorkspaceConfiguration = {
        get: vi.fn(),
        has: vi.fn(),
        update: vi.fn(),
        inspect: vi.fn(),
      };
      vscode.workspace.getConfiguration.mockReturnValue(mockConfig); // No cast needed

      activate(mockContext);

      expect(vscode.workspace.getConfiguration).toHaveBeenCalledWith(CONFIGURATION_SECTION);
      expect(TaskButtons).toHaveBeenCalledTimes(1);
      expect(TaskButtons).toHaveBeenCalledWith(mockConfig);
    });

    it('should register an onDidChangeConfiguration listener', () => {
      activate(mockContext);
      expect(vscode.workspace.onDidChangeConfiguration).toHaveBeenCalledTimes(1);
      expect(typeof configChangeListener).toBe('function');
      // Check if the disposable was added to subscriptions
      expect(mockContext.subscriptions).toHaveLength(1);
      expect(mockContext.subscriptions[0]).toHaveProperty('dispose');
    });

    it('should call activate on the TaskButtons instance', () => {
      activate(mockContext);
      expect(mockTaskButtonsInstance.activate).toHaveBeenCalledTimes(1);
    });

    it('should return the created TaskButtons instance', () => {
      const instance = activate(mockContext);
      expect(instance).toBe(mockTaskButtonsInstance);
    });

    it('should update TaskButtons instance when relevant configuration changes', () => {
      activate(mockContext); // Initial activation

      // Use the defined type for the mock config
      const newMockConfig: MockWorkspaceConfiguration = {
        get: vi.fn().mockReturnValue('new value'),
        has: vi.fn(),
        update: vi.fn(),
        inspect: vi.fn(),
      };
      vscode.workspace.getConfiguration.mockReturnValue(newMockConfig); // No cast needed

      // Simulate a configuration change event that affects the extension
      configChangeListener?.({
        affectsConfiguration: (section) => section === CONFIGURATION_SECTION,
      });

      expect(vscode.workspace.getConfiguration).toHaveBeenCalledTimes(2); // Initial + Update
      expect(vscode.workspace.getConfiguration).toHaveBeenLastCalledWith(CONFIGURATION_SECTION);
      expect(mockTaskButtonsInstance.update).toHaveBeenCalledTimes(1);
      expect(mockTaskButtonsInstance.update).toHaveBeenCalledWith(newMockConfig);
    });

    it('should NOT update TaskButtons instance when other configuration changes', () => {
      activate(mockContext); // Initial activation

      // Simulate a configuration change event that does NOT affect the extension
      configChangeListener?.({ affectsConfiguration: (section) => section === 'other.section' });

      expect(mockTaskButtonsInstance.update).not.toHaveBeenCalled();
    });

    it('should handle configuration change only if extension instance exists', () => {
      // Register listener but don't create instance yet (edge case test)
      // Use the correct listener type defined earlier
      // This specific mock implementation needs to match the expected signature
      // Return type should be the mock disposable structure
      const mockImplementation = (
        listener: ConfigurationChangeListener
      ): { dispose: Mock<() => void> } => {
        configChangeListener = listener; // Store the listener
        return { dispose: vi.fn() };
      };
      vscode.workspace.onDidChangeConfiguration.mockImplementation(mockImplementation);

      // Simulate change before activation completes or after deactivation
      configChangeListener?.({
        affectsConfiguration: (section) => section === CONFIGURATION_SECTION,
      });

      expect(mockTaskButtonsInstance.update).not.toHaveBeenCalled();
    });
  });

  describe('deactivate', () => {
    it('should call deactivate on the TaskButtons instance if it exists', () => {
      activate(mockContext); // Ensure instance exists
      deactivate();
      expect(mockTaskButtonsInstance.deactivate).toHaveBeenCalledTimes(1);
    });

    it('should set the internal extension reference to undefined', () => {
      activate(mockContext);
      expect(getExtension()).toBeDefined(); // Check it exists first
      deactivate();
      expect(getExtension()).toBeUndefined();
    });

    it('should not throw if deactivate is called when no instance exists', () => {
      expect(() => deactivate()).not.toThrow();
      expect(mockTaskButtonsInstance.deactivate).not.toHaveBeenCalled();
    });
  });

  describe('getExtension', () => {
    it('should return undefined initially', () => {
      expect(getExtension()).toBeUndefined();
    });

    it('should return the TaskButtons instance after activation', () => {
      activate(mockContext);
      expect(getExtension()).toBe(mockTaskButtonsInstance);
    });

    it('should return undefined after deactivation', () => {
      activate(mockContext);
      deactivate();
      expect(getExtension()).toBeUndefined();
    });
  });
});
