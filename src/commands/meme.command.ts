import { Description, Discord, Option, Slash } from '@typeit/discord';
import { AbuelaCommandInfos } from '../types';
import { CommandInteraction } from 'discord.js';
import { Http } from '../utils/http';
import { colorText } from '../utils/color-text';
import { CloudinaryService } from '../services/cloudinary.service';
import { findBestMatch } from 'string-similarity';

const INFOS: AbuelaCommandInfos = {
  commandName: 'meme',
  description: `Search a meme template and add your own caption!`
};

const TEMPLATES_URL = 'https://res.cloudinary.com/abuelabot/image/upload/v1643566917/templates/';

@Discord()
export abstract class MemeCommand {
  private static specialCharMap = {
    _: '__',
    ' ': '_',
    '-': '--',
    '?': '~q',
    '&': '~a',
    '%': '~p',
    '#': '~h',
    '/': '~s',
    '\\': '~b',
    '<': '~l',
    '>': '~g',
    '"': "''"
  };

  private static emptyField = '§';

  @Slash(INFOS.commandName)
  @Description(INFOS.description)
  async execute(
    @Option('meme-name', { description: 'Search for a meme!', required: true })
    memeName: string,
    @Option('text-top', { description: 'First text box, vertically aligned at the top' })
    text0: string,
    @Option('text-bottom', { description: 'Second text box, vertically aligned at the bottom' })
    text1: string,
    interaction: CommandInteraction
  ) {
    const list = await CloudinaryService.listTemplates();
    const templateName = list.includes(memeName) ? memeName : findBestMatch(memeName, list).bestMatch.target;
    const url = TEMPLATES_URL + templateName;

    if (!(await Http.isTargetAlive(url))) {
      await interaction.reply(colorText('red', '[Meme was not found!]'), { ephemeral: true });
    }

    await interaction.reply(MemeCommand.getCaptionedMeme(url, text0, text1));
  }

  private static getCaptionedMeme(url: string, topText = ' ', bottomText = ' '): string {
    const formattedTopText = topText === this.emptyField ? '_' : this.encode(topText);
    const formattedBottomText = this.encode(bottomText);
    return `https://api.memegen.link/images/custom/${formattedTopText}/${formattedBottomText}.jpg?background=${url}`;
  }

  private static encode(text: string): string {
    for (const [key, value] of Object.entries(this.specialCharMap)) {
      text = text.split(key).join(value);
    }

    return text;
  }
}
