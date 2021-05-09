import { CommandInfos, CommandMessage, GuardFunction } from '@typeit/discord';
import { Client } from '@typeit/discord';
import { CommandHelper } from '../utils/command-helper';

export const NotKnownCommandGuard: GuardFunction<'message'> = async (
  [message],
  client,
  next
) => {
  if (CommandHelper.getCommandName(message as CommandMessage)) {
    await next();
  }
};
