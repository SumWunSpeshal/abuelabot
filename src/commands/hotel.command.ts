import { Command, CommandMessage, Guard, Infos } from '@typeit/discord';
import { NotBotGuard } from '../guards/not-bot.guard';
import { AbuelaCommand, AbuelaCommandInfos } from '../types';
import { NotHelpGuard } from '../guards/not-help.guard';
import { readFileSync } from 'fs';
import Path from 'path';

const INFOS: AbuelaCommandInfos = {
  commandName: 'hotel',
  description: `...`,
  usage: '`!hotel`',
  aliases: []
};

export abstract class HotelCommand implements AbuelaCommand {
  private readonly letters = JSON.parse(
    readFileSync(Path.join(__dirname, '..', 'assets', 'letter-emojis.json')).toString()
  );

  @Command(INFOS.commandName)
  @Infos(INFOS)
  @Guard(NotHelpGuard, NotBotGuard)
  async execute(command: CommandMessage) {
    const trivago = [
      this.letters.t,
      this.letters.r,
      this.letters.i,
      this.letters.v,
      this.letters.a,
      this.letters.g,
      this.letters.o
    ];

    for (const letter of trivago) {
      await command.react(letter);
    }
  }
}
