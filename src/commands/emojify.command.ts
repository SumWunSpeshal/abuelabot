import { Client, Discord, Slash, Option, Description } from '@typeit/discord';
import { AbuelaCommand, AbuelaCommandInfos } from '../types';
import { readFileSync } from 'fs';
import Path from 'path';
import { EmojiListInterface } from '../api/emoji-list.interface';
import { CommandInteraction } from 'discord.js';

const INFOS: AbuelaCommandInfos = {
  commandName: 'emojify',
  description: 'Type your text and watch how Abuela inserts Emojis where a match is found',
};

@Discord()
export abstract class EmojifyCommand {
  private readonly emojis: EmojiListInterface = JSON.parse(
    readFileSync(Path.join(__dirname, '..', 'assets', 'emojis.json')).toString()
  );

  @Slash(INFOS.commandName)
  @Description(INFOS.description)
  async execute(
    @Option('text', { description: 'Type your text', required: true})
    userInput: string,
    interaction: CommandInteraction,
    client: Client
  ) {
    const result = this.replaceAllOccurrences(userInput);
    await interaction.reply(result);
  }

  private replaceAllOccurrences(userInput: string): string {
    const userInputSplit = userInput.split(' ');
    const { emojis } = this.emojis;

    return userInputSplit
      .map(word => {
        const match = emojis.find(({ name }) =>
          name.split(' ').find(emojiDescriptionName => emojiDescriptionName === word.toLowerCase())
        );
        return match ? word + ' ' + match.emoji : word;
      })
      .join(' ');
  }
}
