import { AbuelaCommand, AbuelaCommandInfos } from '../types';
import { ConnectionService } from '../services/connection.service';

const INFOS: AbuelaCommandInfos = {
  commandName: 'join',
  description: `The "join" command lets AbuelaBot join your voice channel.`,
  usage: '`!join`',
  aliases: ['come', 'here']
};

export class JoinCommand implements AbuelaCommand {
  // @Command(INFOS.commandName)
  // @Infos(INFOS)
  // @Guard(NotHelpGuard, NotBotGuard, NotInVoiceChannelGuard)
  // @Aliases(INFOS.aliases)
  async execute(command: any) {

    await Promise.all([
      command.reply('joining...'),
      ConnectionService.join(command)
    ]);
  }
}
