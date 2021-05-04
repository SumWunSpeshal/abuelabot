import { Command, CommandMessage, Guard } from '@typeit/discord';
import { NotBot } from '../guards/not-bot';
import { AbuelaCommand } from '../types';

export abstract class Gif implements AbuelaCommand {

  @Command('gif')
  @Guard(NotBot)
  async execute(command: CommandMessage) {
    await command.channel.send('https://tenor.com/view/hey-girl-sliding-into-your-dms-like-sliding-into-dms-into-your-dms-like-roller-skate-gif-5454418');
  }
}
