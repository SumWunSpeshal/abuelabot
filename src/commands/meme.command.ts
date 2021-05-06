import { Client, Command, CommandMessage, Guard } from '@typeit/discord';
import { NotBotGuard } from '../guards/not-bot.guard';
import { AbuelaCommand } from '../types';
import config from '../config';
import { Http } from '../utils/http';
import { GetAllUserArgs } from '../decorators/get-all-user-args';
import { url } from '../utils/tagged-templates';
import { RequestInit } from 'node-fetch';
import { MessageAttachment } from 'discord.js';
import { MemeGenerator } from '../api/meme-generator';
import { findBestMatch } from 'string-similarity';

export abstract class MemeCommand implements AbuelaCommand {
  private readonly requestBody: RequestInit = {
    method: 'GET',
    headers: {
      'x-rapidapi-key': `${config.xRapidKey}`,
      'x-rapidapi-host': 'ronreiter-meme-generator.p.rapidapi.com'
    }
  };

  @Command('meme')
  @GetAllUserArgs('|')
  @Guard(NotBotGuard)
  async execute(
    command: CommandMessage,
    client: Client,
    allUserArgs: string[]
  ) {
    const [memeName, topText, bottomText] = allUserArgs;
    const { bestMatch } = findBestMatch(memeName, MemeGenerator.memeNames);

    const response = await Http.get<Buffer>(
      this.buildUrl(bestMatch.target, topText, bottomText),
      'buffer',
      this.requestBody
    );

    await command.channel.send(new MessageAttachment(response));
  }

  buildUrl(name: string, topText: string, bottomText: string): string {
    return url`https://ronreiter-meme-generator.p.rapidapi.com/meme?meme=${
      name || ''
    }&bottom=${bottomText || ''}&top=${topText || ''}&font=Impact&font_size=50`;
  }
}
