import { Command, CommandMessage, Guard, Infos } from '@typeit/discord';
import { NotBotGuard } from '../guards/not-bot.guard';
import { AbuelaCommand, AbuelaCommandInfos } from '../types';
import { Aliases } from '../decorators/aliases';
import { FixCommandNameGuard } from '../guards/fix-command-name.guard';
import { NotHelpGuard } from '../guards/not-help.guard';

export abstract class FlipFlopCommand implements AbuelaCommand {
  private static readonly infos: AbuelaCommandInfos = {
    description: 'TODO',
    usage: 'TODO with `code`',
    aliases: ['flop :slug :number', 'flup :slug :number']
  };

  @Command('flip :slug :number')
  @Infos(FlipFlopCommand.infos)
  @Aliases(FlipFlopCommand.infos.aliases!)
  @Guard(NotHelpGuard, NotBotGuard, FixCommandNameGuard('flip', 'flop', 'flup'))
  async execute(command: CommandMessage) {
    const { slug, number } = command.args;
    await command.channel.send('Testing Aliases');
  }
}
