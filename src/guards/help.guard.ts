import { CommandMessage, GuardFunction } from '@typeit/discord';
import { CommandHelper } from '../utils/command-helper';

export const HelpGuard: GuardFunction<'message'> = async (
  [message],
  client,
  next
) => {
  const { commandContent } = message as CommandMessage;
  const userWantsDetails = CommandHelper.containsDescriptionFlag(commandContent);

  if (userWantsDetails) {
    await next();
  }
};
