import { Once } from '@typeit/discord';
import { AbuelaReady } from '../types';
import { Client } from '@typeit/discord';

export abstract class ReadyEvent implements AbuelaReady {
  @Once('ready')
  async onReady(client: Client): Promise<void> {
    console.log('Connecting...');
  }
}
