import { AbuelaCommandInfos } from '../types';
import { Description, Discord, Slash } from '@typeit/discord';
import { CommandInteraction } from 'discord.js';

const INFOS: AbuelaCommandInfos = {
  commandName: 'angry',
  description: 'TODO'
};

@Discord()
export abstract class AngryCommand {
  
  @Slash(INFOS.commandName)
  @Description(INFOS.description)
  async execute(interaction: CommandInteraction) {
    await interaction.reply('https://tenor.com/view/grumpy-mad-angry-cat-gif-14232626');
  }
}
