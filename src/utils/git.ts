import { execSync } from "child_process"

export class GitOperations {
  // 执行git命令
  execGit(command: string): string {
    try {
      return execSync(`git ${command}`, { encoding: "utf8" })
    } catch (error) {
      throw new Error(`Git命令执行失败: ${command}`)
    }
  }

  // 检查是否有未提交的更改
  hasChanges(): boolean {
    const status = this.execGit("status --porcelain")
    return status.trim().length > 0
  }

  // 获取暂存区的diff
  getStagedDiff(): string {
    return this.execGit("diff --cached")
  }

  // 添加所有更改
  addAllChanges(): void {
    this.execGit("add -A")
  }

  // 提交更改（支持多行message）
  commit(message: string): void {
    // 使用heredoc支持多行commit message
    const escapedMessage = message.replace(/'/g, "'\\''")
    const command = `commit -F- <<'EOF'\n${escapedMessage}\nEOF`
    this.execGit(command)
  }

  // 推送到远程
  push(): void {
    this.execGit("push")
  }

  // 获取最新提交的ID
  getLatestCommitId(): string {
    return this.execGit("rev-parse HEAD").trim()
  }

  // 获取当前分支名
  getCurrentBranch(): string {
    return this.execGit("branch --show-current").trim()
  }

  // 创建并切换到新分支
  createAndCheckoutBranch(branchName: string): void {
    this.execGit(`checkout -b "${branchName}"`)
  }

  // 推送并设置上游分支
  pushWithUpstream(branchName: string): void {
    this.execGit(`push -u origin "${branchName}"`)
  }
}
