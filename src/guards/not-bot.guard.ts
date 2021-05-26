import { ArgsOf, GuardFunction } from '@typeit/discord';
import { CommandInteraction, Message } from 'discord.js';

export const NotBotGuard: GuardFunction<ArgsOf<'message'> | CommandInteraction> = async (
  messageOrInteraction,
  client,
  next
) => {
  if (messageOrInteraction instanceof CommandInteraction) {
    if (messageOrInteraction?.user?.bot) {
      return;
    }
  } else if (messageOrInteraction[0] instanceof Message) {
    const [msg] = messageOrInteraction;
    if (client.user?.id === msg.author.id) {
      return;
    }
  }

  await next();
};

