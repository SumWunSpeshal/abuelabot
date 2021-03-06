import { readFileSync } from 'fs';
import Path from 'path';
import { BestMatch, findBestMatch } from 'string-similarity';
import { CommandHelper } from '../utils/command-helper';
import { IImgFlipGetResponse } from '../api/img-flip.interface';
import { Random } from '../utils/random';
import { FileHelper } from '../utils/file-helper';

interface Aliases {
  [key: string]: string;
}

export abstract class ImgFlipService {

  private static readonly localMemes: IImgFlipGetResponse = FileHelper.parseToJSON(
    __dirname,
    '..',
    'assets',
    'static-memes.json'
  );

  /**
   * @description
   * Bunch of aliases to facilitate the string search
   *
   * @private
   */
  private static readonly aliases: Aliases = {
    Always: 'Always Has Been',
    Bernie: 'Bernie I Am Once Again Asking For Your Support',
    Cmm: 'Change My Mind',
    Changemind: 'Change My Mind'
  };

  /**
   * @description
   *
   * @param input
   * @param memes
   */
  static findClosestMemeName(input: string, { data: { memes } }: IImgFlipGetResponse = this.localMemes): BestMatch {
    const capitalized = CommandHelper.ucFirstLetterOfWords(input);
    const memeNames = memes.map(meme => meme.name);
    const match: BestMatch = findBestMatch(capitalized, [...Object.keys(ImgFlipService.aliases), ...memeNames]);
    const matchInAliases = ImgFlipService.aliases[match?.bestMatch?.target];

    switch (true as any) {
      case !!matchInAliases:
        return {
          ...match,
          bestMatch: {
            ...match.bestMatch,
            target: matchInAliases
          }
        };

      case input === '':
        return {
          ...match,
          bestMatch: {
            ...match.bestMatch,
            target: Random.getRandomFrom(memeNames)
          }
        };

      default:
        return match;
    }
  }
}
