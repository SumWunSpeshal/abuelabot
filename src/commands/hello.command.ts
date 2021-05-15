import { Command, CommandMessage, Guard, Infos } from '@typeit/discord';
import { NotBotGuard } from '../guards/not-bot.guard';
import { AbuelaCommand, AbuelaCommandInfos } from '../types';
import { Random } from '../utils/random';
import { NotHelpGuard } from '../guards/not-help.guard';
import { Aliases } from '../decorators/aliases';

const CONFIG: AbuelaCommandInfos = {
  commandName: 'hello',
  description: 'Say hello to me :slight_smile:',
  usage: '`!hello`',
  aliases: ['hi', 'salut', 'bonjour', 'buongiorno', 'priviet']
}

export abstract class HelloCommand implements AbuelaCommand {
  private readonly emojis = ['👋', '🖖', '👊', '✌️'];

  @Command(CONFIG.commandName)
  @Infos(CONFIG)
  @Aliases(CONFIG.aliases)
  @Guard(NotHelpGuard, NotBotGuard)
  async execute(command: CommandMessage) {
    await command.react(Random.getRandomFrom(this.emojis));
  }
}
