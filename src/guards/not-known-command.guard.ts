import { CommandInfos, CommandMessage, GuardFunction } from '@typeit/discord';
import { Client } from '@typeit/discord';
import { CommandHelper } from '../utils/command-helper';

/**
 * @description
 * FIXME This Guard doesn't account for aliases :/ Discord.ts fucks up the Message param and we don't have access
 * FIXME to the `infos` property unfortunately. Maybe find a way to fix this?
 *
 * @param message
 * @param client
 * @param next
 * @constructor
 */
export const NotKnownCommandGuard: GuardFunction<'message'> = async (
  [message],
  client,
  next
) => {
  if (CommandHelper.getCommandName(message as CommandMessage)) {
    await next();
  }
};
