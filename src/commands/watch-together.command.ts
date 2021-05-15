import { Client, Command, CommandMessage, Guard, Infos } from '@typeit/discord';
import { NotBotGuard } from '../guards/not-bot.guard';
import { AbuelaCommand, AbuelaCommandInfos } from '../types';
import { NotHelpGuard } from '../guards/not-help.guard';
import { Http } from '../utils/http';
import config from '../config';
import { Aliases } from '../decorators/aliases';
import { GetAllUserArgs } from '../decorators/get-all-user-args';

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
    const url = await this.buildYtUrl(allUserArgs);
    const w2gRequestBody = this.buildW2gRequestBody(url);
    const w2gResponse: ImALazyFuck = await Http.fetch(this.w2gUrl, 'json', w2gRequestBody);
    await command.channel.send(
      `${!allUserArgs ? `Eh stupid, You should tell me what you're looking for ...\n` : ''}` +
        `https://w2g.tv/rooms/${w2gResponse?.streamkey}`
    );
  }

  private isYoutubeUrl (userInput: string):boolean {
    const isUrl = userInput.includes('http') && userInput.includes('youtu');
    return isUrl;
  }

  private buildYtApiUrl(userInput: string) {
    const params = {
      part: 'snippet',
      order: 'viewCount',
      key: config.ytKey,
      q: userInput || 'Rick Astley - Never Gonna Give You Up (Video)'
    };

    return this.ytUrl + '?' + new URLSearchParams(params);
  }

  private async buildYtUrl (allUserArgs:string):Promise<string> {
    if (this.isYoutubeUrl(allUserArgs)){
      return allUserArgs;
    }else{
      const ytUrl = this.buildYtApiUrl(allUserArgs);
      const ytResponse: ImALazyFuck = await Http.fetch(ytUrl);
      return 'https://www.youtube.com/watch?v=' + (ytResponse?.items[0]?.id?.videoId);
    }
  }

  /**
   * @description
   * todo: add method that returns a massage when a false link e.g. amazon ist sent.
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
