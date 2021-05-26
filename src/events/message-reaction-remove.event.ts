import { ArgsOf, Discord, On } from '@typeit/discord';
import { AbuelaEvent } from '../types';
import { Client } from '@typeit/discord';

@Discord()
export abstract class MessageReactionRemoveEvent implements AbuelaEvent {
  @On('messageReactionRemove')
  async on([message]: ArgsOf<'messageReactionRemove'>, client: Client): Promise<void> {}
}
