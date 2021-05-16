import { Client, Command, CommandMessage, Guard, Infos } from '@typeit/discord';
import { NotBotGuard } from '../guards/not-bot.guard';
import { AbuelaCommandInfos } from '../types';
import { NotHelpGuard } from '../guards/not-help.guard';
import { Aliases } from '../decorators/aliases';
import { JoinCommand } from './join.command';
import { NotPermissionsForGuard } from '../guards/not-permissions-for.guard';
import ytdl from 'ytdl-core';
import config from '../config';
import { GetAllUserArgs } from '../decorators/get-all-user-args';
import { Http } from '../utils/http';
import { VoiceConnection } from 'discord.js';

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
    const ytApiUrl = this.buildYtApiUrl(allUserArgs);
    const ytResponse: any = await Http.fetch(ytApiUrl);
    const newPackage = await ytdl.getInfo(ytResponse.items[0].id.videoId);
    //console.log(newPackage);
    //console.log(connection?.play(ytdl()));
    connection?.play(ytdl(newPackage.videoDetails.video_url));
    await command.channel.send('play');
  }

  private buildYtApiUrl(userInput: string): string {
    const params = {
      part: 'snippet',
      order: 'viewCount',
      key: config.ytKey,
      q: userInput || 'Rick Astley - Never Gonna Give You Up (Video)'
    };
    return 'https://youtube.googleapis.com/youtube/v3/search?' + new URLSearchParams(params);
  }

  private play(guild:any,song:any){
    
  }
}
