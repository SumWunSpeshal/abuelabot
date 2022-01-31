import { Description, Discord, Slash } from '@typeit/discord';
import { AbuelaCommandInfos } from '../types';
import { CommandInteraction } from 'discord.js';
import { colorText } from '../utils/color-text';
import { CloudinaryService } from '../services/cloudinary.service';

const INFOS: AbuelaCommandInfos = {
  commandName: 'memelist',
  description: `List available memes!`
};

@Discord()
export abstract class MemeListCommand {
  @Slash(INFOS.commandName)
  @Description(INFOS.description)
  async execute(interaction: CommandInteraction) {
    const list = await CloudinaryService.listTemplates()
    const formattedList = list.map((i: string) => colorText('yellow', i)).join('');
    await interaction.reply(formattedList, { ephemeral: true });
  }
}
