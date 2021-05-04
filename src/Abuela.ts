import {
  Discord,
  CommandMessage,
  CommandNotFound,
  On,
  ArgsOf,
  Once
} from '@typeit/discord';
import SETUP_CONFIG from './config';
import * as Path from 'path';
import { Client } from 'discord.js';

@Discord(SETUP_CONFIG.prefix, {
  import: [
    Path.join(__dirname, 'commands', '*.ts'),
    Path.join(__dirname, 'events', '*.ts')
  ]
})
export abstract class Abuela {
  @Once('ready')
  ready(client: Client) {
    console.log('Connecting...');
  }

  @CommandNotFound()
  async notFound(command: CommandMessage) {
    await command.reply('Command not found!');
  }

  @On('messageReactionAdd')
  async messageReactionAdd(
    [message]: ArgsOf<'messageReactionAdd'>,
    client: Client
  ) {}

  @On('messageReactionRemove')
  async messageReaction(
    [message]: ArgsOf<'messageReactionRemove'>,
    client: Client
  ) {}
}
