import { Command, CommandMessage, Guard } from '@typeit/discord';
import { NotBot } from '../guards/not-bot';
import { AbuelaCommand } from '../types';

export abstract class Angry implements AbuelaCommand {

  @Command('angry')
  @Guard(NotBot)
  async execute(command: CommandMessage) {
    await command.channel.send('https://tenor.com/view/grumpy-mad-angry-cat-gif-14232626');
  }
}
