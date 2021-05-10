import { Command, CommandMessage, Guard, Infos } from '@typeit/discord';
import { NotBotGuard } from '../guards/not-bot.guard';
import { AbuelaCommand, AbuelaCommandInfos } from '../types';
import { Random } from '../utils/random';
import { NotHelpGuard } from '../guards/not-help.guard';

export abstract class HelloCommand implements AbuelaCommand {
  private static readonly emojis = ['👋', '🖖', '👊', '✌️'];

  private static readonly infos: AbuelaCommandInfos = {
    description: 'TODO',
    usage: 'TODO with `code`'
  };

  @Command('hello')
  @Infos(HelloCommand.infos)
  @Guard(NotHelpGuard, NotBotGuard)
  async execute(command: CommandMessage) {
    await command.react(Random.getRandomFrom(HelloCommand.emojis));
  }
}
