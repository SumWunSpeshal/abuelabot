import { GuardFunction } from '@typeit/discord';
import config from '../config';

export const NotCommandGuard: GuardFunction<'message'> = async (
  [message],
  client,
  next
) => {
  if (message.content.charAt(0) === config.prefix) {
    await next();
  }
};
