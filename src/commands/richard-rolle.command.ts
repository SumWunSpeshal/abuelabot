import { AbuelaCommandInfos } from '../types';
import { Description, Discord, Slash } from '@typeit/discord';
import { CommandInteraction } from 'discord.js';

const INFOS: AbuelaCommandInfos = {
  commandName: 'richardrolle',
  description: 'This command is very useful.'
};

@Discord()
export abstract class RichardRolleCommand {

  @Slash(INFOS.commandName)
  @Description(INFOS.description)
  async execute(interaction: CommandInteraction) {
    await interaction.reply('https://tenor.com/view/rick-ashtley-never-gonna-give-up-rick-roll-gif-4819894');
  }
}
