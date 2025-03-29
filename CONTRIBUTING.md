# Contributing to VSCode Task Buttons

Thank you for your interest in contributing to VSCode Task Buttons! This document provides guidelines and instructions to help you get started with contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
  - [Development Environment Setup](#development-environment-setup)
  - [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
  - [Making Changes](#making-changes)
  - [Testing](#testing)
  - [Building](#building)
- [Pull Request Process](#pull-request-process)
  - [PR Guidelines](#pr-guidelines)
  - [Code Review Process](#code-review-process)
- [Coding Standards](#coding-standards)
  - [TypeScript Guidelines](#typescript-guidelines)
  - [Testing Requirements](#testing-requirements)
  - [Documentation](#documentation)
- [Release Process](#release-process)
- [Getting Help](#getting-help)

## Code of Conduct

This project adheres to a standard Code of Conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

## Getting Started

### Development Environment Setup

1. **Prerequisites**

   - Node.js (version 18 or later)
   - pnpm (version 8 or later)
   - Visual Studio Code

2. **Clone the Repository**

   ```bash
   git clone https://github.com/spencerwmiles/vscode-task-buttons.git
   cd vscode-task-buttons
   ```

3. **Install Dependencies**

   ```bash
   pnpm install
   ```

4. **Set Up Git Hooks**
   The project uses Husky for git hooks to ensure code quality. The hooks will be installed automatically when you run `pnpm install`.

### Project Structure

- `src/`: Source code files
  - `main.ts`: Extension entry point
  - `TaskButtons.ts`: Main implementation of task buttons functionality
  - `__tests__/`: Test files
- `.github/`: GitHub workflows and configurations
- `build/`: Build scripts and configurations
- `out/`: Compiled JavaScript files (generated during build)

## Development Workflow

### Making Changes

1. Create a new branch for your changes:

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes to the codebase.

3. Follow the coding standards and guidelines (see [Coding Standards](#coding-standards)).

4. Commit your changes with a clear, descriptive commit message:

   ```bash
   git commit -m "feat: add new feature for XYZ"
   ```

5. Push your branch to GitHub:
   ```bash
   git push origin feature/your-feature-name
   ```

### Testing

1. **Running Tests**

   ```bash
   # Run all tests
   pnpm test

   # Run tests in watch mode
   pnpm test:watch

   # Run tests with coverage
   pnpm test -- --coverage
   ```

2. **Writing Tests**
   - All new features should be accompanied by tests
   - Tests should be placed in the `src/__tests__/` directory
   - Use descriptive test names that explain what is being tested
   - Follow the AAA pattern (Arrange, Act, Assert)
   - Maintain at least 80% code coverage

### Building

1. **Building the Extension**

   ```bash
   pnpm build
   ```

2. **Watching for Changes**

   ```bash
   pnpm watch
   ```

3. **Packaging the Extension**
   ```bash
   pnpm package
   ```

## Pull Request Process

### PR Guidelines

1. Ensure your code follows the project's coding standards.
2. Update documentation if necessary.
3. Add tests for new functionality.
4. Ensure all tests pass and there are no linting errors.
5. Update the CHANGELOG.md file with details of changes.
6. The PR should be submitted against the `main` branch.

### Code Review Process

1. At least one core maintainer must review and approve your PR.
2. Address any feedback or requested changes from the review.
3. Once approved, a maintainer will merge your PR.
4. Be responsive to questions and comments in your PR.

## Coding Standards

### TypeScript Guidelines

- Use TypeScript's strict mode
- Avoid using `any` type when possible
- Use interfaces for object shapes
- Use proper error handling
- Follow the established code structure and patterns
- Document public APIs with JSDoc comments

### Testing Requirements

- Maintain at least 80% code coverage
- Test all user-facing functionality
- Mock external dependencies
- Test edge cases and error conditions
- Write unit and integration tests

### Documentation

- Keep README.md up to date with new features
- Update the CHANGELOG.md with new changes
- Use JSDoc comments for public APIs
- Document complex logic with inline comments

## Release Process

Releases are managed by the core maintainers. The process is automated through GitHub Actions:

1. Changes are merged into the main branch
2. Version is updated in package.json
3. CHANGELOG.md is updated
4. A new tag is created (e.g., v1.2.3)
5. The release workflow automatically:
   - Builds and tests the extension
   - Publishes to VSCode Marketplace
   - Creates a GitHub release

## Getting Help

If you need help with the contribution process or have questions:

- Open an issue on GitHub
- Ask in the pull request
- Contact the maintainers

Thank you for contributing to VSCode Task Buttons!
