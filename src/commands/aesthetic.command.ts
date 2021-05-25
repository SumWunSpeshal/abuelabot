import { Discord, Option, Slash } from '@typeit/discord';
import { AbuelaCommandInfos } from '../types';
import { readFileSync } from 'fs';
import Path from 'path';
import { Random } from '../utils/random';
import { CommandInteraction } from 'discord.js';

const INFOS: AbuelaCommandInfos = {
  commandName: 'aesthetic',
  description: `ＷＲＩＴＥ　ＬＩＫＥ　ＴＨＩＳ !`,
  usage: '`!aesthetic {sentence}`',
  aliases: ['aes', 'chic', 'chique', 'sadboy', 'sadboi', 'vapor', 'vaporwave', 'lofi']
};

@Discord()
export abstract class AestheticCommand {
  private alphabet = JSON.parse(readFileSync(Path.join(__dirname, '..', 'assets', 'aesthetic.json')).toString());

  @Slash(INFOS.commandName)
  async execute(
    @Option('text', { description: INFOS.description })
    userInput: string,
    interaction: CommandInteraction,
  ) {
    const replaced = userInput
      .split('')
      .map(letter => this.alphabet[letter] || letter)
      .join('');

    const spaced = replaced
      .split(' ')
      .map((word, index, arr) => {
        return word + (arr.length === index + 1 ? '' : Random.getRandomFrom(['   ', this.alphabet.space]));
      })
      .join('');

    const addBrackets = Random.getRandomFrom([
      this.alphabet.bracket_open + spaced + this.alphabet.bracket_close,
      spaced
    ]);

    const result = Random.getRandomFrom([addBrackets, addBrackets + `   (${Random.getRandomFrom(this.alphabet.jap)})`]);

    await interaction.reply(result);
  }
}
