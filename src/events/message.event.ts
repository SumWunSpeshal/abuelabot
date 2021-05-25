import { ArgsOf, Client, Discord, On } from '@typeit/discord';
import { AbuelaEvent } from '../types';

@Discord()
export abstract class MessageEvent implements AbuelaEvent {

  @On('message')
  async on([message]: ArgsOf<'message'>, client: Client): Promise<void> {
    console.log(message);
    console.log('message sent!');
  }
}
