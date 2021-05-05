import { Command, CommandMessage, Guard } from '@typeit/discord';
import { NotBotGuard } from '../guards/not-bot.guard';
import { AbuelaCommand } from '../types';

export abstract class HelloWorldCommand implements AbuelaCommand {

  @Command('hello')
  @Guard(NotBotGuard)
  async execute(command: CommandMessage) {
    await command.channel.send('... world');
  }
}
