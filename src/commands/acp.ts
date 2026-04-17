import { createInterface } from 'readline/promises'
import { stdin as input, stdout as output } from 'process'
import { GitOperations } from '../utils/git'
import { getProviderConfig } from '../utils/config'
import { generateCommitMessage } from '../ai/engine'

const promptConflictAction = async (): Promise<'abort' | 'keep'> => {
  const rl = createInterface({ input, output })

  try {
    while (true) {
      const answer = (await rl.question('Abort rebase? (y/n): ')).trim().toLowerCase()

      if (answer === 'y' || answer === 'yes') {
        return 'abort'
      }

      if (answer === 'n' || answer === 'no') {
        return 'keep'
      }

      console.log('Please enter y or n.')
    }
  } finally {
    rl.close()
  }
}

// Main flow
export default async () => {
  const git = new GitOperations()
  try {
    const config = getProviderConfig()

    // 1. Check if there are changes
    if (!git.hasChanges()) {
      console.log('✅ No changes to commit')
      return
    }

    // 2. Stage all changes
    console.log('📝 Staging all changes...')
    git.addAllChanges()

    // 3. Get staged diff
    const diffContent = git.getStagedDiff()
    if (!diffContent.trim()) {
      console.log('✅ No staged changes')
      return
    }

    // 4. Generate commit message
    console.log(`🤖 Generating commit message using ${config.model}...`)
    let commitMessage: string
    try {
      commitMessage = await generateCommitMessage(config, diffContent)
      console.log('📋 Commit message:')
      console.log(commitMessage)
    } catch (error: any) {
      console.error('⚠️ Failed to generate commit message')
      console.error('Error details:', error.message)
      console.error('❌ Operation stopped. Please rerun to generate a commit message.')
      process.exit(1)
    }

    // 5. Commit
    console.log('💾 Committing changes...')
    git.commit(commitMessage)

    // 6. Sync remote changes before push
    if (!git.hasUpstream()) {
      console.log('ℹ️ No upstream branch. Skipping sync.')
    } else {
      console.log('🔄 Checking remote changes...')
      git.fetch()

      const { behind } = git.getAheadBehind()

      if (behind === 0) {
        console.log('✅ Remote is up to date')
      } else {
        console.log('⬇️ Remote has new commits. Rebasing before push...')

        try {
          git.pullRebase()
          console.log('✅ Rebase applied successfully')
        } catch (syncError: any) {
          const conflictFiles = git.getConflictFiles()

          if (conflictFiles.length > 0) {
            console.error('⚠️ Rebase stopped because of conflicts')
            console.error('Conflicted files:')
            for (const file of conflictFiles) {
              console.error(`- ${file}`)
            }

            const action = await promptConflictAction()
            if (action === 'abort') {
              git.abortRebase()
              console.error('🛑 Rebase aborted. Resolve and rerun.')
            } else {
              console.error('🛑 Rebase state kept. Resolve conflicts manually.')
            }

            process.exit(1)
          }

          console.error('⚠️ Failed to sync remote changes before push')
          console.error('Error details:', syncError.message)
          process.exit(1)
        }
      }
    }

    // 7. Get final commit id
    const commitId = git.getLatestCommitId()
    console.log(`📋 Commit ID: ${commitId}`)

    console.log('🚀 Pushing to remote...')
    git.push()

    console.log('✅ Done!')
  } catch (error: any) {
    console.error('❌ Error:', error)
    process.exit(1)
  }
}
