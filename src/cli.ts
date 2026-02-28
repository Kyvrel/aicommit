#!/usr/bin/env node
import acp from './commands/acp'
import { Command } from 'commander'

const program = new Command()

program.name('aicommit').description('AI commit message CLI')

program.command('commit', { isDefault: true }).action(() => {
  acp()
})

program.parse()
