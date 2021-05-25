import { AbuelaCommand, AbuelaCommandInfos } from '../types';

const INFOS: AbuelaCommandInfos = {
  commandName: 'angry',
  description: 'TODO',
  usage: 'TODO with `code`',
  aliases: []
};

export abstract class AngryCommand implements AbuelaCommand {
  // @Command(INFOS.commandName)
  // @Infos(INFOS)
  // @Guard(NotHelpGuard, NotBotGuard)
  async execute(command: any) {
    await command.channel.send('https://tenor.com/view/grumpy-mad-angry-cat-gif-14232626');
  }
}
