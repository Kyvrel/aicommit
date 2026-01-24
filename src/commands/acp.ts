import { GitOperations } from '../utils/git'
import { getConfig, getProviderConfig } from '../utils/config'
import { generateCommitMessage } from '../ai/engine'

// 主要执行流程
export default async () => {
  const git = new GitOperations()
  try {
    // 1. 检查是否有更改
    if (!git.hasChanges()) {
      console.log('✅ 没有更改需要提交')
      return
    }

    // 2. 添加所有更改
    console.log('📝 添加所有更改...')
    git.addAllChanges()

    // 3. 获取diff内容
    const diffContent = git.getStagedDiff()
    if (!diffContent.trim()) {
      console.log('✅ 没有暂存的更改')
      return
    }

    const config = getProviderConfig()

    // 4. 生成提交消息
    console.log('🤖 正在生成提交消息...')
    let commitMessage: string
    try {
      commitMessage = await generateCommitMessage(config, diffContent)
      console.log('📋 提交消息:')
      console.log(commitMessage)
    } catch (error: any) {
      console.error('⚠️ AI生成提交消息失败')
      console.error('错误详情:', error.message)
      console.error('❌ 操作已停止，请重新运行生成提交消息')
      process.exit(1)
    }

    // 5. 提交
    console.log('💾 提交更改...')
    git.commit(commitMessage)

    // 6. 获取提交ID
    const commitId = git.getLatestCommitId()
    console.log(`📋 提交ID: ${commitId}`)

    console.log('🚀 推送到远程仓库...')
    git.push()

    console.log('✅ 完成！')
  } catch (error: any) {
    console.error('❌ 错误:', error)
    process.exit(1)
  }
}
