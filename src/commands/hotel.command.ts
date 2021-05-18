import { Command, CommandMessage, Guard, Infos } from '@typeit/discord';
import { NotBotGuard } from '../guards/not-bot.guard';
import { AbuelaCommandInfos } from '../types';
import { NotHelpGuard } from '../guards/not-help.guard';
import { LETTER_EMOJI } from '../utils/statics';

const INFOS: AbuelaCommandInfos = {
  commandName: 'hotel',
  description: `...`,
  usage: '`!hotel`',
  aliases: []
};

export abstract class HotelCommand {
  @Command(INFOS.commandName)
  @Infos(INFOS)
  @Guard(NotHelpGuard, NotBotGuard)
  async execute(command: CommandMessage) {
    const trivago = [
      LETTER_EMOJI.t,
      LETTER_EMOJI.r,
      LETTER_EMOJI.i,
      LETTER_EMOJI.v,
      LETTER_EMOJI.a,
      LETTER_EMOJI.g,
      LETTER_EMOJI.o
    ];

    for (const letter of trivago) {
      await command.react(letter);
    }
  }
}
