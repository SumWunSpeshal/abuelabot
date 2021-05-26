import { ArgsOf, Client, Description, Discord, DiscordEvents, MetadataStorage, On, Slash } from '@typeit/discord';
import { AbuelaCommand, AbuelaCommandInfos } from '../types';
import { CommandHelper } from '../utils/command-helper';
import { CustomEvents } from '../utils/statics';
import { CommandInteraction, MessageEmbed } from 'discord.js';
import { Main } from '../main';

const INFOS: AbuelaCommandInfos = {
  commandName: 'help',
  description: 'Explore all available Abuela commands!',
};

@Discord()
export abstract class HelpCommand {
  private readonly headline = 'Available Commands';

  private readonly fallbacks = {
    description: 'No description available...',
    usage: 'No usage available...',
    aliases: 'None'
  };

  @Slash(INFOS.commandName)
  @Description(INFOS.description)
  async execute(interaction: CommandInteraction) {
    const commands = MetadataStorage.instance.slashes;

    await interaction.reply(new MessageEmbed({
      title: this.headline as string,
      description: INFOS.description,
      fields: commands.map(({ name, description }) => {

        return {
          name: name,
          value: description || this.fallbacks.description
        };
      })
    }));
  }
}
