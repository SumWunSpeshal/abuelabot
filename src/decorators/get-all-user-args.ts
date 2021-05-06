import { CommandMessage } from '@typeit/discord';
import { CommandHelper } from '../utils/command-helper';
import { Client } from '@typeit/discord';

export function GetAllUserArgs() {
  return function (target: any, key: string, descriptor: PropertyDescriptor) {
    const targetMethod = descriptor.value;

    descriptor.value = function(command: CommandMessage, client: Client) {
      const userArgs = CommandHelper.stripCommandKeyWord(command);
      return targetMethod.call(this, command, client, userArgs);
    }

    return descriptor;
  };
}
