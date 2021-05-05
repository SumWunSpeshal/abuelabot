import { Command, CommandMessage, Guard } from '@typeit/discord';
import { NotBotGuard } from '../guards/not-bot.guard';
import { AbuelaCommand } from '../types';

export abstract class GifCommand implements AbuelaCommand {

  @Command('gif')
  @Guard(NotBotGuard)
  async execute(command: CommandMessage) {
    await command.channel.send('https://tenor.com/view/hey-girl-sliding-into-your-dms-like-sliding-into-dms-into-your-dms-like-roller-skate-gif-5454418');
  }
}
