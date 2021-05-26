import { AbuelaCommandInfos } from '../types';
import { ConnectionService } from '../services/connection.service';
import { Description, Discord, Slash } from '@typeit/discord';
import { CommandInteraction } from 'discord.js';

const INFOS: AbuelaCommandInfos = {
  commandName: 'join',
  description: `Let Abuela join your voice channel!`,
};

@Discord()
export class JoinCommand {
  @Slash(INFOS.commandName)
  @Description(INFOS.description)
  async execute(interaction: CommandInteraction) {
    await interaction.defer();
    await ConnectionService.join(interaction);
    await interaction.editReply('`voice channel joined!`');
  }
}
