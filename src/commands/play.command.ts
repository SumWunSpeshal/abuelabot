import { Command, CommandMessage, Guard, Infos } from '@typeit/discord';
import { NotBotGuard } from '../guards/not-bot.guard';
import { AbuelaCommandInfos } from '../types';
import { NotHelpGuard } from '../guards/not-help.guard';
import { Aliases } from '../decorators/aliases';
import { JoinCommand } from './join.command';
import { NotPermissionsForGuard } from '../guards/not-permissions-for.guard';

const INFOS: AbuelaCommandInfos = {
  commandName: 'play',
  description: `The "play" command lets AbueleBot play a song`,
  usage: '`!play`',
  aliases: ['music', 'p']
};

export abstract class PlayCommand {

  @Command(INFOS.commandName)
  @Infos(INFOS)
  @Guard(NotHelpGuard, NotBotGuard, NotPermissionsForGuard(['CONNECT', 'SPEAK']))
  @Aliases(INFOS.aliases)
  async execute(command: CommandMessage) {
    const joinCommand = new JoinCommand();
    await joinCommand.execute(command);
    await command.channel.send('play');
  }
}
