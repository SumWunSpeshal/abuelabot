import { AbuelaCommandInfos } from '../types';
import { ConnectionService } from '../services/connection.service';
import { Description, Discord, Guard, Slash } from '@typeit/discord';
import { CommandInteraction } from 'discord.js';
import { NotInVoiceChannelSlashGuard } from '../guards/not-in-voice-channel-slash.guard';

const INFOS: AbuelaCommandInfos = {
  commandName: 'join',
  description: `Make me join the voice channel you are in!`
};

@Discord()
export class JoinCommand {
  @Slash(INFOS.commandName)
  @Description(INFOS.description)
  @Guard(NotInVoiceChannelSlashGuard)
  async execute(interaction: CommandInteraction) {
    await interaction.defer();
    await ConnectionService.join(interaction);
    await interaction.editReply('`voice channel joined!`');
  }
}
