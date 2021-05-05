import { Command, CommandMessage, Guard } from '@typeit/discord';
import { NotBotGuard } from '../guards/not-bot.guard';
import { AbuelaCommand } from '../types';

export abstract class PingCommand implements AbuelaCommand {

  @Command('ping')
  @Guard(NotBotGuard)
  async execute(command: CommandMessage) {
    await command.channel.send('pong');
  }
}
