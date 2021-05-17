import { Client, Command, CommandMessage, Guard, Infos } from '@typeit/discord';
import { NotBotGuard } from '../guards/not-bot.guard';
import { AbuelaCommand, AbuelaCommandInfos } from '../types';
import { NotHelpGuard } from '../guards/not-help.guard';
import { Aliases } from '../decorators/aliases';
import { NotPermissionsForGuard } from '../guards/not-permissions-for.guard';
import ytdl from 'ytdl-core';
import { GetAllUserArgs } from '../decorators/get-all-user-args';
import { ImALazyFuck, YoutubeService } from '../services/youtube.service';
import { ConnectionService } from '../services/connection.service';
import { NotInVoiceChannelGuard } from '../guards/not-in-voice-channel.guard';
import { Message } from 'discord.js';
import { colorText } from '../utils/color-text';

const INFOS: AbuelaCommandInfos = {
  commandName: 'play',
  description: `The "play" command lets AbuelaBot play a song`,
  usage: '`!play`',
  aliases: ['music', 'pl']
};

export abstract class PlayCommand implements AbuelaCommand {

  @Command(INFOS.commandName)
  @Infos(INFOS)
  @Aliases(INFOS.aliases)
  @Guard(NotHelpGuard, NotBotGuard, NotInVoiceChannelGuard, NotPermissionsForGuard(['CONNECT', 'SPEAK']))
  @GetAllUserArgs()
  async execute(command: CommandMessage, client: Client, allUserArgs: string) {
    const [ytResponse]: [ImALazyFuck, void] = await Promise.all([
      YoutubeService.getSearchListResponse(allUserArgs),
      ConnectionService.join(command)
    ]);

    const [ytdlInfo]: [ytdl.videoInfo, Message] = await Promise.all([
      ytdl.getInfo(ytResponse.items[0].id.videoId),
      command.channel.send(colorText('turquoise', `playing "${ytResponse?.items[0]?.snippet?.title}"`))
    ]);

    ConnectionService.voiceConnection
      ?.play(ytdl(ytdlInfo?.videoDetails?.video_url))
      .on('finish', () => {
        ConnectionService.leave(command);
      })
      .on('error', async error => {
        console.error(error);
        await command.channel.send(colorText('red', `something went wrong: [${error}]`));
      });
  }
}
