import { Command, CommandMessage, Guard, Infos, InfosType } from '@typeit/discord';
import { NotBotGuard } from '../guards/not-bot.guard';
import { AbuelaCommand, AbuelaCommandInfos } from '../types';
import { NotHelpGuard } from '../guards/not-help.guard';

const INFOS: AbuelaCommandInfos = {
  commandName: 'angry',
  description: 'TODO',
  usage: 'TODO with `code`',
  aliases: []
};

export abstract class AngryCommand implements AbuelaCommand {
  @Command(INFOS.commandName)
  @Infos(INFOS)
  @Guard(NotHelpGuard, NotBotGuard)
  async execute(command: CommandMessage) {
    await command.channel.send('https://tenor.com/view/grumpy-mad-angry-cat-gif-14232626');
  }
}
