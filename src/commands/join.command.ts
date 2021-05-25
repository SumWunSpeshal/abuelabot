import { AbuelaCommandInfos } from '../types';
import { ConnectionService } from '../services/connection.service';
import { Discord, Slash } from '@typeit/discord';
import { CommandInteraction } from 'discord.js';

const INFOS: AbuelaCommandInfos = {
  commandName: 'join',
  description: `The "join" command lets AbuelaBot join your voice channel.`,
  usage: '`!join`',
  aliases: ['come', 'here']
};

@Discord()
export class JoinCommand {
  @Slash(INFOS.commandName)
  async execute(interaction: CommandInteraction) {
    await interaction.defer();
    await ConnectionService.join(interaction);
    await interaction.editReply('`voice channel joined!`');
  }
}
