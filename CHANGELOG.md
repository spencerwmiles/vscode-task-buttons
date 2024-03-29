# Change Log

All notable changes to the "vscode-task-buttons" extension will be documented in this file.

### 1.1.3
* Bump @typescript-eslint/eslint-plugin from 5.59.0 to 5.59.1 by @dependabot in https://github.com/spencerwmiles/vscode-task-buttons/pull/45
* Bump @typescript-eslint/parser from 5.59.0 to 5.59.1 by @dependabot in https://github.com/spencerwmiles/vscode-task-buttons/pull/47
* Bump @types/node from 18.16.0 to 18.16.3 by @dependabot in https://github.com/spencerwmiles/vscode-task-buttons/pull/46
* Bump @typescript-eslint/parser from 5.59.1 to 5.59.2 by @dependabot in https://github.com/spencerwmiles/vscode-task-buttons/pull/52
* Bump eslint from 8.39.0 to 8.40.0 by @dependabot in https://github.com/spencerwmiles/vscode-task-buttons/pull/48
* Bump @typescript-eslint/eslint-plugin from 5.59.1 to 5.59.5 by @dependabot in https://github.com/spencerwmiles/vscode-task-buttons/pull/54
* Bump @typescript-eslint/parser from 5.59.2 to 5.59.5 by @dependabot in https://github.com/spencerwmiles/vscode-task-buttons/pull/56
* Bump eslint from 8.40.0 to 8.41.0 by @dependabot in https://github.com/spencerwmiles/vscode-task-buttons/pull/58
* Bump @typescript-eslint/parser from 5.59.5 to 5.59.8 by @dependabot in https://github.com/spencerwmiles/vscode-task-buttons/pull/67
* Bump @typescript-eslint/eslint-plugin from 5.59.5 to 5.59.8 by @dependabot in https://github.com/spencerwmiles/vscode-task-buttons/pull/68
* Bump @types/vscode from 1.77.0 to 1.78.1 by @dependabot in https://github.com/spencerwmiles/vscode-task-buttons/pull/64
* Bump @types/node from 18.16.3 to 20.2.5 by @dependabot in https://github.com/spencerwmiles/vscode-task-buttons/pull/62
* Corrected how tasks were being passed through to the executeCommand call for subtasks by @spencerwmiles in https://github.com/spencerwmiles/vscode-task-buttons/pull/66

**Full Changelog**: https://github.com/spencerwmiles/vscode-task-buttons/compare/v1.1.2...v.1.1.3

### 1.1.2
- Under the hood repo cleanup

### 1.1.1
- Updated dependencies

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
