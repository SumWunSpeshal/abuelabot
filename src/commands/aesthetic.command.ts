import { Description, Discord, Option, Slash } from '@typeit/discord';
import { AbuelaCommandInfos } from '../types';
import { Random } from '../utils/random';
import { CommandInteraction } from 'discord.js';
import { FileHelper } from '../utils/file-helper';

const INFOS: AbuelaCommandInfos = {
  commandName: 'aesthetic',
  description: `ＷＲＩＴＥ　ＬＩＫＥ　ＲＹＡＮ　ＣＥＬＳＩＵＳ　ノ員気椅`
};

@Discord()
export abstract class AestheticCommand {
  private alphabet = FileHelper.parseToJSON(__dirname, '..', 'assets', 'aesthetic.json');
  
  @Slash(INFOS.commandName)
  @Description(INFOS.description)
  async execute(
    @Option('text', { description: 'Type your text', required: true })
    userInput: string,
    interaction: CommandInteraction
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
