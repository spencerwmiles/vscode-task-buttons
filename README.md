# Task Buttons

Define your tasks and then execute them at the click of a button in your taskbar.

![Usage of Task Buttons](https://media.giphy.com/media/hPnRuIXkv7SE61Gj4C/giphy.gif)

## Extension Settings

This extension contributes the following setting:

- `VsCodeTaskButtons.showCounter`: Boolean to show/hide the Task counter. Default true.
- `VsCodeTaskButtons.tasks`: Array used to define tasks. See below for format.

### Task button configuration format

For each button you define the following object:

```
{
  "label": "Label that appears in the taskbar",
  "alignment": "The alignment of the button in the taskbar. Options: left and right. Default: left",
  "task": "The vscode task to execute. Must be absent when using 'tasks'",
  "tasks": "List of tasks to show in the Quick Pick Menu",
  "tooltip": "Optional tooltip to show when hovering over the button (defaults to task name)",
  "description": "A description of the task when viewing the task list in the Quick Pick Menu"
}
```

#### Icons

You can add icons to your buttons using the following syntax in the text field:

    $(icon-name)

A list of all available icon names (sourced from the VSCode theme) is [here](https://code.visualstudio.com/api/references/icons-in-labels#icon-listing)

Icons are not supported in the tooltip text.

#### Emoji

You can add Emoji's to the button text and tooltip text.
Just type an emoji as you would any normal character opening your "emoji keyboard" ([Windows](https://support.microsoft.com/en-us/windows/windows-keyboard-tips-and-tricks-588e0b72-0fff-6d3f-aeee-6e5116097942) [MacOS](https://support.apple.com/guide/mac-help/use-emoji-and-symbols-on-mac-mchlp1560/mac))

You can also copy them from [Emojipedia](https://emojipedia.org/)

### Example configuration

The following `settings.json` example gives you four buttons using icons and emojis with one of the buttons opening up two more commands in the quick pick menu. It also has the task counter enabled.

```
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
            "label": "$(server-process) Server"
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

## Issues / Feature Requests

https://github.com/spencerwmiles/vscode-task-buttons/issues

## Release Notes

### 1.1.1
- Updated dependencies
- Fixed bad JSON in package.json

### 1.1.0

- Rewrite of the extension ot use TypeScript (Shoutout to [Fabje](https://github.com/FaBjE) for the support)
- Added support for alignment of buttons via "alignment property" (default: left - options: left, right)
- Added MIT license (Thanks [gameguy682](https://github.com/gameguy682))
- Added Quick Pick Menu

### 1.0.4

- Fixed issue with task counter not updating (closed issue #12) [PR](https://github.com/spencerwmiles/vscode-task-buttons/pull/14)
- Shoutout to [Fabje](https://github.com/FaBjE) for the PR

### 1.0.3

- Task Buttons now include the ability to show a tooltip on hover via an added `tooltip` property.
- Thanks to @oleksiikutuzov for the suggestion.

### 1.0.2

- Task Buttons will reload on configuration change. Reload was previously required.

### 1.0.1

- Updated documentation

### 1.0.0

- Initial release of Task Buttons
