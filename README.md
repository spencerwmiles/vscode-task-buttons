# VSCode Task Buttons

[![CI](https://github.com/spencerwmiles/vscode-task-buttons/actions/workflows/ci.yml/badge.svg)](https://github.com/spencerwmiles/vscode-task-buttons/actions/workflows/ci.yml)
[![Version](https://img.shields.io/visual-studio-marketplace/v/spencerwmiles.vscode-task-buttons)](https://marketplace.visualstudio.com/items?itemName=spencerwmiles.vscode-task-buttons)
[![Installs](https://img.shields.io/visual-studio-marketplace/i/spencerwmiles.vscode-task-buttons)](https://marketplace.visualstudio.com/items?itemName=spencerwmiles.vscode-task-buttons)
[![Rating](https://img.shields.io/visual-studio-marketplace/r/spencerwmiles.vscode-task-buttons)](https://marketplace.visualstudio.com/items?itemName=spencerwmiles.vscode-task-buttons&ssr=false#review-details)

Execute VSCode tasks with a single click directly from your status bar.

![Usage of Task Buttons](https://media.giphy.com/media/hPnRuIXkv7SE61Gj4C/giphy.gif)

## Features

- 🚀 Add task buttons to your VSCode status bar
- 📋 Create quick pick menus for grouped tasks
- 🎨 Customize button appearance with icons and emojis
- 🔄 Dynamic task counter
- ⚙️ Flexible configuration options

## Installation

### From VSCode Marketplace

1. Open VSCode
2. Go to Extensions view (Ctrl+Shift+X / Cmd+Shift+X)
3. Search for "Task Buttons"
4. Click "Install"

### From Command Line

```bash
code --install-extension spencerwmiles.vscode-task-buttons
```

## Getting Started

1. **Define your tasks** in your VSCode `tasks.json` file
2. **Configure Task Buttons** in your VSCode `settings.json` file (see [Configuration](#configuration))
3. **Click the buttons** in your status bar to execute tasks

## Configuration

### Extension Settings

This extension contributes the following settings:

- `VsCodeTaskButtons.showCounter`: Boolean to show/hide the Task counter. Default true.
- `VsCodeTaskButtons.tasks`: Array used to define tasks (see format below).

### Task Button Configuration Format

For each button you define the following object:

```json
{
  "label": "Label that appears in the taskbar",
  "alignment": "The alignment of the button in the taskbar. Options: left and right. Default: left",
  "task": "The vscode task to execute. Must be absent when using 'tasks'",
  "tasks": "List of tasks to show in the Quick Pick Menu",
  "tooltip": "Optional tooltip to show when hovering over the button (defaults to task name)",
  "description": "A description of the task when viewing the task list in the Quick Pick Menu"
}
```

### Customizing Button Appearance

#### Icons

You can add icons to your buttons using the following syntax in the text field:

`$(icon-name)`

A list of all available icon names is [here](https://code.visualstudio.com/api/references/icons-in-labels#icon-listing).

Icons are not supported in the tooltip text.

#### Emoji

You can add Emoji's to the button text and tooltip text.
Just type an emoji as you would any normal character opening your "emoji keyboard" ([Windows](https://support.microsoft.com/en-us/windows/windows-keyboard-tips-and-tricks-588e0b72-0fff-6d3f-aeee-6e5116097942) [MacOS](https://support.apple.com/guide/mac-help/use-emoji-and-symbols-on-mac-mchlp1560/mac))

You can also copy them from [Emojipedia](https://emojipedia.org/)

## Example Configurations

### Basic Configuration

```json
{
  "VsCodeTaskButtons.showCounter": true,
  "VsCodeTaskButtons.tasks": [
    {
      "label": "$(play) Run",
      "task": "run",
      "tooltip": "Start the application"
    },
    {
      "label": "$(beaker) Test",
      "task": "test",
      "tooltip": "Run tests"
    }
  ]
}
```

### Advanced Configuration with Quick Pick Menu

```json
{
  "VsCodeTaskButtons.showCounter": true,
  "VsCodeTaskButtons.tasks": [
    {
      "label": "$(notebook-move-down) Build",
      "task": "build",
      "tooltip": "🛠️ Start the \"build\" task"
    },
    {
      "label": "$(search-refresh) Re-Build",
      "task": "re-build",
      "tooltip": "🧹🛠️ Start the \"re-build\" task"
    },
    {
      "label": "$(notebook-delete-cell) Clean build",
      "task": "clean",
      "tooltip": "🧹 Start a \"clean\" task"
    },
    {
      "label": "$(server-process) Server",
      "tasks": [
        {
          "label": "😀 Start Dev Server",
          "task": "start-dev",
          "description": "$(debug-start) Boots up the development server"
        },
        {
          "label": "🛑 Stop Dev Server",
          "task": "stop-dev",
          "description": "$(debug-pause) Shuts down the development server"
        }
      ]
    }
  ]
}
```

### Mixed Alignment Configuration

```json
{
  "VsCodeTaskButtons.showCounter": true,
  "VsCodeTaskButtons.tasks": [
    {
      "label": "$(play) Run",
      "task": "run",
      "alignment": "left",
      "tooltip": "Start the application"
    },
    {
      "label": "$(stop) Stop",
      "task": "stop",
      "alignment": "right",
      "tooltip": "Stop the application"
    }
  ]
}
```

## Troubleshooting

### Common Issues

#### Task buttons not appearing

- Ensure your tasks are correctly defined in `tasks.json`
- Check for errors in your Task Buttons configuration
- Try reloading VSCode (Command Palette > Developer: Reload Window)

#### Tasks not executing

- Verify task names match exactly between `tasks.json` and Task Buttons configuration
- Check the Output panel (View > Output) for any errors
- Try running the task directly from the Tasks menu to verify it works

#### Button appearance issues

- Ensure icon names are correct and prefixed with `$(`
- Restart VSCode after making configuration changes
- Check that your VSCode version supports the icons you're using

### Reporting Issues

If you encounter any issues:

1. Check the [existing issues](https://github.com/spencerwmiles/vscode-task-buttons/issues) to see if it's already reported
2. If not, [create a new issue](https://github.com/spencerwmiles/vscode-task-buttons/issues/new) with:
   - A clear description of the problem
   - Steps to reproduce
   - Expected vs. actual behavior
   - VSCode version and extension version
   - Screenshots if applicable

## Contributing

Contributions are welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for details on how to get started.

## Release Notes

For full release notes, see [CHANGELOG.md](CHANGELOG.md).

### Latest Release

#### 1.1.3

- Corrected how tasks were being passed through to the executeCommand call for subtasks
- Multiple dependency updates
- See full [CHANGELOG.md](CHANGELOG.md) for details

## License

This extension is licensed under the [MIT License](LICENSE.md).
