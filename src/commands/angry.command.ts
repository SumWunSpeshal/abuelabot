import { Command, CommandMessage, Guard } from '@typeit/discord';
import { NotBotGuard } from '../guards/not-bot.guard';
import { AbuelaCommand } from '../types';

export abstract class AngryCommand implements AbuelaCommand {

  @Command('angry')
  @Guard(NotBotGuard)
  async execute(command: CommandMessage) {
    await command.channel.send('https://tenor.com/view/grumpy-mad-angry-cat-gif-14232626');
  }
}
