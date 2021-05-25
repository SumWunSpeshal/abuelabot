import { AbuelaCommand, AbuelaCommandInfos } from '../types';
import { ConnectionService } from '../services/connection.service';

const INFOS: AbuelaCommandInfos = {
  commandName: 'leave',
  description: `The "leave" command lets AbuelaBot leave your voice channel.`,
  usage: '`!leave`',
  aliases: ['bye', 'stop', 'pause']
};

export abstract class LeaveCommand implements AbuelaCommand {
  // @Command(INFOS.commandName)
  // @Infos(INFOS)
  // @Guard(NotHelpGuard, NotBotGuard)
  // @Aliases(INFOS.aliases)
  async execute(command: any) {
    if (!ConnectionService.isBotInVoiceChannel(command)) {
      await command.reply(`Can't leave if I was never there to begin with 🤷`);
    } else {
      ConnectionService.leave(command);
      await command.reply('leaving voice channel...');
    }
  }
}
