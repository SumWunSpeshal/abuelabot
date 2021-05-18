import { ArgsOf, Guard, On } from '@typeit/discord';
import { AbuelaEvent } from '../types';
import { NotBotGuard } from '../guards/not-bot.guard';
import { LETTER_EMOJI } from '../utils/statics';

export abstract class SixtyNineEvent implements AbuelaEvent {
  @On('message')
  @Guard(NotBotGuard)
  async on([message]: ArgsOf<'commandMessage'>): Promise<void> {
    const match = message.content.split(' ').find(word => word === '69');

    if (match) {
      for (const letter of [LETTER_EMOJI.n, LETTER_EMOJI.i, LETTER_EMOJI.c, LETTER_EMOJI.e]) {
        await message.react(letter);
      }
    }
  }
}
