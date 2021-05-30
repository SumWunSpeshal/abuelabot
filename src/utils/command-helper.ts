import { Main } from '../main';
import { KnownRoles, KnownTextChannels } from '../statics';
import { Collection, Guild, GuildEmoji, GuildMember, Message, Snowflake, TextChannel } from 'discord.js';

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
    const numberOfChunks = Math.ceil(array.length / chunkSize);

    return [...Array(numberOfChunks)].map((_, index) => {
      return array.slice(index * chunkSize, (index + 1) * chunkSize);
    });
  }

  static splitLargeString(largeString: string, maxLength: number): string[] {
    const sentences = largeString.split('. ');
    let ret = [''];

    sentences.forEach(sentence => {
      if (ret[ret.length - 1].length + sentence.length <= maxLength) {
        ret[ret.length - 1] += sentence + '. ';
      } else {
        ret.push(sentence + '. ');
      }
    });

    return ret;
  }

  static getTextChannelById(textChannelId: KnownTextChannels | Snowflake): TextChannel | undefined {
    return Main.client.channels.cache.get(textChannelId) as TextChannel;
  }

  static getMessagesOfTextChannel(textChannelId: KnownTextChannels | Snowflake): Promise<Collection<string, Message>> | undefined {
    return this.getTextChannelById(textChannelId)?.messages.fetch();
  }

  static async getLastInteractionOfTextChannel(textChannelId: KnownTextChannels | Snowflake) {
    const messages = await this.getMessagesOfTextChannel(textChannelId);
    return messages!.find(message => !!message.interaction);
  }

  static getGuildById(guildId: Snowflake): Guild | undefined {
    return Main.client.guilds.cache.get(guildId);
  }

  static getMemberById(guild: Guild, memberId: Snowflake): GuildMember | undefined {
    return guild.members.cache.get(memberId);
  }

  static getEmojiById(guild: Guild, emojiId: Snowflake): GuildEmoji | undefined {
    return guild.emojis.cache.get(emojiId);
  }

  static mentionRole<T extends KnownRoles>(id: T | Snowflake): string {
    return `<@&${id}>`;
  }

  static mentionMember(id: Snowflake): string {
    return `<@${id}>`;
  }

  static formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('de-DE', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}
