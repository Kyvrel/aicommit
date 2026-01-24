import acp from './commands/acp'

const { Command } = require('commander')
const program = new Command()

program.command('commit', { isDefault: true }).action(() => {
  acp()
})

program.parse()
