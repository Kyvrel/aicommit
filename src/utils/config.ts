import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import os from 'node:os'

export type AppType = {
  activeProviderName: string
  providers: ProviderType[]
}

export type ProviderType = {
  name: string
  baseUrl: string
  apiKey: string
  model: string
}

const fileExists = (filePath: string) => {
  return existsSync(filePath)
}

export const getConfigPath = () => path.join(os.homedir(), '.aicommit')

const getConfigTemplate = () => `{
  "activeProviderName": "openai",
  "providers": [
    {
      "name": "openai",
      "baseUrl": "https://api.openai.com/v1",
      "apiKey": "sk-your-api-key",
      "model": "gpt-4o-mini"
    }
  ]
}`

const validateConfig = (config: AppType): AppType => {
  if (!config.activeProviderName) {
    throw new Error(`missing "activeProviderName" in ${getConfigPath()}`)
  }
  if (!Array.isArray(config.providers) || config.providers.length === 0) {
    throw new Error(`missing "providers" in ${getConfigPath()}`)
  }
  return config
}

export const getProviderConfig = () => {
  const config = getConfig()
  const provider = config.providers.find(
    provider => provider.name === config.activeProviderName
  )
  if (!provider) {
    throw new Error(
      `active provider "${config.activeProviderName}" was not found in ${getConfigPath()}`
    )
  }
  return provider
}

export const getConfig = (): AppType => {
  const configPath = getConfigPath()
  if (!fileExists(configPath)) {
    throw new Error(
      `missing AI config at ${configPath}\n\nCreate the file with content like:\n${getConfigTemplate()}`
    )
  }
  const data = readFileSync(configPath, 'utf-8')

  let config: AppType
  try {
    config = JSON.parse(data)
  } catch {
    throw new Error(`invalid JSON in ${configPath}`)
  }
  return validateConfig(config)
}
