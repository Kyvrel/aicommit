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

| Name | Required | Default | Description |
|--------|------|--------|------|
| `GEMINI_API_KEY` | ✅ | - | Google Gemini API key |
| `HTTPS_PROXY` / `https_proxy` | ❌ | `http://127.0.0.1:7893` | HTTPS proxy URL (overrides default if set) |
| `HTTP_PROXY` / `http_proxy` | ❌ | `http://127.0.0.1:7893` | HTTP proxy URL (overrides default if set) |

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

### Proxy issues
```bash
# Check proxy settings
echo $HTTPS_PROXY
echo $https_proxy
echo $HTTP_PROXY
echo $http_proxy
```

- By default, the tool will try to access Gemini via `http://127.0.0.1:7893`.
- If you do not have a local proxy on that port, set `HTTPS_PROXY` or `HTTP_PROXY` to your proxy URL, or disable proxy and run again (direct access is not recommended).

## 🌐 Proxy options and when to use them

- **Undici ProxyAgent (used in this project)**: Fully matches Node 18+ built-in `fetch`. Use `fetch(url, { dispatcher: new ProxyAgent(proxyUrl) })`.
  - Use when you make requests with global `fetch` / Undici.
  - Pros: no extra adapter, stable performance, maintained by the Node team.
  - Protocols: HTTP/HTTPS. For SOCKS, use a third-party adapter.

- **proxy-agent (alternative)**: For libraries that use `http.Agent`, like `http.request/https.request`, `axios`, `got`.
  - Use when you need an `agent` option.
  - Pros: auto-detect many proxy types (PAC, SOCKS).
  - Note: Node built-in `fetch` does not support the `agent` option.

- **Recommended**: Use Undici `ProxyAgent` and configure it via `HTTPS_PROXY` / `HTTP_PROXY`. If you really need SOCKS/PAC, then switch to another solution or add an adapter.

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

**Note**: Make sure you set the `GEMINI_API_KEY` env var before use.
