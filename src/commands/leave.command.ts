import { Client, Command, CommandMessage, Guard, Infos } from '@typeit/discord';
import { NotBotGuard } from '../guards/not-bot.guard';
import { AbuelaCommandInfos } from '../types';
import { NotHelpGuard } from '../guards/not-help.guard';
import { Aliases } from '../decorators/aliases';
import { NotInVoiceChannelGuard } from '../guards/not-in-voice-channel.guard';

const INFOS: AbuelaCommandInfos = {
  commandName: 'leave',
  description: `The "join" command lets AbuelaBot leave your voice channel.`,
  usage: '`!leave`',
  aliases: ['bye']
};

export abstract class LeaveCommand {
  @Command(INFOS.commandName)
  @Infos(INFOS)
  @Guard(NotHelpGuard, NotBotGuard)
  @Aliases(INFOS.aliases)
  async execute(command: CommandMessage, client: Client) {
    command.channel.send('leaving...');
    command?.member?.voice?.channel?.leave();
  }
}
