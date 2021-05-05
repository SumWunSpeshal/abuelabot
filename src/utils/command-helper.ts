import { CommandMessage } from '@typeit/discord';

export abstract class CommandHelper {
  static stripCommandKeyWord({ commandContent }: CommandMessage): string {
    const [_, ...rest] = commandContent.split(' ');
    return rest.join(' ');
  }

  static safeObjectKeyAccess(obj: any): any | string {
    return obj ?? 'Internal error. There is probably a problem with the API';
  }
}
