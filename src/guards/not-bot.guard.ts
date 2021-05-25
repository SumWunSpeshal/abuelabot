import { ArgsOf, GuardFunction } from '@typeit/discord';
import { CommandInteraction, Message } from 'discord.js';

export const NotBotGuard: GuardFunction<ArgsOf<'message'> | CommandInteraction> = async (message, client, next) => {
  // const id = message instanceof Message ? message.author.id : message.user.id;

  if (message instanceof Message) {
    if (client.user?.id === message.author.id) {
      return;
    }
  }

  await next();
};

