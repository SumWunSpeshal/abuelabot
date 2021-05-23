import { EmojiFallbacks, KnownEmojis } from '../utils/statics';
import { Main } from '../main';
import { Guild, GuildEmoji } from 'discord.js';

export abstract class EmojiService {
  static safeGet(emojiId: KnownEmojis, currentGuild: Guild): GuildEmoji | string {
    const guildFound = Main.client.guilds.cache.find(guild => guild.id === currentGuild.id);
    const emojiFound = guildFound!.emojis.cache.find(emoji => emoji.id === emojiId);
    return emojiFound ?? EmojiFallbacks[emojiId];
  }
}
