import { CommandMessage } from '@typeit/discord';

type DelimiterArr = Array<' ' | '-'>;

export abstract class CommandHelper {
  static stripCommandKeyWord({ commandContent }: CommandMessage): string {
    const [_, ...rest] = commandContent ? commandContent.split(' ') : [];
    return rest ? rest.join(' ') : '';
  }

  static safeObjectKeyAccess(obj: any): any | string {
    return obj ?? 'Internal error. There is probably a problem with one of the APIs in use.';
  }

  static ucFirstLetterOfWords(input: string): string {
    const delimiters: DelimiterArr = [' ', '-'];
    let ret: string = input;

    // FIXME test this. I feel like this doesn't work yet.
    delimiters.forEach(delimiter => {
      if (ret.includes(delimiter)) {
        ret = input.split(delimiter).map(item => this.ucFirstLetter(item)).join(delimiter);
      }
    })

    return ret;
  }

  static ucFirstLetter(input: string): string {
    return input[0].toUpperCase() + input.substring(1);
  }
}
