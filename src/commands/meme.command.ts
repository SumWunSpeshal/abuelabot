import { Client, Command, CommandMessage, Guard, Infos } from '@typeit/discord';
import { NotBotGuard } from '../guards/not-bot.guard';
import { AbuelaCommand, AbuelaCommandInfos } from '../types';
import config from '../config';
import { Http } from '../utils/http';
import { GetAllUserArgs } from '../decorators/get-all-user-args';
import { format, url } from '../utils/tagged-templates';
import { RequestInit } from 'node-fetch';
import { MessageAttachment } from 'discord.js';
import { MemeGenerator } from '../api/meme-generator';
import { NotHelpGuard } from '../guards/not-help.guard';

export abstract class MemeCommand implements AbuelaCommand {
  private readonly requestBody: RequestInit = {
    method: 'GET',
    headers: {
      'x-rapidapi-key': config.xRapidKey,
      'x-rapidapi-host': 'ronreiter-meme-generator.p.rapidapi.com'
    }
  };

  private static readonly infos: AbuelaCommandInfos = {
    description: 'TODO',
    usage: 'TODO with `code`'
  };

  @Command('meme')
  @Infos(MemeCommand.infos)
  @Guard(NotHelpGuard, NotBotGuard)
  @GetAllUserArgs('|')
  async execute(command: CommandMessage, client: Client, allUserArgs: string[]) {
    const [memeName, topText, bottomText] = allUserArgs;
    const memeNamesResponse = await Http.get<any>(
      'https://ronreiter-meme-generator.p.rapidapi.com/images',
      'json',
      this.requestBody
    );
    const { bestMatch } = MemeGenerator.findClosestMemeName(memeName, memeNamesResponse);
    const imgResponse = await Http.get<Buffer>(
      this.buildUrl(bestMatch?.target, topText, bottomText),
      'buffer',
      this.requestBody
    );

    await command.channel.send(
      format('**')`${bestMatch?.target} found for search term ${memeName} with ${
        (bestMatch?.rating * 100).toFixed(2) + '%'
      } correlation`,
      new MessageAttachment(imgResponse)
    );
  }

  buildUrl(name: string, topText: string, bottomText: string): string {
    return url`https://ronreiter-meme-generator.p.rapidapi.com/meme?meme=${name || ''}&bottom=${bottomText || ''}&top=${
      topText || ''
    }&font=Impact&font_size=50`;
  }
}
