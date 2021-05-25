import { ArgsOf, On } from '@typeit/discord';
import { AbuelaEvent } from '../types';
import { Client } from '@typeit/discord';

export abstract class MessageReactionRemoveEvent implements AbuelaEvent {
  // @On('messageReactionRemove')
  async on([message]: ArgsOf<'messageReactionRemove'>, client: Client): Promise<void> {}
}
