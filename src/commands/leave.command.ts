import { AbuelaCommand, AbuelaCommandInfos } from '../types';
import { ConnectionService } from '../services/connection.service';
import { Discord, Slash } from '@typeit/discord';
import { CommandInteraction } from 'discord.js';

const INFOS: AbuelaCommandInfos = {
  commandName: 'leave',
  description: `The "leave" command lets AbuelaBot leave your voice channel.`,
  usage: '`!leave`',
  aliases: ['bye', 'stop', 'pause']
};

@Discord()
export abstract class LeaveCommand implements AbuelaCommand {

  @Slash(INFOS.commandName)
  async execute(interaction: CommandInteraction) {
    await interaction.defer()
    if (!ConnectionService.isBotInVoiceChannel(interaction)) {
      await interaction.reply(`Can't leave if I was never there to begin with 🤷`);
    } else {
      ConnectionService.leave(interaction);
      await interaction.reply('leaving voice channel...');
    }
  }
}
