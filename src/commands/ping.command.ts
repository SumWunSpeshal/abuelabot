import { Client, Discord, Slash } from '@typeit/discord';
import { CommandInteraction } from 'discord.js';
import { AbuelaCommand, AbuelaCommandInfos } from '../types';

const INFOS: AbuelaCommandInfos = {
  commandName: 'ping',
  description: `The "Hello World" of all commands. Just make me respond with "pong". Useful to see whether I'm alive or not.`,
  usage: '`!ping`',
  aliases: ['test', 'echo']
};

@Discord()
export abstract class PingCommand implements AbuelaCommand {

  @Slash(INFOS.commandName)
  async execute(interaction: CommandInteraction, client: Client) {
    await interaction.reply('Pong!');
  }
}
