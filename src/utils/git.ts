import { execSync } from "child_process"

export class GitOperations {
  // Run a git command
  execGit(command: string): string {
    try {
      return execSync(`git ${command}`, { encoding: "utf8" })
    } catch (error) {
      throw new Error(`Git command failed: ${command}`)
    }
  }

  // Check if there are uncommitted changes
  hasChanges(): boolean {
    const status = this.execGit("status --porcelain")
    return status.trim().length > 0
  }

  // Get staged diff
  getStagedDiff(): string {
    return this.execGit("diff --cached")
  }

  // Stage all changes
  addAllChanges(): void {
    this.execGit("add -A")
  }

  // Commit changes (supports multi-line messages)
  commit(message: string): void {
    // Use heredoc for multi-line commit messages
    const escapedMessage = message.replace(/'/g, "'\\''")
    const command = `commit -F- <<'EOF'\n${escapedMessage}\nEOF`
    this.execGit(command)
  }

  // Push to remote
  push(): void {
    this.execGit("push")
  }

  // Get the latest commit id
  getLatestCommitId(): string {
    return this.execGit("rev-parse HEAD").trim()
  }

  // Get current branch name
  getCurrentBranch(): string {
    return this.execGit("branch --show-current").trim()
  }

  // Create and checkout a new branch
  createAndCheckoutBranch(branchName: string): void {
    this.execGit(`checkout -b "${branchName}"`)
  }

  // Push and set upstream
  pushWithUpstream(branchName: string): void {
    this.execGit(`push -u origin "${branchName}"`)
  }
}
