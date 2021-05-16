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

const INFOS: AbuelaCommandInfos = {
  commandName: 'play',
  description: `The "play" command lets AbuelaBot play a song`,
  usage: '`!play`',
  aliases: ['music', 'p']
};

export abstract class PlayCommand implements AbuelaCommand {
  @Command(INFOS.commandName)
  @Infos(INFOS)
  @Guard(NotHelpGuard, NotBotGuard, NotPermissionsForGuard(['CONNECT', 'SPEAK']))
  @Aliases(INFOS.aliases)
  @GetAllUserArgs()
  async execute(command: CommandMessage, client: Client, allUserArgs: string) {
    await ConnectionService.join(command);
    const ytResponse: ImALazyFuck = await YoutubeService.getSearchListResponse(allUserArgs);
    const ytdlInfo = await ytdl.getInfo(ytResponse.items[0].id.videoId);
    ConnectionService.voiceConnection?.play(ytdl(ytdlInfo.videoDetails.video_url));
    await command.channel.send(`playing \`${ytResponse?.items[0]?.snippet?.title}\``);
  }
}
