import { Command, CommandMessage, Guard } from '@typeit/discord';
import { NotBotGuard } from '../guards/not-bot.guard';
import { AbuelaCommand } from '../types';
import { Aliases } from '../decorators/aliases';

export abstract class FlipFlopCommand implements AbuelaCommand {

  @Command('flip :slug :number')
  @Aliases('flop :slug :number', 'flup :slug :number')
  @Guard(NotBotGuard)
  async execute(command: CommandMessage) {
    const { slug, number } = command.args;
    await command.channel.send('Testing Aliases');
  }
}
