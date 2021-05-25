import { setInterval } from 'timers';
import { Message } from 'discord.js';
import { sleep } from '../utils/sleep';

export abstract class LoaderService {
  private static interval: NodeJS.Timeout | null = null;
  private static message: Message;

  static async start(command: any) {
    this.message = await command.channel.send(`:clock1: \`Loading...\``);
    let counter = 2;

    this.interval = setInterval(async () => {
      await this.message.edit(`:clock${counter}: \`Loading${'.'.repeat((counter % 3) + 1)}\``);
      counter = counter >= 12 || counter <= 0 ? 1 : counter + 1;
    }, 1000);

    await sleep(20000);
    if (this.interval && !this.message.deleted) {
      console.log('Timeout!');
      clearInterval(this.interval);
      await this.message.edit(`:clock12: \`Loading... (Timeout)\``);
    }
  }

  static async done() {
    if (this.interval && this.message) {
      clearInterval(this.interval);
      this.interval = null;
      await this.message.delete();
    }
  }
}
