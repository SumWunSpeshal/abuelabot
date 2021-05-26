import { Client, Discord, Once } from '@typeit/discord';
import { AbuelaReady } from '../types';
import { Main } from '../main';

@Discord()
export abstract class ReadyEvent implements AbuelaReady {
  @Once('ready')
  async onReady(): Promise<void> {

  }
}
