import { Command, CommandMessage, Guard, Infos } from '@typeit/discord';
import { NotBotGuard } from '../guards/not-bot.guard';
import { AbuelaCommand, AbuelaCommandInfos } from '../types';
import { NotHelpGuard } from '../guards/not-help.guard';

const INFOS: AbuelaCommandInfos = {
  commandName: 'ping',
  description: 'TODO',
  usage: 'TODO with `code`',
  aliases: []
};

export abstract class PingCommand implements AbuelaCommand {

  @Command(INFOS.commandName)
  @Infos(INFOS)
  @Guard(NotHelpGuard, NotBotGuard)
  async execute(command: CommandMessage) {
    await command.channel.send('pong');
  }
}
