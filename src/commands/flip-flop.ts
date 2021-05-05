import { Command, CommandMessage, Guard } from '@typeit/discord';
import { NotBot } from '../guards/not-bot';
import { AbuelaCommand } from '../types';
import { Aliases } from '../decorators/aliases';

export abstract class FlipFlop implements AbuelaCommand {

  @Command('flip :slug :number')
  @Aliases('flop :slug :number', 'flup :slug :number')
  @Guard(NotBot)
  async execute(command: CommandMessage) {
    const { slug, number } = command.args;
    await command.channel.send('Testing Aliases');
  }
}
