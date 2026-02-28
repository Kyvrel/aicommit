# aicommit

`aicommit` is a simple CLI tool. It generates a git commit message with AI.

## Features

- Generate a commit message from `git diff`
- Support multiple providers (OpenAI, Gemini, OpenAI-compatible)
- Simple JSON config file

## Install

```bash
pnpm install
pnpm build
```

You can run it without global install:

```bash
node dist/cli.js
```

Or install it globally:

```bash
pnpm install -g .
```

## Usage

Run in any git repo:

```bash
aicommit
```

It will:
1) `git add -A`
2) read `git diff --cached`
3) call your AI provider
4) `git commit`
5) `git push`

## Config

Create a file at `~/.aicommit`:

```json
{
  "activeProviderName": "openai",
  "providers": [
    {
      "name": "openai",
      "baseUrl": "https://api.openai.com/v1",
      "apiKey": "sk-your-api-key",
      "model": "gpt-4o-mini"
    }
  ]
}
```

Gemini example:

```json
{
  "activeProviderName": "gemini",
  "providers": [
    {
      "name": "gemini",
      "baseUrl": "https://generativelanguage.googleapis.com/v1beta",
      "apiKey": "your-gemini-api-key",
      "model": "gemini-2.5-flash"
    }
  ]
}
```

## Project structure

```
src/
  cli.ts
  commands/
    acp.ts
  utils/
    config.ts
    git.ts
  ai/
    engine.ts
```

### Help

```bash
aicommit --help
```

## 🔑 Environment variables

There are no required environment variables. All configuration is done via the `~/.aicommit` config file.

## 🏗️ Architecture

This project uses a modular design and follows the single-responsibility principle:

### Core classes

- **ConfigManager** - Configuration management
  - Load and validate environment variables
  - Provide the config object

- **GitOperations** - Git operations
  - Run git commands
  - Check change status
  - Add, commit, and push

- **AICommitGenerator** - AI generation
  - Call the Gemini API
  - Generate commit messages
  - Handle API errors

- **CLIApp** - App flow control
  - Orchestrate the full workflow
  - User interaction and error handling
  - Show help

## 📋 Workflow

1. **Check changes** - Check if there are files to commit
2. **Stage files** - Run `git add -A` automatically
3. **Get diff** - Read the staged diff (`git diff --cached`)
4. **AI generate** - Call the Gemini API to generate a commit message
5. **Commit** - Commit with the generated message
6. **Push** - Push to the remote repository

## 🛠️ Development

```bash
# Install dependencies
pnpm install

# Run in dev mode
pnpm dev

# Build
pnpm build

# Install globally
pnpm install-global
```

## 🐛 Troubleshooting

### API key issues
```bash
# Check if the env var is set
echo $GEMINI_API_KEY
```

### Permission issues
```bash
# Re-link the global command
pnpm unlink --global
pnpm link --global
```

## 📝 License

ISC License

## 🤝 Contributing

Issues and pull requests are welcome!

---
