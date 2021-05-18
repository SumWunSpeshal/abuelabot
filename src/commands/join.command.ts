import { Command, CommandMessage, Guard, Infos } from '@typeit/discord';
import { NotBotGuard } from '../guards/not-bot.guard';
import { AbuelaCommand, AbuelaCommandInfos } from '../types';
import { NotHelpGuard } from '../guards/not-help.guard';
import { Aliases } from '../decorators/aliases';
import { NotInVoiceChannelGuard } from '../guards/not-in-voice-channel.guard';
import { ConnectionService } from '../services/connection.service';

const INFOS: AbuelaCommandInfos = {
  commandName: 'join',
  description: `The "join" command lets AbuelaBot join your voice channel.`,
  usage: '`!join`',
  aliases: ['come', 'here']
};

export class JoinCommand implements AbuelaCommand {
  @Command(INFOS.commandName)
  @Infos(INFOS)
  @Guard(NotHelpGuard, NotBotGuard, NotInVoiceChannelGuard)
  @Aliases(INFOS.aliases)
  async execute(command: CommandMessage) {

    await Promise.all([
      command.reply('joining...'),
      ConnectionService.join(command)
    ]);
  }
}
