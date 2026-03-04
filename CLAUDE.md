# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- **Install Dependencies**: `pnpm install`
- **Build**: `pnpm build`
- **Development Mode**: `pnpm dev` (runs TypeScript compiler in watch mode)
- **Install Globally**: `pnpm install-global` (builds and links globally)
- **Run without global install**: `node dist/cli.js`

## Architecture & Structure

This is a modular Node.js CLI tool written in TypeScript that generates git commit messages using AI and automates the commit/push workflow.

### Core Modules

- **`src/cli.ts`**: Entry point for the CLI tool.
- **`src/commands/acp.ts`**: Orchestrates the main workflow (Add, Commit, Push). Handles flow control, error handling, and user feedback.
- **`src/utils/config.ts`**: Manages configuration. Reads and validates the `~/.aicommit` JSON configuration file to determine the active AI provider.
- **`src/utils/git.ts`**: Contains `GitOperations` for interacting with git via `execSync` (checking status, staging, committing, pushing, getting diffs).
- **`src/ai/engine.ts`**: Handles AI integration. Contains a factory function to create instances of the active AI provider (OpenAI, Gemini, OpenAI-compatible) and calls the provider API to generate commit messages based on `git diff --cached`.

### Workflow

The `acp.ts` command implements the following automated sequence:
1. Checks for changes in the repository.
2. Stages all changes (`git add -A`).
3. Retrieves the staged diff (`git diff --cached`).
4. Sends the diff to the configured AI provider to generate a commit message.
5. Commits the changes using the generated message.
6. Pushes the commit to the remote repository.