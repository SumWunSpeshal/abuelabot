import { Command, CommandMessage, Guard, Infos } from '@typeit/discord';
import { NotBotGuard } from '../guards/not-bot.guard';
import { AbuelaCommand, AbuelaCommandInfos } from '../types';
import { Aliases } from '../decorators/aliases';
import { FixCommandNameGuard } from '../guards/fix-command-name.guard';
import { NotHelpGuard } from '../guards/not-help.guard';

const INFOS: AbuelaCommandInfos = {
  commandName: 'flip :slug :number',
  description: 'TODO',
  usage: 'TODO with `code`',
  aliases: ['flop :slug :number', 'flup :slug :number']
};

export abstract class FlipFlopCommand implements AbuelaCommand {

  @Command(INFOS.commandName)
  @Infos(INFOS)
  @Aliases(INFOS.aliases)
  @Guard(NotHelpGuard, NotBotGuard, FixCommandNameGuard([INFOS.commandName, ...INFOS.aliases]))
  async execute(command: CommandMessage) {
    const { slug, number } = command.args;
    await command.channel.send('Testing Aliases');
  }
}
