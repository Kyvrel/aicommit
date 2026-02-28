import { ProviderType } from '../utils/config'
import { generateText } from 'ai'
import { createGoogleGenerativeAI, google } from '@ai-sdk/google'
import { createOpenAICompatible } from '@ai-sdk/openai-compatible'
import { createOpenAI } from '@ai-sdk/openai'

const getProvider = (config: ProviderType) => {
  switch (config.name) {
    case 'openai':
      return createOpenAI({
        apiKey: config.apiKey,
        ...(config.baseUrl && { baseURL: config.baseUrl }),
      })
    case 'gemini':
      return createGoogleGenerativeAI({
        apiKey: config.apiKey,
        ...(config.baseUrl && { baseURL: config.baseUrl }),
      })
    default:
      // Fall back to OpenAI-compatible for any other provider (e.g. glm, minimax, deepseek, ollama, qwen, etc.)
      return createOpenAICompatible({
        name: config.name,
        apiKey: config.apiKey,
        baseURL: config.baseUrl,
      })
  }
}

const systemPrompt = `You are a tool that generates git commit messages. Given a git diff, generate a concise and descriptive commit message that summarizes the changes. The commit message must be 100 characters or less. Respond with ONLY the commit message.`

export const generateCommitMessage = async (
  config: ProviderType,
  diff: string
) => {
  const provider = getProvider(config)
  const result = await generateText({
    model: provider(config.model),
    system: systemPrompt,
    prompt: diff,
    temperature: 0,
    maxRetries: 3,
    maxOutputTokens: 500,
  })

  return result.text
}
