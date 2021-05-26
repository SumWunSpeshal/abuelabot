import { AbuelaCommand, AbuelaCommandInfos } from '../types';
import { ConnectionService } from '../services/connection.service';
import { Description, Discord, Slash } from '@typeit/discord';
import { CommandInteraction } from 'discord.js';

const INFOS: AbuelaCommandInfos = {
  commandName: 'leave',
  description: `Make Abuela leave your voice channel and stop any playing music`,
};

@Discord()
export abstract class LeaveCommand implements AbuelaCommand {

  @Slash(INFOS.commandName)
  @Description(INFOS.description)
  async execute(interaction: CommandInteraction) {
    await interaction.defer();

    if (!ConnectionService.isBotInVoiceChannel(interaction)) {
      await interaction.editReply(`\`Can't leave if I was never there to begin with 🤷\``);
    } else {
      ConnectionService.leave(interaction);
      await interaction.editReply('`leaving voice channel...`');
    }
  }
}
