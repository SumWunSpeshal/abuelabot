import { BestMatch, findBestMatch } from 'string-similarity';
import { CommandHelper } from '../utils/command-helper';
import { readFileSync } from 'fs';
import * as Path from 'path';

interface Aliases {
  [key: string]: string;
}

export abstract class MemeGenerator {
  private static localMemeNames: string[] = JSON.parse(
    readFileSync(
      Path.join(__dirname, '..', 'assets', 'meme-names.json')
    ).toString()
  );

  /**
   * @description
   *
   * @param input
   * @param memeNames
   */
  static findClosestMemeName(
    input: string,
    memeNames: string[] = this.localMemeNames
  ): BestMatch {
    console.log(this.localMemeNames);
    const capitalized = CommandHelper.ucFirstLetterOfWords(input);
    const kebabCased = capitalized.split(' ').join('-');
    const match: BestMatch = findBestMatch(kebabCased, [
      ...Object.keys(this.aliases),
      ...memeNames
    ]);

    return this.aliases[match?.bestMatch?.target]
      ? {
          ...match,
          bestMatch: {
            ...match.bestMatch,
            target: this.aliases[match?.bestMatch?.target]
          }
        }
      : match;
  }

  /**
   * @description
   * Bunch of aliases to facilitate the string search
   *
   * @private
   */
  private static readonly aliases: Aliases = {
    Always: 'Always-Has-Been',
    Bill: 'Be-Like-Bill',
    Bernie: 'Bernie-I-Am-Once-Again-Asking-For-Your-Support',
    Wilson: 'Castaway-Fire',
    Castaway: 'Castaway-Fire',
    Cmm: 'Change-My-Mind',
    Changemind: 'Change-My-Mind'
  };
}
