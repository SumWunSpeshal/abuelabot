import { AbuelaCommand, AbuelaCommandInfos } from '../types';
import { ConnectionService } from '../services/connection.service';
import { Description, Discord, Guard, Slash } from '@typeit/discord';
import { CommandInteraction } from 'discord.js';
import { BotNotInVoiceChannelSlashGuard } from '../guards/bot-not-in-voice-channel-slash.guard';

const INFOS: AbuelaCommandInfos = {
  commandName: 'leave',
  description: `Make me leave your voice channel and stop any playing music`,
  alias: 'stop'
};

@Discord()
export abstract class LeaveCommand implements AbuelaCommand {
  @Slash(INFOS.commandName)
  @Description(INFOS.description)
  @Guard(BotNotInVoiceChannelSlashGuard)
  async execute(interaction: CommandInteraction) {
    await this.leave(interaction);
  }

  @Slash(INFOS.alias!)
  @Description(INFOS.description)
  @Guard(BotNotInVoiceChannelSlashGuard)
  async stop(interaction: CommandInteraction) {
    await this.leave(interaction);
  }

  private async leave(interaction: CommandInteraction) {
    ConnectionService.leave(interaction);
    await interaction.reply('`leaving voice channel...`');
  }
}
