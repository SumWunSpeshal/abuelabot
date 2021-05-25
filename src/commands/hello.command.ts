import { AbuelaCommand, AbuelaCommandInfos } from '../types';
import { Random } from '../utils/random';
import { Discord, Slash } from '@typeit/discord';
import { CommandInteraction } from 'discord.js';

const INFOS: AbuelaCommandInfos = {
  commandName: 'hello',
  description: 'Say hello to me :slight_smile:',
  usage: '`!hello`',
  aliases: ['hi', 'salut', 'bonjour', 'buongiorno', 'priviet', 'hey']
};

@Discord()
export abstract class HelloCommand implements AbuelaCommand {
  private readonly emojis = ['👋', '🖖', '👊', '✌️'];

  @Slash(INFOS.commandName)
  async execute(interaction: CommandInteraction) {
    await interaction.reply(Random.getRandomFrom(this.emojis));
  }
}
