import { AbuelaCommand, AbuelaCommandInfos } from '../types';
import { readFileSync } from 'fs';
import Path from 'path';
import { Discord, Slash } from '@typeit/discord';
import { CommandInteraction } from 'discord.js';

const INFOS: AbuelaCommandInfos = {
  commandName: 'hotel',
  description: `...`,
  usage: '`!hotel`',
  aliases: []
};

@Discord()
export abstract class HotelCommand {
  private readonly letters = JSON.parse(
    readFileSync(Path.join(__dirname, '..', 'assets', 'letter-emojis.json')).toString()
  );

  @Slash(INFOS.commandName)
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

    // for await (const letter of trivago) {
    //   await command.react(letter);
    // }

    await interaction.reply(trivago.join(''));
  }
}
