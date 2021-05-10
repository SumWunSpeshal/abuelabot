import { Command, CommandMessage, Guard, Infos } from '@typeit/discord';
import { NotBotGuard } from '../guards/not-bot.guard';
import { AbuelaCommand } from '../types';
import { Aliases } from '../decorators/aliases';
import { FixCommandNameGuard } from '../guards/fix-command-name.guard';
import { NotHelpGuard } from '../guards/not-help.guard';

export abstract class FlipFlopCommand implements AbuelaCommand {
  @Command('flip :slug :number')
  @Infos({ description: 'TODO', usage: 'TODO with `code`' })
  @Aliases('flop :slug :number', 'flup :slug :number')
  @Guard(NotHelpGuard, NotBotGuard, FixCommandNameGuard('flip', 'flop', 'flup'))
  async execute(command: CommandMessage) {
    const { slug, number } = command.args;
    await command.channel.send('Testing Aliases');
  }
}
