import { ArgsOf, On } from '@typeit/discord';
import { AbuelaEvent } from '../types';
import { Client } from '@typeit/discord';

export abstract class MessageReactionEvent implements AbuelaEvent {
  @On('messageReactionAdd')
  async on([message]: ArgsOf<'messageReactionAdd'>, client: Client): Promise<void> {}
}
