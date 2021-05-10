import { Command, CommandMessage, Guard, Infos } from '@typeit/discord';
import { NotBotGuard } from '../guards/not-bot.guard';
import { AbuelaCommand, AbuelaCommandInfos } from '../types';
import { Aliases } from '../decorators/aliases';
import { Random } from '../utils/random';
import { NotHelpGuard } from '../guards/not-help.guard';

export abstract class ComplimentBotCommand implements AbuelaCommand {
  private static readonly infos: AbuelaCommandInfos = {
    description: 'TODO',
    usage: 'TODO with `code`',
    aliases: ['bestbot', 'gj', 'love', 'iloveu', 'iloveyou']
  };

  private static readonly botResponses = [
    'Thank you, I love you too!',
    `I know I'm awesome.`,
    'Aww, thank you!',
    'Yeah! High five!',
    `We're killing it!`,
    'ggwp',
    'hdgdl, brudi'
  ];

  @Command('goodbot')
  @Infos(ComplimentBotCommand.infos)
  @Guard(NotHelpGuard, NotBotGuard)
  @Aliases(ComplimentBotCommand.infos.aliases!)
  async execute(command: CommandMessage) {
    await command.reply(Random.getRandomFrom(ComplimentBotCommand.botResponses));
  }
}
