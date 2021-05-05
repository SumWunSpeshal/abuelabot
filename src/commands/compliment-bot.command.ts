import { Command, CommandMessage, Guard } from '@typeit/discord';
import { NotBotGuard } from '../guards/not-bot.guard';
import { AbuelaCommand } from '../types';
import { Aliases } from '../decorators/aliases';
import { Random } from '../utils/random';

export abstract class ComplimentBotCommand implements AbuelaCommand {
  private readonly botResponses = [
    'Thank you, I love you too!',
    `I know I'm awesome.`,
    'Aww, thank you!',
    'Yeah! High five!',
    `We're killing it!`,
    'ggwp',
    'hdgdl, brudi'
  ];

  @Command()
  @Aliases(
    'good bot',
    'goodbot',
    'best bot',
    'bestbot',
    'gj',
    'love',
    'iloveu',
    'iloveyou'
  )
  @Guard(NotBotGuard)
  async execute(command: CommandMessage) {
    await command.reply(Random.getRandomFrom(this.botResponses));
  }
}
