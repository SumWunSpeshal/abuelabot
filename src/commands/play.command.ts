import { Client } from '@typeit/discord';
import { AbuelaCommand, AbuelaCommandInfos } from '../types';
import ytdl from 'ytdl-core';
import { ImALazyFuck, YoutubeService } from '../services/youtube.service';
import { ConnectionService } from '../services/connection.service';
import { colorText } from '../utils/color-text';
import { LoaderService } from '../services/loader.service';

const INFOS: AbuelaCommandInfos = {
  commandName: 'play',
  description: `The "play" command lets AbuelaBot play a song`,
  usage: '`!play`',
  aliases: ['music', 'p']
};

export abstract class PlayCommand implements AbuelaCommand {
  // @Command(INFOS.commandName)
  // @Infos(INFOS)
  // @Aliases(INFOS.aliases)
  // @Guard(NotHelpGuard, NotBotGuard, NotInVoiceChannelGuard, BotNeedsPermissionsGuard(['CONNECT', 'SPEAK']))
  // @GetAllUserArgs()
  async execute(command: any, client: Client, allUserArgs: string) {
    LoaderService.start(command).then();

    const [ytResponse]: [ImALazyFuck, void] = await Promise.all([
      YoutubeService.getSearchListResponse(allUserArgs),
      ConnectionService.join(command)
    ]);

    const ytdlInfo: ytdl.videoInfo = await ytdl.getInfo(ytResponse.items[0].id.videoId);

    ConnectionService.voiceConnection
      ?.play(ytdl(ytdlInfo?.videoDetails?.video_url))
      .once('speaking', async () => {
        await LoaderService.done();
        await command.reply(colorText('turquoise', `playing "${ytResponse?.items[0]?.snippet?.title}"`));
        console.log('playing');
      })
      .on('finish', () => {
        ConnectionService.leave(command);
      })
      .on('error', async error => {
        console.error(error);
        await command.reply(colorText('red', `something went wrong: [${error}]`));
      });
  }
}
