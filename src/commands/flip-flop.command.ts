import { CommandMessage } from '@typeit/discord';
import { AbuelaCommand, AbuelaCommandInfos } from '../types';

const INFOS: AbuelaCommandInfos = {
  commandName: 'flip :slug :number',
  description: 'TODO',
  usage: 'TODO with `code`',
  aliases: ['flop :slug :number', 'flup :slug :number']
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
  // @Guard(NotHelpGuard, NotBotGuard, FixCommandNameGuard([INFOS.commandName, ...INFOS.aliases]))
  async execute(command: CommandMessage) {
    const { slug, number } = command.args;
    await command.channel.send('Testing Aliases');
  }
}
