import { ArgsOf, Guard, On } from '@typeit/discord';
import { AbuelaEvent } from '../types';
import { Client } from '@typeit/discord';
import { NotBotGuard } from '../guards/not-bot.guard';

export abstract class MessageEvent implements AbuelaEvent {
  @On('message')
  @Guard(NotBotGuard)
  async on(message: ArgsOf<'message'>, client: Client): Promise<void> {
    console.log('message sent!');
  }
}
