import { Discord, Once } from '@typeit/discord';
import { AbuelaReady } from '../types';

@Discord()
export abstract class ReadyEvent implements AbuelaReady {
  @Once('ready')
  async onReady(): Promise<void> {}
}
