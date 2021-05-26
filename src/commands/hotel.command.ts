import { AbuelaCommandInfos } from '../types';
import { readFileSync } from 'fs';
import Path from 'path';
import { Description, Discord, Slash } from '@typeit/discord';
import { CommandInteraction } from 'discord.js';

const INFOS: AbuelaCommandInfos = {
  commandName: 'hotel',
  description: `...`
};

@Discord()
export abstract class HotelCommand {
  private readonly letters = JSON.parse(
    readFileSync(Path.join(__dirname, '..', 'assets', 'letter-emojis.json')).toString()
  );

  @Slash(INFOS.commandName)
  @Description(INFOS.description)
  async execute(interaction: CommandInteraction) {
    const trivago = [
      this.letters.t,
      this.letters.r,
      this.letters.i,
      this.letters.v,
      this.letters.a,
      this.letters.g,
      this.letters.o
    ];

    await interaction.reply(trivago.join(' '));
  }
}
