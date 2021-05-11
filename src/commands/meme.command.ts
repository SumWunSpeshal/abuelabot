import { Client, Command, CommandMessage, Guard, Infos } from '@typeit/discord';
import { NotBotGuard } from '../guards/not-bot.guard';
import { AbuelaCommand, AbuelaCommandInfos } from '../types';
import config from '../config';
import { Http } from '../utils/http';
import { GetAllUserArgs } from '../decorators/get-all-user-args';
import { NotHelpGuard } from '../guards/not-help.guard';
import { ImgFlip } from '../services/img-flip';
import { ImgFlipInterface } from '../api/img-flip.interface';
import { Aliases } from '../decorators/aliases';
import { Rating } from 'string-similarity';
import { colorText } from '../utils/color-text';

export abstract class MemeCommand implements AbuelaCommand {
  private static readonly getUrl = 'https://api.imgflip.com/get_memes';

  private static readonly captionUrl = 'https://api.imgflip.com/caption_image';

  private static readonly infos: AbuelaCommandInfos = {
    description: `Search a meme from imgflip and add your own caption to it! Add up to two captions to your meme. The captions will be conveniently placed, trying to fit the meme. We check for search term similarities so your query doesn't need to be exact.`,
    usage: '`!meme {searchTerm?} | {caption1?} | {caption2?}` or just `!meme` for a random, non-captioned meme',
    aliases: ['imgflip', 'img', 'caption', 'cap']
  };

  @Command('meme')
  @Infos(MemeCommand.infos)
  @Aliases(MemeCommand.infos.aliases!)
  @Guard(NotHelpGuard, NotBotGuard)
  @GetAllUserArgs('|')
  async execute(command: CommandMessage, client: Client, allUserArgs: string[]) {
    const [memeName, text0, text1] = allUserArgs;
    const memes: ImgFlipInterface.GetResponse = await Http.fetch<ImgFlipInterface.GetResponse>(MemeCommand.getUrl);
    const { bestMatch } = ImgFlip.findClosestMemeName(memeName, memes);
    const singleMeme = memes.data.memes.find(meme => {
      return meme.name === bestMatch.target;
    });
    const response: ImgFlipInterface.SuccessResponse = await Http.fetch(
      MemeCommand.createRequestBody(singleMeme!.id, text0, text1),
      'json'
    );

    await command.channel.send({
      embed: {
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
      }
    });
  }

  private static getStats(bestMatch: Rating, memeName: string): string {
    return colorText(
      'blue',
      `[${bestMatch?.target}] found for search term [${memeName}] with [${
        +(bestMatch?.rating * 100).toFixed(2) + '%'
      }] correlation`
    );
  }

  private static createRequestBody(id: string, text0: string = ' ', text1: string = ' '): string {
    const body: ImgFlipInterface.CaptionRequestBody = {
      password: config.imgFlipPw,
      template_id: id,
      text0: text0,
      text1: text1,
      username: config.imgFlipUser,
      font: 'impact',
      max_font_size: '50px'
    };

    return MemeCommand.captionUrl + '?' + new URLSearchParams((body as unknown) as URLSearchParams);
  }
}
