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

### 查看帮助

```bash
git-acp --help
```

## 🔑 环境变量

| 变量名 | 必需 | 默认值 | 描述 |
|--------|------|--------|------|
| `GEMINI_API_KEY` | ✅ | - | Google Gemini API 密钥 |
| `HTTPS_PROXY` / `https_proxy` | ❌ | `http://127.0.0.1:7893` | HTTPS 代理地址（设定则覆盖默认） |
| `HTTP_PROXY` / `http_proxy` | ❌ | `http://127.0.0.1:7893` | HTTP 代理地址（设定则覆盖默认） |

## 🏗️ 架构设计

项目采用模块化设计，遵循单一职责原则：

### 核心类

- **ConfigManager** - 配置管理职责
  - 加载和验证环境变量
  - 提供配置对象

- **GitOperations** - Git操作职责
  - 执行Git命令
  - 检查变更状态  
  - 添加、提交、推送操作

- **AICommitGenerator** - AI生成职责
  - 调用 Gemini API
  - 生成提交消息
  - 处理API错误

- **CLIApp** - 应用流程控制职责
  - 组织整个工作流程
  - 用户交互和错误处理
  - 显示帮助信息

## 📋 工作流程

1. **检查变更** - 检查是否有待提交的文件
2. **添加文件** - 自动执行 `git add -A`
3. **获取差异** - 获取暂存区的 diff 内容
4. **AI生成** - 调用 Gemini API 生成提交消息
5. **提交代码** - 使用生成的消息提交
6. **推送远程** - 自动推送到远程仓库

## 🛠️ 开发命令

```bash
# 安装依赖
pnpm install

# 开发模式运行
pnpm dev

# 构建项目
pnpm build

# 全局安装
pnpm install-global
```

## 🐛 故障排除

### API密钥问题
```bash
# 检查环境变量是否设置
echo $GEMINI_API_KEY
```

### 代理问题  
```bash
# 检查代理设置
echo $HTTPS_PROXY
echo $https_proxy
echo $HTTP_PROXY
echo $http_proxy
```

- 默认情况下，工具会尝试通过 `http://127.0.0.1:7893` 代理访问 Gemini。
- 如果你的本地没有该端口的代理，请设置 `HTTPS_PROXY` 或 `HTTP_PROXY` 为你的代理地址，或停用代理后再运行（不建议直连）。

## 🌐 代理方案对比与适用场景

- **Undici ProxyAgent（本项目采用）**: 与 Node 18+ 原生 `fetch` 完全匹配，使用 `fetch(url, { dispatcher: new ProxyAgent(proxyUrl) })` 传入代理。
  - 适用：使用全局 `fetch`/Undici 发起请求的场景。
  - 优点：零适配、性能稳定、由 Node 团队维护。
  - 协议：HTTP/HTTPS 代理。若需 SOCKS，可配合第三方代理适配器。

- **proxy-agent（替代方案）**: 面向 `http.request/https.request`、`axios/got` 等使用 `http.Agent` 的库。
  - 适用：你使用的是 `axios/got` 或底层 `http/https` API，需要 `agent` 选项的场景。
  - 优点：自动解析多种代理方案（含 PAC、SOCKS）。
  - 注意：Node 原生 `fetch` 不支持 `agent` 选项，直接传 `agent` 无效。

- **本项目推荐**: 使用 Undici 的 `ProxyAgent` 并通过环境变量 `HTTPS_PROXY`/`HTTP_PROXY` 显式配置。当确实需要 SOCKS/PAC 时，再考虑换用对应方案或引入适配器。

### 权限问题
```bash
# 重新链接全局命令
pnpm unlink --global
pnpm link --global
```

## 📝 许可证

ISC License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

**注意**: 请确保在使用前正确设置 `GEMINI_API_KEY` 环境变量。
