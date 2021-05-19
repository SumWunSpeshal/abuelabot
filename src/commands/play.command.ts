import { Client, Command, CommandMessage, Guard, Infos } from '@typeit/discord';
import { NotBotGuard } from '../guards/not-bot.guard';
import { AbuelaCommand, AbuelaCommandInfos } from '../types';
import { NotHelpGuard } from '../guards/not-help.guard';
import { Aliases } from '../decorators/aliases';
import { BotNeedsPermissionsGuard } from '../guards/bot-needs-permissions.guard';
import ytdl from 'ytdl-core';
import { GetAllUserArgs } from '../decorators/get-all-user-args';
import { ImALazyFuck, YoutubeService } from '../services/youtube.service';
import { ConnectionService } from '../services/connection.service';
import { NotInVoiceChannelGuard } from '../guards/not-in-voice-channel.guard';
import { colorText } from '../utils/color-text';
import { LoaderService } from '../services/loader.service';

const INFOS: AbuelaCommandInfos = {
  commandName: 'play',
  description: `The "play" command lets AbuelaBot play a song`,
  usage: '`!play`',
  aliases: ['music', 'p']
};

export abstract class PlayCommand implements AbuelaCommand {
  @Command(INFOS.commandName)
  @Infos(INFOS)
  @Aliases(INFOS.aliases)
  @Guard(NotHelpGuard, NotBotGuard, NotInVoiceChannelGuard, BotNeedsPermissionsGuard(['CONNECT', 'SPEAK']))
  @GetAllUserArgs()
  async execute(command: CommandMessage, client: Client, allUserArgs: string) {
    const [ytResponse]: [ImALazyFuck, void, void] = await Promise.all([
      YoutubeService.getSearchListResponse(allUserArgs),
      LoaderService.start(command),
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
