import { Command, CommandMessage, Guard, Infos } from '@typeit/discord';
import { NotBotGuard } from '../guards/not-bot.guard';
import { AbuelaCommand } from '../types';
import { Random } from '../utils/random';
import { NotHelpGuard } from '../guards/not-help.guard';
import { code } from '../utils/tagged-templates';

export abstract class HelloCommand implements AbuelaCommand {
  private readonly emojis = ['👋', '🖖', '👊', '✌️'];

  @Command('hello')
  @Infos({ description: 'TODO', usage: 'TODO with `code`' })
  @Guard(NotHelpGuard, NotBotGuard)
  async execute(command: CommandMessage) {
    await command.react(Random.getRandomFrom(this.emojis));
  }
}
