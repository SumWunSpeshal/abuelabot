import { Command, CommandMessage, Guard } from '@typeit/discord';
import { NotBot } from '../guards/not-bot';
import { AbuelaCommand } from '../types';

export abstract class Ping implements AbuelaCommand {

  @Command('ping')
  @Guard(NotBot)
  async execute(command: CommandMessage) {
    await command.channel.send('pong');
  }
}
