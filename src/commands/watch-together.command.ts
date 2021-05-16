import { Client, Command, CommandMessage, Guard, Infos } from '@typeit/discord';
import { NotBotGuard } from '../guards/not-bot.guard';
import { AbuelaCommand, AbuelaCommandInfos } from '../types';
import { NotHelpGuard } from '../guards/not-help.guard';
import { Http } from '../utils/http';
import config from '../config';
import { Aliases } from '../decorators/aliases';
import { GetAllUserArgs } from '../decorators/get-all-user-args';
import { colorText } from '../utils/color-text';

const INFOS: AbuelaCommandInfos = {
  commandName: 'watchtogether',
  description: `Quickly share a Watch2Gether link. Use the {searchTerms} argument just like you would use the YouTube search or paste a link to the Youtube video.`,
  usage: '`!watchtogether {searchTerms}` or `!watchtogether {youtubeURL}`',
  aliases: ['w2g', 'watch', 'together']
};

type ImALazyFuck = any; // FIXME obviously

export abstract class WatchTogetherCommand implements AbuelaCommand {
  private readonly w2gUrl = 'https://w2g.tv/rooms/create.json';

  private readonly ytUrl = 'https://youtube.googleapis.com/youtube/v3/search';

  @Command(INFOS.commandName)
  @Infos(INFOS)
  @Guard(NotHelpGuard, NotBotGuard)
  @Aliases(INFOS.aliases)
  @GetAllUserArgs()
  async execute(command: CommandMessage, client: Client, allUserArgs: string) {

    let ytUrl = '';
    let message = '';

    if (this.isYoutubeUrl(allUserArgs)) {
      ytUrl = allUserArgs;
    } else {
      const ytHttpGetUrl = this.buildYtApiUrl(allUserArgs);
      const ytResponse: ImALazyFuck = await Http.fetch(ytHttpGetUrl);
      const firstYtVideo = ytResponse?.items[0];
      ytUrl = 'https://www.youtube.com/watch?v=' + firstYtVideo?.id?.videoId;
      message += `Youtube video about to play: \`${firstYtVideo?.snippet?.title}\`\n\n`;
    }

    const w2gRequestBody = this.buildW2gRequestBody(ytUrl);
    const w2gResponse: ImALazyFuck = await Http.fetch(this.w2gUrl, 'json', w2gRequestBody);

    message += `${!allUserArgs ? `Eh stupid, You should tell me what you're looking for ...\n` : ''}`;
    message += `https://w2g.tv/rooms/${w2gResponse?.streamkey}`;

    await command.channel.send(message);
  }

  private isYoutubeUrl(userInput: string): boolean {
    const isUrl = userInput.includes('http') && userInput.includes('youtu');
    return isUrl;
  }

  private buildYtApiUrl(userInput: string): string {
    const params = {
      part: 'snippet',
      order: 'viewCount',
      key: config.ytKey,
      q: userInput || 'Rick Astley - Never Gonna Give You Up (Video)'
    };

    return this.ytUrl + '?' + new URLSearchParams(params);
  }

  /**
   * @description
   * todo: add method that returns a massage when a false link e.g. amazon ist sent.
   *
   * @param url
   * @returns
   */
  private buildW2gRequestBody(url: string) {
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
