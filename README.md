# Task Buttons

Define your tasks and then execute them at the click of a button in your taskbar.

![Usage of Task Buttons](https://media.giphy.com/media/hPnRuIXkv7SE61Gj4C/giphy.gif)

## Extension Settings

This extension contributes the following setting:

- `VsCodeTaskButtons.showCounter`: Boolean to show/hide the Task counter. Default true.
- `VsCodeTaskButtons.tasks`: Array used to define tasks. See below for format.

## Format

```
{
  "label": "Label that appears in the taskbar",
  "task": "The vscode task to execute. Must be absent when using 'tasks'",
  "tasks": "List of tasks to show in the Quick Pick Menu",
  "tooltip": "Optional tooltip to show when hovering over the button (defaults to task name)",
  "description": "A description of the task when viewing the task list in the Quick Pick Menu"
}
```

## Known Issues

- None at this time

## Release Notes

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

```

```
