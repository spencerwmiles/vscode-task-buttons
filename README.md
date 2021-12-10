# Task Buttons

Define your tasks and then execute them at the click of a button in your taskbar.

![Usage of Task Buttons](https://media.giphy.com/media/hPnRuIXkv7SE61Gj4C/giphy.gif)

## Extension Settings

This extension contributes the following setting:

- `VsCodeTaskButtons.tasks`: Array used to define tasks. See below for format.

## Format

```
{
  "label": "Label that appears in the taskbar",
  "task": "The vscode task to execute",
}
```

## Known Issues

- None at this time

## Release Notes

### 1.0.2

- Task Buttons will reload on configuration change. Reload was previously required.

### 1.0.1

- Updated documentation

### 1.0.0

- Initial release of Task Buttons
