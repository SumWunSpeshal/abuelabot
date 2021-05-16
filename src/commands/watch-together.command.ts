import { Client, Command, CommandMessage, Guard, Infos } from '@typeit/discord';
import { NotBotGuard } from '../guards/not-bot.guard';
import { AbuelaCommand, AbuelaCommandInfos } from '../types';
import { NotHelpGuard } from '../guards/not-help.guard';
import { Http } from '../utils/http';
import config from '../config';
import { Aliases } from '../decorators/aliases';
import { GetAllUserArgs } from '../decorators/get-all-user-args';
import { ImALazyFuck, YoutubeService } from '../services/youtube.service';
import { RequestInit } from 'node-fetch';
import { colorText } from '../utils/color-text';

const INFOS: AbuelaCommandInfos = {
  commandName: 'watchtogether',
  description: `Quickly share a Watch2Gether link. Use the {searchTerms} argument just like you would use the YouTube search or paste a link to the Youtube video.`,
  usage: '`!watchtogether {searchTerms}` or `!watchtogether {youtubeURL}`',
  aliases: ['w2g', 'watch', 'together']
};

interface W2gResponse {
  streamkey: string;
}

export abstract class WatchTogetherCommand implements AbuelaCommand {
  private readonly w2gUrl = 'https://w2g.tv/rooms/create.json';

  @Command(INFOS.commandName)
  @Infos(INFOS)
  @Guard(NotHelpGuard, NotBotGuard)
  @Aliases(INFOS.aliases)
  @GetAllUserArgs()
  async execute(command: CommandMessage, client: Client, allUserArgs: string) {
    const ytResponse: ImALazyFuck = await YoutubeService.getSearchListResponse(allUserArgs);
    const w2gRequestBody: RequestInit = this.buildW2gRequestBody(
      YoutubeService.getFullUrl(ytResponse?.items[0]?.id?.videoId)
    );
    const w2gResponse: W2gResponse = await Http.fetch(this.w2gUrl, 'json', w2gRequestBody);

    let message = `${!allUserArgs ? `Eh stupid, You should tell me what you're looking for ...\n\n` : ''}`;
    message += `${colorText('yellow', ytResponse?.items[0]?.snippet?.title)}\n`;
    message += `https://w2g.tv/rooms/${w2gResponse?.streamkey}`;

    await command.channel.send(message);
  }

  /**
   * @description
   * todo: add method that returns a massage when a false link e.g. amazon ist sent.
   *
   * @param url
   * @returns
   */
  private buildW2gRequestBody(url: string): RequestInit {
    const body = {
      w2g_api_key: config.w2gKey,
      share: url,
      bg_color: '#00ff00',
      bg_opacity: '50'
    };

    return {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    };
  }
}
