import { ArgsOf, Client, Discord, On } from '@typeit/discord';
import { AbuelaEvent } from '../types';
import { TextChannel } from 'discord.js';
import { CommandHelper } from '../utils/command-helper';

const WELCOME_MESSAGE = `Welcome %USER_NAME% to %GUILD_NAME%. We hope you'll have a great stay. \n\nIf you want to learn more about me, just type \`/\` in any of this server's text channels and see all the cool moves I know.`;

@Discord()
export abstract class WelcomeEvent implements AbuelaEvent {
  @On('guildMemberAdd')
  async on([member]: ArgsOf<'guildMemberAdd'>, client: Client): Promise<void> {
    const defaultTextChannel = member.guild.channels.cache.find(channel => {
      return channel.name === 'general' && channel instanceof TextChannel;
    }) as TextChannel | undefined;

    if (defaultTextChannel) {
      await defaultTextChannel.send(
        WELCOME_MESSAGE
          .replace('%USER_NAME%', CommandHelper.mentionMember(member.user.id))
          .replace('%GUILD_NAME%', `\`${member.guild.name}\``)
      );
    }
  }
}
