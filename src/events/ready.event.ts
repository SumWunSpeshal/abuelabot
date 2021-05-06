import { Once } from '@typeit/discord';
import { AbuelaReady } from '../types';
import { Client } from 'discord.js';

export abstract class ReadyEvent implements AbuelaReady {
  @Once('ready')
  async onReady(client: Client): Promise<void> {
    console.log('Connecting...');
  }
}
