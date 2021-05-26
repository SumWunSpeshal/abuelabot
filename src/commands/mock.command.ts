import { Description, Discord, Option, Slash } from '@typeit/discord';
import { AbuelaCommandInfos } from '../types';
import { CommandInteraction } from 'discord.js';

const INFOS: AbuelaCommandInfos = {
  commandName: 'mock',
  description: `Mockify your own message!`,
};

@Discord()
export abstract class MockCommand {
  @Slash(INFOS.commandName)
  @Description(INFOS.description)
  async execute(
    @Option('text', { description: 'Type your text', required: true })
    text: string,
    interaction: CommandInteraction
  ) {
    const ret = text
      .split('')
      .map((item, index) => (index % 2 ? item.toUpperCase() : item.toLowerCase()))
      .join('');
    await interaction.reply(ret);
  }
}
