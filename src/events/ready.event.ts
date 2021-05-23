import { Client, Once } from '@typeit/discord';
import { AbuelaReady } from '../types';
import { Main } from '../main';

export abstract class ReadyEvent implements AbuelaReady {
  @Once('ready')
  async onReady(client: Client): Promise<void> {
    console.log(`### ${Main.client.user?.username} ready! ... ###`);
  }
}
