import { ArgsOf, Discord, On } from '@typeit/discord';
import { AbuelaEvent } from '../types';
import { TextChannel } from 'discord.js';
import { CommandHelper } from '../utils/command-helper';

const GOOD_BYE_MESSAGE = `Goodbye %USER_NAME%. %GUILD_NAME% will miss you!`;

@Discord()
export abstract class GoodByeEvent implements AbuelaEvent {
  @On('guildMemberRemove')
  async on([member]: ArgsOf<'guildMemberRemove'>): Promise<void> {
    const defaultTextChannel = member.guild.channels.cache.find(channel => {
      return channel.name === 'general' && channel instanceof TextChannel;
    }) as TextChannel | undefined;

    if (defaultTextChannel) {
      await defaultTextChannel.send(
        GOOD_BYE_MESSAGE
          .replace('%USER_NAME%', member.user?.id ? CommandHelper.mentionMember(member.user?.id) : `*${member.user?.username}*`)
          .replace('%GUILD_NAME%', `\`${member.guild.name}\``)
      );
    }
  }
}
