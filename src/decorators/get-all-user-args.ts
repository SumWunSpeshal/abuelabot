import { CommandMessage } from '@typeit/discord';
import { CommandHelper } from '../utils/command-helper';
import { Client } from '@typeit/discord';

type Delimiter = '|' | '&';

export function GetAllUserArgs(delimiter?: Delimiter) {
  return function (target: any, key: string, descriptor: PropertyDescriptor) {
    const targetMethod = descriptor.value;

    descriptor.value = function (command: CommandMessage, client: Client) {
      const userArgs = CommandHelper.stripCommandKeyWord(command);
      const userArgsSplit: string[] | undefined =
        delimiter && userArgs.split(delimiter).map(fragment => fragment.trim());

      return targetMethod.call(
        this,
        command,
        client,
        userArgsSplit || userArgs
      );
    };

    return descriptor;
  };
}
