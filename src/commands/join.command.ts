import { Client, Command, CommandMessage, Guard, Infos } from '@typeit/discord';
import { NotBotGuard } from '../guards/not-bot.guard';
import { AbuelaCommandInfos } from '../types';
import { NotHelpGuard } from '../guards/not-help.guard';
import { Aliases } from '../decorators/aliases';
import { NotInVoiceChannelGuard } from '../guards/not-in-voice-channel.guard';

const INFOS: AbuelaCommandInfos = {
  commandName: 'join',
  description: `The "join" command lets AbuelaBot join your voice channel.`,
  usage: '`!join`',
  aliases: ['come', 'here']
};

export abstract class JoinCommand {
  @Command(INFOS.commandName)
  @Infos(INFOS)
  @Guard(NotHelpGuard, NotBotGuard, NotInVoiceChannelGuard)
  @Aliases(INFOS.aliases)
  async execute(command: CommandMessage, client: Client) {
    command.channel.send('joining...')
    await command?.member?.voice?.channel?.join();
  }
}