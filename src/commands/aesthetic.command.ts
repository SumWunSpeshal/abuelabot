import { Client, Command, CommandMessage, Guard, Infos } from '@typeit/discord';
import { NotBotGuard } from '../guards/not-bot.guard';
import { AbuelaCommand, AbuelaCommandInfos } from '../types';
import { NotHelpGuard } from '../guards/not-help.guard';
import { GetAllUserArgs } from '../decorators/get-all-user-args';
import { Aliases } from '../decorators/aliases';

const INFOS: AbuelaCommandInfos = {
  commandName: 'aesthetic',
  description: `Let your message look A E S T H E T I C!`,
  usage: '`!aesthetic {sentence}`',
  aliases: ['aes', 'chic', 'chique']
};

export abstract class AestheticCommand implements AbuelaCommand {

  @Command(INFOS.commandName)
  @Infos(INFOS)
  @Guard(NotHelpGuard, NotBotGuard)
  @Aliases(INFOS.aliases)
  @GetAllUserArgs()
  async execute(command: CommandMessage, client: Client, userInput: string) {
    const ret = userInput.split('').map(item => item.toUpperCase()).join(' ');
    await command.channel.send(`**_${ret}_**`);
  }
}
