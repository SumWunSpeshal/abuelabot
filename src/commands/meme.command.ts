import { Client, Discord, Option, Slash } from '@typeit/discord';
import { AbuelaCommand, AbuelaCommandInfos } from '../types';
import config from '../config';
import { Http } from '../utils/http';
import { ImgFlipService } from '../services/img-flip.service';
import { IImgFlipCaptionRequestBody, IImgFlipGetResponse, IImgFlipSuccessResponse } from '../api/img-flip.interface';
import { Rating } from 'string-similarity';
import { colorText } from '../utils/color-text';
import { CommandInteraction, MessageEmbed } from 'discord.js';

const INFOS: AbuelaCommandInfos = {
  commandName: 'meme',
  description: `Search a meme from imgflip and add your own caption to it! Add up to two captions to your meme. The captions will be conveniently placed, trying to fit the meme. We check for search term similarities so your query doesn't need to be exact.`,
  usage: '`!meme {searchTerm?} / {caption1?} / {caption2?}` or just `!meme` for a random, non-captioned meme',
  aliases: ['imgflip', 'img', 'caption', 'cap']
};

@Discord()
export abstract class MemeCommand {
  private readonly getUrl = 'https://api.imgflip.com/get_memes';

  private readonly captionUrl = 'https://api.imgflip.com/caption_image';

  @Slash(INFOS.commandName)
  async execute(
    @Option('meme-name', { description: 'Search for a meme!' })
    memeName: string,
    @Option('text-top', { description: 'First text box' })
    text0: string,
    @Option('text-bottom', { description: 'Second text box' })
    text1: string,
    interaction: CommandInteraction,
  ) {
    const memes = await Http.fetch<IImgFlipGetResponse>(this.getUrl);
    const { bestMatch } = ImgFlipService.findClosestMemeName(memeName, memes);
    const singleMeme = memes.data.memes.find(meme => meme.name === bestMatch.target);
    const response = await Http.fetch<IImgFlipSuccessResponse>(
      this.createRequestBody(singleMeme!.id, text0, text1),
      'json'
    );

    await interaction.reply(new MessageEmbed({
      title: bestMatch?.target,
      url: response?.data?.url,
      // description: MemeCommand.getStats(bestMatch, memeName),
      image: {
        url: response?.data?.url
      },
      footer: {
        text: `[${bestMatch?.target}] found for search term [${memeName}] with ${
          +(bestMatch?.rating * 100).toFixed(2) + '%'
        } correlation`
      }
    }));
  }

  private getStats(bestMatch: Rating, memeName: string): string {
    return colorText(
      'blue',
      `[${bestMatch?.target}] found for search term [${memeName}] with [${
        +(bestMatch?.rating * 100).toFixed(2) + '%'
      }] correlation`
    );
  }

  private createRequestBody(id: string, text0: string = ' ', text1: string = ' '): string {
    const body: IImgFlipCaptionRequestBody = {
      password: config.imgFlipPw,
      template_id: id,
      text0: text0,
      text1: text1,
      username: config.imgFlipUser,
      font: 'impact',
      max_font_size: '50px'
    };

    return this.captionUrl + '?' + new URLSearchParams((body as unknown) as URLSearchParams);
  }
}
