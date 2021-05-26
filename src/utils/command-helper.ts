import { Main } from '../main';
import { KnownRoles, KnownTextChannels } from './statics';
import { Collection, Guild, GuildMember, Message, Snowflake, TextChannel } from 'discord.js';

type DelimiterArr = Array<' ' | '-'>;

export abstract class CommandHelper {
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

  static createArrayChunks<T>(array: T[], chunkSize: number): T[][] {
    const numberOfChunks = Math.ceil(array.length / chunkSize)

    return [...Array(numberOfChunks)]
      .map((_, index) => {
        return array.slice(index * chunkSize, (index + 1) * chunkSize)
      })
  }

  static getTextChannelById(id: KnownTextChannels | Snowflake): TextChannel | undefined {
    return Main.client.channels.cache.get(id) as TextChannel;
  }

  static getMessagesOfTextChannel(id: KnownTextChannels | Snowflake): Promise<Collection<string, Message>> | undefined {
    return this.getTextChannelById(id)?.messages.fetch();
  }

  static async getLastInteractionOfTextChannel(id: KnownTextChannels | Snowflake) {
    const messages = await this.getMessagesOfTextChannel(id);
    return messages!.find(message => !!message.interaction);
  }

  static getGuildById(guildId: Snowflake): Guild | undefined {
    return Main.client.guilds.cache.get(guildId);
  }

  static getMemberById(guild: Guild, memberId: Snowflake): GuildMember | undefined {
    return guild.members.cache.get(memberId);
  }

  static mention<T extends KnownRoles>(id: T): string {
    return `<@&${id}>`;
  }
}
