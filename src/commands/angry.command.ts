import { Command, CommandMessage, Guard, Infos } from '@typeit/discord';
import { NotBotGuard } from '../guards/not-bot.guard';
import { AbuelaCommand } from '../types';
import { NotHelpGuard } from '../guards/not-help.guard';

export abstract class AngryCommand implements AbuelaCommand {
  @Command('angry')
  @Infos({ description: 'TODO', usage: 'TODO with `code`' })
  @Guard(NotHelpGuard, NotBotGuard)
  async execute(command: CommandMessage) {
    await command.channel.send('https://tenor.com/view/grumpy-mad-angry-cat-gif-14232626');
  }
}
