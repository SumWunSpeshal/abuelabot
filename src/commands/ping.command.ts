import { Command, CommandMessage, Guard, Infos } from '@typeit/discord';
import { NotBotGuard } from '../guards/not-bot.guard';
import { AbuelaCommand } from '../types';
import { NotHelpGuard } from '../guards/not-help.guard';
import { code } from '../utils/tagged-templates';

export abstract class PingCommand implements AbuelaCommand {
  @Command('ping')
  @Infos({ description: 'TODO', usage: `TODO with ${code`code`}` })
  @Guard(NotHelpGuard, NotBotGuard)
  async execute(command: CommandMessage) {
    await command.channel.send('pong');
  }
}
