import { Main } from '../main';
import { KnownRoles, KnownTextChannels } from './statics';
import { Guild, GuildMember, Snowflake, TextChannel } from 'discord.js';

type DelimiterArr = Array<' ' | '-'>;

export abstract class CommandHelper {
  static stripCommandKeyWord({ commandContent }: any): string {
    const [_, ...rest] = commandContent ? commandContent.trim().split(' ') : [];
    return rest.join(' ');
  }

  static ucFirstLetterOfWords(input: string): string {
    const delimiters: DelimiterArr = [' ', '-'];
    let ret: string = input;

    delimiters.forEach(delimiter => {
      ret = ret
        .split(delimiter)
        .map(item => this.ucFirstLetter(item))
        .join(delimiter);
    });

    return ret;
  }

  static ucFirstLetter(input: string): string {
    const [firstLetter, ...rest] = input;
    return (firstLetter || '').toUpperCase() + (rest || []).join('');
  }

  // static getCommandName({ commandContent }: CommandMessage): CommandInfos | undefined {
  //   const commands: CommandInfos[] = Client.getCommands();
  //
  //   return commands.find(({ commandName, infos }) => {
  //     return [commandName, ...(infos.aliases || [])].find(item => {
  //       return commandContent?.toLowerCase().includes(item);
  //     });
  //   });
  // }

  static containsDescriptionFlag(userInput: string): boolean {
    return !!userInput.split(' ').find(snippet => snippet === process.env.EXTENDED_DESCRIPTION_FLAG);
  }

  static createArrayChunks<T>(array: T[], chunkSize: number): T[][] {
    const numberOfChunks = Math.ceil(array.length / chunkSize)

    return [...Array(numberOfChunks)]
      .map((_, index) => {
        return array.slice(index * chunkSize, (index + 1) * chunkSize)
      })
  }

  static getTextChannelById(id: KnownTextChannels | string): TextChannel | undefined {
    return Main.client.channels.cache.get(id) as TextChannel;
  }

  static getGuildById(guildId: Snowflake): Guild | undefined {
    return Main.client.guilds.cache.get(guildId);
  }

  static getMemberById(guild: Guild, memberId: Snowflake): GuildMember | undefined {
    return guild.members.cache.get(memberId);
  }

  /**
   * @description
   * Remove all template args like {:slug :number}
   *
   * @param input
   */
  static stripArgs(input: string): string {
    return input
      .split(' ')
      .filter(item => !item.includes(':'))
      .join(' ');
  }

  static mention<T extends KnownRoles>(id: T): string {
    return `<@&${id}>`;
  }
}
