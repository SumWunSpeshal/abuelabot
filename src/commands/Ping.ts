import { Command, CommandMessage, Guard } from '@typeit/discord';
import { NotBot } from '../guards/Not-bot';
import { AbuelaCommand } from '../Types';

export abstract class Ping implements AbuelaCommand {

  @Command('ping')
  @Guard(NotBot)
  async execute(command: CommandMessage) {
    await command.channel.send('pong');
  }
}
