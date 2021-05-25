import { Discord, Option, Slash } from '@typeit/discord';
import { AbuelaCommandInfos } from '../types';
import ytdl from 'ytdl-core';
import { ImALazyFuck, YoutubeService } from '../services/youtube.service';
import { ConnectionService } from '../services/connection.service';
import { colorText } from '../utils/color-text';
import { CommandInteraction } from 'discord.js';

const INFOS: AbuelaCommandInfos = {
  commandName: 'play',
  description: `Type your search as if you were on YouTube!`,
  usage: '`!play`',
  aliases: ['music', 'p']
};

@Discord()
export abstract class PlayCommand {
  @Slash(INFOS.commandName)
  async execute(
    @Option('search-youtube', { description: INFOS.description })
    userInput: string,
    interaction: CommandInteraction
  ) {
    await interaction.defer();
    await ConnectionService.join(interaction);
    const ytResponse: ImALazyFuck = await YoutubeService.getSearchListResponse(userInput);
    const ytdlInfo: ytdl.videoInfo = await ytdl.getInfo(ytResponse.items[0].id.videoId);

    ConnectionService.voiceConnection
      ?.play(ytdl(ytdlInfo?.videoDetails?.video_url))
      .once('speaking', async () => {
        await interaction.editReply(colorText('turquoise', `playing "${ytResponse?.items[0]?.snippet?.title}"`));
        console.log('playing');
      })
      .on('finish', () => {
        ConnectionService.leave(interaction);
      })
      .on('error', async error => {
        console.error(error);
        await interaction.editReply(colorText('red', `something went wrong: [${error}]`));
      });
  }
}
