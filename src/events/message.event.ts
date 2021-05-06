import { ArgsOf, On } from '@typeit/discord';
import { AbuelaEvent } from '../types';
import { Client } from '@typeit/discord';

export abstract class MessageEvent implements AbuelaEvent {
  @On('message')
  async on(message: ArgsOf<'message'>, client: Client): Promise<void> {}
}
