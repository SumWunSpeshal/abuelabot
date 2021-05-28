import {
  ArgsOf,
  Client,
  Description,
  Discord,
  DiscordEvents,
  DSlash,
  MetadataStorage,
  On,
  Slash
} from '@typeit/discord';
import { AbuelaCommand, AbuelaCommandInfos } from '../types';
import { CommandHelper } from '../utils/command-helper';
import { CustomEvents } from '../statics';
import { CommandInteraction, MessageEmbed } from 'discord.js';
import { Main } from '../main';
import ReadOnlyDict = NodeJS.ReadOnlyDict;
import { SpecialChars } from '../utils/special-chars';

const INFOS: AbuelaCommandInfos = {
  commandName: 'help',
  description: 'Explore all available Abuela commands!'
};

@Discord()
export abstract class HelpCommand {
  private readonly commands = MetadataStorage.instance.slashes;

  private readonly headline: string = 'Available Commands';

  private readonly fallbacks = {
    description: 'No description available...',
    usage: 'No usage available...',
    aliases: 'None'
  };

  @Slash(INFOS.commandName)
  @Description(INFOS.description)
  async execute(interaction: CommandInteraction) {
    await interaction.reply(
      new MessageEmbed({
        title: this.headline,
        description: INFOS.description,
        fields: [
          { name: SpecialChars.SEPARATOR, value: SpecialChars.ZERO_WIDTH_SPACE, inline: false },
          ...this.commands.map(({ name, description }) => {
            return {
              name: name,
              value: description || this.fallbacks.description
            };
          })
        ]
      })
    );
  }
}
