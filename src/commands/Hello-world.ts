import { Command, CommandMessage, Guard } from '@typeit/discord';
import { NotBot } from '../guards/Not-bot';
import { AbuelaCommand } from '../types';

export abstract class HelloWorld implements AbuelaCommand {

  @Command('hello')
  @Guard(NotBot)
  async execute(command: CommandMessage) {
    await command.channel.send('... world');
  }
}
