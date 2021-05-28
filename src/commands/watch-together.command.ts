import { Description, Discord, Option, Slash } from '@typeit/discord';
import { AbuelaCommandInfos } from '../types';
import { Http } from '../utils/http';
import config from '../config';
import { ImALazyFuck, YoutubeService } from '../services/youtube.service';
import { RequestInit } from 'node-fetch';
import { colorText } from '../utils/color-text';
import { CommandInteraction } from 'discord.js';

const INFOS: AbuelaCommandInfos = {
  commandName: 'watchtogether',
  description: `Quickly share a Watch2Gether link.`
};

interface W2gResponse {
  streamkey: string;
}

@Discord()
export abstract class WatchTogetherCommand {
  private readonly w2gUrl = 'https://w2g.tv/rooms/create.json';

  @Slash(INFOS.commandName)
  @Description(INFOS.description)
  async execute(
    @Option('search-youtube', { description: 'Search as if you were on Youtube', required: true })
    userInput: string,
    interaction: CommandInteraction,
  ) {
    const ytResponse: ImALazyFuck = await YoutubeService.getSearchListResponse(userInput);
    const w2gRequestBody: RequestInit = this.buildW2gRequestBody(
      YoutubeService.getFullUrl(ytResponse?.items[0]?.id?.videoId)
    );
    const w2gResponse: W2gResponse = await Http.fetch(this.w2gUrl, 'json', w2gRequestBody);

    let message = `${!userInput ? `You should tell me what you're looking for ...\n\n` : ''}`;
    message += `${colorText('yellow', ytResponse?.items[0]?.snippet?.title)}\n`;
    message += `https://w2g.tv/rooms/${w2gResponse?.streamkey}`;

    await interaction.reply(message);
  }

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
