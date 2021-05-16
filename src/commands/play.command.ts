import { Client, Command, CommandMessage, Guard, Infos } from '@typeit/discord';
import { NotBotGuard } from '../guards/not-bot.guard';
import { AbuelaCommandInfos } from '../types';
import { NotHelpGuard } from '../guards/not-help.guard';
import { Aliases } from '../decorators/aliases';
import { JoinCommand } from './join.command';
import { NotPermissionsForGuard } from '../guards/not-permissions-for.guard';
import ytdl from 'ytdl-core';
import { GetAllUserArgs } from '../decorators/get-all-user-args';
import { VoiceConnection } from 'discord.js';
import { ImALazyFuck, YoutubeService } from '../services/youtube.service';

const INFOS: AbuelaCommandInfos = {
  commandName: 'play',
  description: `The "play" command lets AbueleBot play a song`,
  usage: '`!play`',
  aliases: ['music', 'p']
};

export abstract class PlayCommand {
  @Command(INFOS.commandName)
  @Infos(INFOS)
  @Guard(NotHelpGuard, NotBotGuard, NotPermissionsForGuard(['CONNECT', 'SPEAK']))
  @Aliases(INFOS.aliases)
  @GetAllUserArgs()
  async execute(command: CommandMessage, client: Client, allUserArgs: string) {
    const joinCommand = new JoinCommand();
    const connection: VoiceConnection | undefined = await joinCommand.execute(command);
    const ytResponse: ImALazyFuck = await YoutubeService.getSearchListResponse(allUserArgs);
    const ytdlInfo = await ytdl.getInfo(ytResponse.items[0].id.videoId);
    console.log(ytdlInfo.videoDetails.video_url);
    connection?.play(ytdl(ytdlInfo.videoDetails.video_url));
    await command.channel.send(`playing \`${ytResponse?.items[0]?.snippet?.title}\``);
  }
}
