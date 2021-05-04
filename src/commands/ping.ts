import { Command, CommandMessage, Guard, Rule, Rules } from '@typeit/discord';
import { NotBot } from '../guards/not-bot';
import { AbuelaCommand } from '../types';

export abstract class Ping implements AbuelaCommand {

  @Command()
  @Rules(Rule('ping'))
  @Rules(Rule('test'))
  @Guard(NotBot)
  async execute(command: CommandMessage) {
    await command.channel.send('pong');
  }
}
