import { Command, CommandMessage, Guard, Infos } from '@typeit/discord';
import { NotBotGuard } from '../guards/not-bot.guard';
import { AbuelaCommand, AbuelaCommandInfos } from '../types';
import { NotHelpGuard } from '../guards/not-help.guard';

const INFOS: AbuelaCommandInfos = {
  commandName: 'ping',
  description: `The "Hello World" of all commands. Just make me respond with "pong". Useful to see whether I'm alive or not.`,
  usage: '`!ping`',
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
