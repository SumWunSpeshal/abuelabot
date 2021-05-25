import { Discord, Once } from '@typeit/discord';
import { Main } from '../main';
import { Interaction } from 'discord.js';

// @Discord()
export abstract class ReadyEvent {
  // @Once('interaction')
  async onReady(interaction: Interaction): Promise<void> {
    await Main.client.executeSlash(interaction);
  }
}
