import { Command, CommandMessage, Guard, Infos } from '@typeit/discord';
import { NotBotGuard } from '../guards/not-bot.guard';
import { AbuelaCommand, AbuelaCommandInfos } from '../types';
import { Aliases } from '../decorators/aliases';
import { Random } from '../utils/random';
import { NotHelpGuard } from '../guards/not-help.guard';

const INFOS: AbuelaCommandInfos = {
  commandName: 'goodbot',
  description: 'Tell me how much you love me! :heart:',
  usage: '`!goodbot`',
  aliases: ['bestbot', 'gj', 'love', 'iloveu', 'iloveyou']
};

export abstract class ComplimentBotCommand implements AbuelaCommand {
  private static readonly botResponses = [
    'Thank you, I love you too!',
    `I know I'm awesome.`,
    'Aww, thank you!',
    'Yeah! High five!',
    `We're killing it!`,
    'ggwp',
    'hdgdl, brudi'
  ];

  @Command(INFOS.commandName)
  @Infos(INFOS)
  @Guard(NotHelpGuard, NotBotGuard)
  @Aliases(INFOS.aliases)
  async execute(command: CommandMessage) {
    await command.reply(Random.getRandomFrom(ComplimentBotCommand.botResponses));
  }
}
