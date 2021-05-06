import { Command, CommandMessage, Guard } from '@typeit/discord';
import { NotBotGuard } from '../guards/not-bot.guard';
import { AbuelaCommand } from '../types';
import { Random } from '../utils/random';

export abstract class HelloCommand implements AbuelaCommand {
  private readonly emojis = ['👋', '🖖', '👊', '✌️'];

  @Command('hello')
  @Guard(NotBotGuard)
  async execute(command: CommandMessage) {
    await command.react(Random.getRandomFrom(this.emojis));
  }
}
