import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import os from 'node:os'

export type AppType = {
  activeProviderName: string
  providers: providerType[]
}

export type providerType = {
  name: string
  baseUrl: string
  apiKey: string
  model: string
}

const fileExists = (filePath: string) => {
  return existsSync(filePath)
}

const getConfigPath = () => path.join(os.homedir(), '.aicommit')

const validateConfig = (config: AppType): AppType => {
  if (!config.activeProviderName) {
    throw new Error(`no activeProviderName`)
  }
  if (config.providers.length === 0) {
    throw new Error(`no providers`)
  }
  return config
}

export const getProviderConfig = () => {
  const config = getConfig()
  const provider = config.providers.find(
    provider => provider.name === config.activeProviderName
  )
  if (!provider) {
    throw new Error(`no valid provider: ${config}`)
  }
  return provider
}

export const getConfig = (): AppType => {
  const configPath = getConfigPath()
  if (!fileExists(configPath)) {
    throw new Error(`need ai config`)
  }
  const data = readFileSync(configPath, 'utf-8')

  const config = JSON.parse(data)
  return validateConfig(config)
}
