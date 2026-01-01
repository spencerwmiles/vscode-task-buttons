## [1.3.3](https://github.com/spencerwmiles/vscode-task-buttons/compare/v1.3.2...v1.3.3) (2026-01-01)

### Bug Fixes

- removed steps for handling rc in naming convention ([5919c68](https://github.com/spencerwmiles/vscode-task-buttons/commit/5919c6871fe74d6d976db0f2f5714ea839b19f4b))

## [1.3.1](https://github.com/spencerwmiles/vscode-task-buttons/compare/v1.3.0...v1.3.1) (2025-05-30)

### Housekeeping

- Bump 1.3.1 to override 1.3.0 pre-release in vscode marketplace

## [1.3.0](https://github.com/spencerwmiles/vscode-task-buttons/compare/v1.1.3...v1.3.0) (2025-05-30)

### Features

- Added color customization options for task buttons (default, error, warning) in TaskButtons.ts. ([f1a5ccf](https://github.com/spencerwmiles/vscode-task-buttons/commit/f1a5ccfc0bfc61c8f4e44e77486028f61e19e9a5))
- Modernize project setup and integrate semantic-release ([#109](https://github.com/spencerwmiles/vscode-task-buttons/issues/109)) ([a7665a9](https://github.com/spencerwmiles/vscode-task-buttons/commit/a7665a96f21b0564f1c947b8082a9c9531cf3e03))

### Bug Fixes

- cleaned up workflow configuration and streamlined pnpm config/install ([#114](https://github.com/spencerwmiles/vscode-task-buttons/issues/114)) ([74ea2e7](https://github.com/spencerwmiles/vscode-task-buttons/commit/74ea2e705a5a7b3b35a5abaf9b2ed12f46aee732))
- corrected tsconfig for build and improved pre-release workflow ([#113](https://github.com/spencerwmiles/vscode-task-buttons/issues/113)) ([9bb0206](https://github.com/spencerwmiles/vscode-task-buttons/commit/9bb020625aac8c7d38b3dae31e521295f10e33f4))
- removed --frozen-lockfile from release promotion ([#110](https://github.com/spencerwmiles/vscode-task-buttons/issues/110)) ([c93c421](https://github.com/spencerwmiles/vscode-task-buttons/commit/c93c421f95aa4d32f830bbebb2f53c3201bac7de))
- removed --frozen-lockfile from pnpm install ([f51bb5e](https://github.com/spencerwmiles/vscode-task-buttons/commit/f51bb5e3f8508e8e6bcbe31650c1b937192510fb))
- updated dependabot to use dev for target branch ([8198b22](https://github.com/spencerwmiles/vscode-task-buttons/commit/8198b2200dcb9990c1020a8445587d1c9b71b354))
- workaround for non semver versioning for extension marketplace ([ab54c1c](https://github.com/spencerwmiles/vscode-task-buttons/commit/ab54c1c9a6ee984cbbbf3ed12068217c12a28eb0))

### Code Refactoring

- removed tests from tsconfig exclude and just solved for file inclusion via whitelist in package.json (kiss amirite) ([bb5e035](https://github.com/spencerwmiles/vscode-task-buttons/commit/bb5e035ed67589040cddda0496b0f62d376c0042))
- streamline release workflows ([d67187d](https://github.com/spencerwmiles/vscode-task-buttons/commit/d67187d805c2d52d92d28ff73ab708dc10a64ea2))

### Housekeeping

- **release:** 1.2.3-rc.1 [skip ci] ([8b63e9a](https://github.com/spencerwmiles/vscode-task-buttons/commit/8b63e9a3c3f8198c9c6f722836dd4e71b7cbf209))
- **release:** Update package.json and CHANGELOG.md for pre-release 1.3.0-rc.1 ([4977485](https://github.com/spencerwmiles/vscode-task-buttons/commit/4977485877cf159c26ee0a72db5a914fe60783fa))
- **release:** Updates for pre-release 1.2.3-rc.3 ([b7437fe](https://github.com/spencerwmiles/vscode-task-buttons/commit/b7437fe803d7d8197e4ac4fd31717c2e67520abf))
- removed section from readme ([2cf78b5](https://github.com/spencerwmiles/vscode-task-buttons/commit/2cf78b504966b09ebe7fec2561a6e90db496b080))
- Trigger production release for v1.3.0 ([c99ad3c](https://github.com/spencerwmiles/vscode-task-buttons/commit/c99ad3cebd510a65b5b3dddf201394b378217c93))
- update dependabot configuration to daily checks and group dependencies by type ([4e383d4](https://github.com/spencerwmiles/vscode-task-buttons/commit/4e383d40604257ff8bff504f19496f88a5816b5f))
- update eslint configuration and package.json to remove prettier plugin and adjust format command ([c3b865e](https://github.com/spencerwmiles/vscode-task-buttons/commit/c3b865e3bd6c11197fe606736d40b49fda95c013))
- update package.json to specify files and modify tsconfig.json exclusions ([7033a45](https://github.com/spencerwmiles/vscode-task-buttons/commit/7033a45778ea4144255168c8a353171b596838ce))
- Update release workflow to automate pre-release version updates ([#111](https://github.com/spencerwmiles/vscode-task-buttons/issues/111)) ([082c72f](https://github.com/spencerwmiles/vscode-task-buttons/commit/082c72ff849f014e25b851dfe544fa9755bdd38a))
- Update release workflows and configuration for improved versioning and CI/CD process ([#116](https://github.com/spencerwmiles/vscode-task-buttons/issues/116)) ([b5f0a90](https://github.com/spencerwmiles/vscode-task-buttons/commit/b5f0a909c3ba8eee3219417f226a47a3ab3a767d))
- updated branch name references to staging instead of main ([d37ec04](https://github.com/spencerwmiles/vscode-task-buttons/commit/d37ec04a8555ed788174704f20dd465e6afbbd7a))

### 1.1.3

- Bump @typescript-eslint/eslint-plugin from 5.59.0 to 5.59.1 by @dependabot in https://github.com/spencerwmiles/vscode-task-buttons/pull/45
- Bump @typescript-eslint/parser from 5.59.0 to 5.59.1 by @dependabot in https://github.com/spencerwmiles/vscode-task-buttons/pull/47
- Bump @types/node from 18.16.0 to 18.16.3 by @dependabot in https://github.com/spencerwmiles/vscode-task-buttons/pull/46
- Bump @typescript-eslint/parser from 5.59.1 to 5.59.2 by @dependabot in https://github.com/spencerwmiles/vscode-task-buttons/pull/52
- Bump eslint from 8.39.0 to 8.40.0 by @dependabot in https://github.com/spencerwmiles/vscode-task-buttons/pull/48
- Bump @typescript-eslint/eslint-plugin from 5.59.1 to 5.59.5 by @dependabot in https://github.com/spencerwmiles/vscode-task-buttons/pull/54
- Bump @typescript-eslint/parser from 5.59.2 to 5.59.5 by @dependabot in https://github.com/spencerwmiles/vscode-task-buttons/pull/56
- Bump eslint from 8.40.0 to 8.41.0 by @dependabot in https://github.com/spencerwmiles/vscode-task-buttons/pull/58
- Bump @typescript-eslint/parser from 5.59.5 to 5.59.8 by @dependabot in https://github.com/spencerwmiles/vscode-task-buttons/pull/67
- Bump @typescript-eslint/eslint-plugin from 5.59.5 to 5.59.8 by @dependabot in https://github.com/spencerwmiles/vscode-task-buttons/pull/68
- Bump @types/vscode from 1.77.0 to 1.78.1 by @dependabot in https://github.com/spencerwmiles/vscode-task-buttons/pull/64
- Bump @types/node from 18.16.3 to 20.2.5 by @dependabot in https://github.com/spencerwmiles/vscode-task-buttons/pull/62
- Corrected how tasks were being passed through to the executeCommand call for subtasks by @spencerwmiles in https://github.com/spencerwmiles/vscode-task-buttons/pull/66

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
