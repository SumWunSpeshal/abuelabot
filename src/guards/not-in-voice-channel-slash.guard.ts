import { GuardFunction } from '@typeit/discord';
import { CommandInteraction } from 'discord.js';
import { CommandHelper } from '../utils/command-helper';

export const NotInVoiceChannelSlashGuard: GuardFunction<CommandInteraction> = async (interaction, client, next) => {
  const member = CommandHelper.getMemberById(interaction.guild!, interaction.user.id);
  const voiceChannel = member?.voice.channel;

  if (voiceChannel) {
    await next();
  } else {
    await interaction.reply(
      '`I need you to be in a voice channel for me to join. Enter a voice channel and I will follow you.`',
      { ephemeral: true }
    );
  }
};
