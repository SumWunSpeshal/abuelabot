import { Command, CommandMessage, Guard, Infos } from '@typeit/discord';
import { NotBotGuard } from '../guards/not-bot.guard';
import { AbuelaCommand, AbuelaCommandInfos } from '../types';
import { NotHelpGuard } from '../guards/not-help.guard';
import { Aliases } from '../decorators/aliases';
import { ConnectionService } from '../services/connection.service';

const INFOS: AbuelaCommandInfos = {
  commandName: 'leave',
  description: `The "leave" command lets AbuelaBot leave your voice channel.`,
  usage: '`!leave`',
  aliases: ['bye', 'stop', 'pause']
};

export abstract class LeaveCommand implements AbuelaCommand {
  @Command(INFOS.commandName)
  @Infos(INFOS)
  @Guard(NotHelpGuard, NotBotGuard)
  @Aliases(INFOS.aliases)
  async execute(command: CommandMessage) {
    if (!ConnectionService.isBotInVoiceChannel(command)) {
      await command.reply(`Can't leave if I was never there to begin with 🤷`);
    } else {
      ConnectionService.leave(command);
      await command.reply('leaving voice channel...');
    }
  }
}
