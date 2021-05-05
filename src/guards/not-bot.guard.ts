import { GuardFunction } from '@typeit/discord';

export const NotBotGuard: GuardFunction<'message'> = async (
  [message],
  client,
  next
) => {
  if (client.user?.id !== message.author.id) {
    await next();
  }
};
