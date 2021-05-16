import { Command, CommandMessage, Guard, Infos } from '@typeit/discord';
import { NotBotGuard } from '../guards/not-bot.guard';
import { AbuelaCommandInfos } from '../types';
import { NotHelpGuard } from '../guards/not-help.guard';
import { Aliases } from '../decorators/aliases';

const INFOS: AbuelaCommandInfos = {
  commandName: 'play',
  description: `The "play" command lets AbueleBot play a song`,
  usage: '`!play`',
  aliases: ['music','p']
};

export abstract class PlayCommand {

  @Command(INFOS.commandName)
  @Infos(INFOS)
  @Guard(NotHelpGuard, NotBotGuard)
  @Aliases(INFOS.aliases)
  async execute(command: CommandMessage) {
    await command.channel.send('play');
  }
}
