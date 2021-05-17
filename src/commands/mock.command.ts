import { Client, Command, CommandMessage, Guard, Infos } from '@typeit/discord';
import { NotBotGuard } from '../guards/not-bot.guard';
import { AbuelaCommandInfos } from '../types';
import { NotHelpGuard } from '../guards/not-help.guard';
import { GetAllUserArgs } from '../decorators/get-all-user-args';

const INFOS: AbuelaCommandInfos = {
  commandName: 'mock',
  description: `Make fun of somebody by mockifying your own message!`,
  usage: '`!mock`',
  aliases: []
};

export abstract class MockCommand {

  @Command(INFOS.commandName)
  @Infos(INFOS)
  @Guard(NotHelpGuard, NotBotGuard)
  @GetAllUserArgs()
  async execute(command: CommandMessage, client: Client, userInput: string) {
    const ret = userInput.split('').map((item, index) => (index % 2 ? item.toUpperCase() : item.toLowerCase())).join('');
    await command.channel.send(ret);
  }
}
