import { Client, Description, Discord, Slash } from '@typeit/discord';
import { CommandInteraction } from 'discord.js';
import { AbuelaCommand, AbuelaCommandInfos } from '../types';
import { CommandHelper } from '../utils/command-helper';
import { readFileSync } from 'fs';
import Path from 'path';

const INFOS: AbuelaCommandInfos = {
  commandName: 'hotel',
  description: `...`
};

@Discord()
export abstract class HotelCommand implements AbuelaCommand {
  private readonly letters = JSON.parse(
    readFileSync(Path.join(__dirname, '..', 'assets', 'letter-emojis.json')).toString()
  );

  @Slash(INFOS.commandName)
  @Description(INFOS.description)
  async execute(interaction: CommandInteraction, client: Client) {
    const trivago = [
      this.letters.t,
      this.letters.r,
      this.letters.i,
      this.letters.v,
      this.letters.a,
      this.letters.g,
      this.letters.o
    ];

    await interaction.reply('Hotel?');
    const lastInteraction = await CommandHelper.getLastInteractionOfTextChannel(interaction.channelID!);

    for await (const letter of trivago) {
      await lastInteraction!.react(letter);
    }
  }
}
