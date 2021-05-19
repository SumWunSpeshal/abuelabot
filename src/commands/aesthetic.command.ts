import { Client, Command, CommandMessage, Guard, Infos } from '@typeit/discord';
import { NotBotGuard } from '../guards/not-bot.guard';
import { AbuelaCommand, AbuelaCommandInfos } from '../types';
import { NotHelpGuard } from '../guards/not-help.guard';
import { GetAllUserArgs } from '../decorators/get-all-user-args';
import { Aliases } from '../decorators/aliases';
import { readFileSync } from 'fs';
import Path from 'path';
import { Random } from '../utils/random';

const INFOS: AbuelaCommandInfos = {
  commandName: 'aesthetic',
  description: `ＷＲＩＴＥ　ＬＩＫＥ　ＴＨＩＳ !`,
  usage: '`!aesthetic {sentence}`',
  aliases: ['aes', 'chic', 'chique', 'sadboy', 'sadboi', 'vapor', 'vaporwave', 'lofi']
};

export abstract class AestheticCommand implements AbuelaCommand {
  private alphabet = JSON.parse(readFileSync(Path.join(__dirname, '..', 'assets', 'aesthetic.json')).toString());

  @Command(INFOS.commandName)
  @Infos(INFOS)
  @Guard(NotHelpGuard, NotBotGuard)
  @Aliases(INFOS.aliases)
  @GetAllUserArgs()
  async execute(command: CommandMessage, client: Client, userInput: string) {
    const replaced = userInput
      .split('')
      .map(letter => this.alphabet[letter] || letter)
      .join('');

    const spaced = replaced
      .split(' ')
      .map((word, index, arr) => {
        return word + ((arr.length === index + 1) ? '' : Random.getRandomFrom(['   ', this.alphabet.space]));
      })
      .join('');

    const addBrackets = this.alphabet.bracket_open + spaced + this.alphabet.bracket_close

    const japAdded = addBrackets + `   (${Random.getRandomFrom(this.alphabet.jap)})`;
    await command.channel.send(japAdded);
  }
}
