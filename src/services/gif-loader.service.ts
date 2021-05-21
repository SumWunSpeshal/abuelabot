import { CommandMessage } from '@typeit/discord';
import { setInterval } from 'timers';
import { Message } from 'discord.js';
import { sleep } from '../utils/sleep';
import Path from 'path';

/**
 * @description
 * TODO Not in use atm
 */
export abstract class GifLoaderService {
  private static message: Message;

  static async start(command: CommandMessage) {
    this.message = await command.channel.send({ files: [Path.join(__dirname, '..', 'assets', 'img', `loader.gif`)] });
  }

  static async done() {
    await this.message.delete();
  }
}
