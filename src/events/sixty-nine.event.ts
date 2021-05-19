import { ArgsOf, Guard, On } from '@typeit/discord';
import { AbuelaEvent } from '../types';
import { NotBotGuard } from '../guards/not-bot.guard';
import { readFileSync } from 'fs';
import Path from 'path';

export abstract class SixtyNineEvent implements AbuelaEvent {
  private readonly letters = JSON.parse(
    readFileSync(Path.join(__dirname, '..', 'assets', 'letter-emojis.json')).toString()
  );

  @On('message')
  @Guard(NotBotGuard)
  async on([message]: ArgsOf<'commandMessage'>): Promise<void> {
    const match = message.content.split(' ').find(word => word === '69');

    if (match) {
      for (const letter of [this.letters.n, this.letters.i, this.letters.c, this.letters.e]) {
        await message.react(letter);
      }
    }
  }
}
