import { EmojiFallbacks, KnownEmojis } from '../statics';
import { Guild, GuildEmoji } from 'discord.js';
import { CommandHelper } from '../utils/command-helper';

export abstract class EmojiService {
  static safeGet(emojiId: KnownEmojis, currentGuild: Guild): GuildEmoji | string {
    const emojiFound = currentGuild && CommandHelper.getEmojiById(currentGuild, emojiId);
    return emojiFound ?? (EmojiFallbacks[emojiId as keyof typeof EmojiFallbacks]);
  }
}
