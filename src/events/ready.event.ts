import { Client, Discord, Once } from '@typeit/discord';
import { AbuelaReady } from '../types';
import { Main } from '../main';

@Discord()
export abstract class ReadyEvent implements AbuelaReady {
  @Once('ready')
  async onReady(client: Client): Promise<void> {
    console.log(`### Clearing all slashes ... ###`)
    await Main.client.clearSlashes();

    for await (const guild of Main.client.guilds.cache) {
      await Main.client.clearSlashes(guild[0]);
    }

    console.log(`### Starting slash initialisation ... ###`)
    await Main.client.initSlashes();
    console.log(`### ${Main.client.user?.username} ready! ... ###`);
  }
}
