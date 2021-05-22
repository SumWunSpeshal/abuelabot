import { ArgsOf, Client, Guard, On } from '@typeit/discord';
import { AbuelaEvent } from '../types';
import { NotBotGuard } from '../guards/not-bot.guard';

export abstract class MessageEvent implements AbuelaEvent {
  @On('message')
  @Guard(NotBotGuard)
  async on([message]: ArgsOf<'message'>, client: Client): Promise<void> {
    console.log(message.channel.id);
    console.log('message sent!');
  }
}
