import { Discord, On } from '@typeit/discord';
import { Interaction } from 'discord.js';

@Discord()
export abstract class ReadyEvent {
  @On('interaction')
  async onInteraction(interaction: Interaction): Promise<void> {
  }
}
