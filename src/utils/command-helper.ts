import { Client, CommandInfos, CommandMessage } from '@typeit/discord';

type DelimiterArr = Array<' ' | '-'>;

export abstract class CommandHelper {
  static stripCommandKeyWord({ commandContent }: CommandMessage): string {
    const [_, ...rest] = commandContent ? commandContent.split(' ') : [];
    return rest.join(' ');
  }

  static safeObjectKeyAccess(obj: any): any | string {
    return obj ?? 'Internal error. There is probably a problem with one of the APIs in use.';
  }

  static ucFirstLetterOfWords(input: string): string {
    const delimiters: DelimiterArr = [' ', '-'];
    let ret: string = input;

    delimiters.forEach(delimiter => {
      ret = ret
        .split(delimiter)
        .map(item => this.ucFirstLetter(item))
        .join(delimiter);
    });

    return ret;
  }

  static ucFirstLetter(input: string): string {
    const [firstLetter, ...rest] = input;
    return (firstLetter || '').toUpperCase() + (rest || []).join('');
  }

  static getCommandName({ commandContent }: CommandMessage): CommandInfos | undefined {
    const commands: CommandInfos[] = Client.getCommands();

    return commands.find(({ commandName, infos }) => {
      return [commandName, ...(infos.aliases || [])].find(item => {
        return commandContent?.toLowerCase().includes(item);
      });
    });
  }

  static containsDescriptionFlag(userInput: string): boolean {
    return !!userInput.split(' ').find(snippet => snippet === process.env.EXTENDED_DESCRIPTION_FLAG);
  }

  /**
   * @description
   * Remove all template args like {:slug :number}
   *
   * @param input
   */
  static stripArgs(input: string): string {
    return input
      .split(' ')
      .filter(item => !item.includes(':'))
      .join(' ');
  }
}
