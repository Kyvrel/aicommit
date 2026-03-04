import { GitOperations } from '../utils/git'
import { getConfig, getProviderConfig } from '../utils/config'
import { generateCommitMessage } from '../ai/engine'

// Main flow
export default async () => {
  const git = new GitOperations()
  try {
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

    const config = getProviderConfig()

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

    // 6. Get commit id
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
