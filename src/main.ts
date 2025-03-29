import * as vscode from 'vscode';
import TaskButtons, { CONFIGURATION_SECTION } from './TaskButtons';

let extension: TaskButtons | undefined;

export function getExtension(): TaskButtons | undefined {
  return extension;
}

export function activate(context: vscode.ExtensionContext): TaskButtons {
  // Get the initial configuration
  const config = vscode.workspace.getConfiguration(CONFIGURATION_SECTION);

  // Create the initial instance, passing the WorkspaceConfiguration object
  extension = new TaskButtons(config);

  // Register configuration change handler
  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration((e) => {
      // Check if our extension's configuration changed and the instance exists
      if (e.affectsConfiguration(CONFIGURATION_SECTION) && extension) {
        const newConfig = vscode.workspace.getConfiguration(CONFIGURATION_SECTION);
        // Call the update method on the existing instance
        extension.update(newConfig);
      }
    })
  );

  // Activate the initial instance (which now calls _refreshUI internally)
  extension.activate();
  return extension;
}

export function deactivate(): void {
  if (extension) {
    extension.deactivate();
    extension = undefined; // Clear the global reference on full deactivation
  }
}
