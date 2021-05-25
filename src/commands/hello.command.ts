import { AbuelaCommand, AbuelaCommandInfos } from '../types';
import { Random } from '../utils/random';

const INFOS: AbuelaCommandInfos = {
  commandName: 'hello',
  description: 'Say hello to me :slight_smile:',
  usage: '`!hello`',
  aliases: ['hi', 'salut', 'bonjour', 'buongiorno', 'priviet', 'hey']
};

export abstract class HelloCommand implements AbuelaCommand {
  private readonly emojis = ['👋', '🖖', '👊', '✌️'];

  // @Command(INFOS.commandName)
  // @Infos(INFOS)
  // @Aliases(INFOS.aliases)
  // @Guard(NotHelpGuard, NotBotGuard)
  async execute(command: any) {
    await command.react(Random.getRandomFrom(this.emojis));
  }
}
