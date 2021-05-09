import { Command, CommandMessage, Guard, Infos } from '@typeit/discord';
import { NotBotGuard } from '../guards/not-bot.guard';
import { AbuelaCommand } from '../types';
import { Aliases } from '../decorators/aliases';
import { Random } from '../utils/random';
import { NotHelpGuard } from '../guards/not-help.guard';
import { code } from '../utils/tagged-templates';

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
  @Infos({ description: 'TODO', usage: `TODO with ${code`code`}` })
  @Guard(NotHelpGuard, NotBotGuard)
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
  async execute(command: CommandMessage) {
    await command.reply(Random.getRandomFrom(this.botResponses));
  }
}
