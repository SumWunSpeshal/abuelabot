import { Command, CommandMessage, Guard, Rule, Rules } from '@typeit/discord';
import { NotBot } from '../guards/not-bot';
import { AbuelaCommand } from '../types';
import { Aliases } from '../decorators/aliases';

export abstract class FlipFlop implements AbuelaCommand {

  @Command('flip')
  @Aliases('flop', 'flup')
  @Guard(NotBot)
  async execute(command: CommandMessage) {
    await command.channel.send('Testing Aliases');
  }
}
