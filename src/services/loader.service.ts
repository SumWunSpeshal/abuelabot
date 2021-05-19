import { CommandMessage } from '@typeit/discord';
import { setInterval } from 'timers';
import { Message } from 'discord.js';
import { sleep } from '../utils/sleep';

export abstract class LoaderService {
  private static interval: NodeJS.Timeout;
  private static message: Message;

  static async start(command: CommandMessage) {
    this.message = await command.channel.send(`:clock1: \`Loading...\``);
    let counter = 2;

    this.interval = setInterval(async () => {
      await this.message.edit(`:clock${counter}: \`Loading${'.'.repeat((counter % 3) + 1)}\``);
      counter = counter >= 12 || counter <= 0 ? 1 : counter + 1;
    }, 1000);

    await sleep(30000);
    console.log('Timeout!');
    clearInterval(this.interval);
    await this.message.edit(`:clock12: \`Loading... (Timeout)\``);
  }

  static async done() {
    clearInterval(this.interval);
    await this.message.delete();
  }
}
