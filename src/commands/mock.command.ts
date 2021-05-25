import { Discord, Option, Slash } from '@typeit/discord';
import { AbuelaCommandInfos } from '../types';
import { CommandInteraction } from 'discord.js';

const INFOS: AbuelaCommandInfos = {
  commandName: 'mock',
  description: `Mockify your own message!`,
  usage: '`!mock {sentence}`',
  aliases: []
};

@Discord()
export abstract class MockCommand {
  @Slash(INFOS.commandName)
  async execute(
    @Option('text', { description: INFOS.description }) text: string,
    interaction: CommandInteraction
  ) {
    const ret = text
      .split('')
      .map((item, index) => (index % 2 ? item.toUpperCase() : item.toLowerCase()))
      .join('');
    await interaction.reply(ret);
  }
}
