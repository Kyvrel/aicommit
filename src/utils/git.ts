import { execSync } from "child_process"

export class GitOperations {
  // Run a git command
  execGit(command: string): string {
    try {
      return execSync(`git ${command}`, { encoding: "utf8", stdio: ["pipe", "pipe", "pipe"] })
    } catch (error: any) {
      const output = [error.stderr, error.stdout]
        .filter((value) => typeof value === "string" && value.trim().length > 0)
        .join("\n")
        .trim()

      const suffix = output ? `\n${output}` : ""
      throw new Error(`Git command failed: ${command}${suffix}`)
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
    // Pass message via stdin to avoid shell injection
    execSync('git commit -F -', { input: message, encoding: 'utf8' })
  }

  // Push to remote
  push(): void {
    this.execGit("push")
  }

  // Check if current branch has an upstream branch
  hasUpstream(): boolean {
    try {
      this.execGit("rev-parse --abbrev-ref --symbolic-full-name @{u}")
      return true
    } catch {
      return false
    }
  }

  // Fetch remote changes
  fetch(): void {
    this.execGit("fetch")
  }

  // Compare local branch with upstream branch
  getAheadBehind(): { ahead: number; behind: number } {
    const result = this.execGit("rev-list --left-right --count HEAD...@{u}").trim()
    const [aheadText, behindText] = result.split(/\s+/)

    return {
      ahead: Number(aheadText),
      behind: Number(behindText),
    }
  }

  // Pull remote changes with rebase
  pullRebase(): void {
    this.execGit("pull --rebase")
  }

  // Get files with merge conflicts
  getConflictFiles(): string[] {
    const output = this.execGit("diff --name-only --diff-filter=U").trim()
    if (!output) {
      return []
    }

    return output.split("\n").map((file) => file.trim()).filter(Boolean)
  }

  // Abort ongoing rebase
  abortRebase(): void {
    this.execGit("rebase --abort")
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
