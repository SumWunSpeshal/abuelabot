import { Command, CommandMessage, Guard, Infos } from '@typeit/discord';
import { AbuelaCommand, AbuelaCommandInfos } from '../types';
import { Aliases } from '../decorators/aliases';
import { NotHelpGuard } from '../guards/not-help.guard';
import { NotBotGuard } from '../guards/not-bot.guard';

const INFOS: AbuelaCommandInfos = {
  commandName: 'flip',
  description: 'TODO',
  usage: 'TODO with `code`',
  aliases: ['flop', 'flup']
};

export abstract class FlipFlopCommand implements AbuelaCommand {
  /**
   * @description
   * TODO Just for demonstration purpose. This command should not be in use.
   *
   * @param command
   */

  // @Command(INFOS.commandName)
  // @Infos(INFOS)
  // @Aliases(INFOS.aliases)
  // @Guard(NotHelpGuard, NotBotGuard)
  async execute(command: CommandMessage) {
    await command.channel.send('Flop');
  }
}
