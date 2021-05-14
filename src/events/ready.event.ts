import { Client, Once } from '@typeit/discord';
import { AbuelaReady } from '../types';

export abstract class ReadyEvent implements AbuelaReady {
  @Once('ready')
  async onReady(client: Client): Promise<void> {
    console.log('Connecting...');
  }
}
