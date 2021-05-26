import { GuardFunction } from '@typeit/discord';
import { CommandInteraction } from 'discord.js';
import { CommandHelper } from '../utils/command-helper';
import { BOT_ID } from '../statics';

export const BotNotInVoiceChannelSlashGuard: GuardFunction<CommandInteraction> = async (interaction, client, next) => {
  const guild = CommandHelper.getGuildById(interaction.guildID!);
  const bot = CommandHelper.getMemberById(guild!, BOT_ID);

  if (bot?.voice.channel) {
    await next();
  } else {
    await interaction.reply(`\`Can't leave if I was never there to begin with 🤷\``, { ephemeral: true });
  }
};
