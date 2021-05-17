import { Client, Command, CommandMessage, Guard, Infos } from '@typeit/discord';
import { NotBotGuard } from '../guards/not-bot.guard';
import { AbuelaCommand, AbuelaCommandInfos } from '../types';
import { NotHelpGuard } from '../guards/not-help.guard';
import { GetAllUserArgs } from '../decorators/get-all-user-args';

const INFOS: AbuelaCommandInfos = {
  commandName: 'aesthetic',
  description: `Let your message look A E S T H E T I C!`,
  usage: '`!aesthetic {sentence}`',
  aliases: []
};

export abstract class AestheticCommand implements AbuelaCommand {

  @Command(INFOS.commandName)
  @Infos(INFOS)
  @Guard(NotHelpGuard, NotBotGuard)
  @GetAllUserArgs()
  async execute(command: CommandMessage, client: Client, userInput: string) {
    const ret = userInput.split('').map(item => item.toUpperCase()).join(' ');
    await command.channel.send(ret);
  }
}
