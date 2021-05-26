import { AbuelaCommand, AbuelaCommandInfos } from '../types';
import { Random } from '../utils/random';
import { Description, Discord, Slash } from '@typeit/discord';
import { CommandInteraction } from 'discord.js';

const INFOS: AbuelaCommandInfos = {
  commandName: 'hello',
  description: 'Say hello to me :slight_smile:',
};

@Discord()
export abstract class HelloCommand implements AbuelaCommand {
  private readonly emojis = ['👋', '🖖', '👊', '✌️'];

  @Slash(INFOS.commandName)
  @Description(INFOS.description)
  async execute(interaction: CommandInteraction) {
    await interaction.reply(Random.getRandomFrom(this.emojis));
  }
}
