export interface EmojiListInterface {
  emojis: Emoji[];
}

export interface Emoji {
  emoji: string;
  name: string;
  shortname: string;
  unicode: string;
  html: string;
  category: string;
  order: string;
}
