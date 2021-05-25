import { AbuelaCommandInfos } from '../types';
import { ConnectionService } from '../services/connection.service';
import { Discord, Slash } from '@typeit/discord';
import { CommandInteraction } from 'discord.js';

const INFOS: AbuelaCommandInfos = {
  commandName: 'join',
  description: `The "join" command lets AbuelaBot join your voice channel.`,
  usage: '`!join`',
  aliases: ['come', 'here']
};

@Discord()
export class JoinCommand {

  @Slash(INFOS.commandName)
  async execute(interaction: CommandInteraction) {
    await Promise.all([
      ConnectionService.join(interaction),
      interaction.reply('`voice channel joined!`')
    ]);
  }
}
