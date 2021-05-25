import { ArgsOf, Discord, On } from '@typeit/discord';
import { AbuelaEvent } from '../types';
import { readFileSync } from 'fs';
import Path from 'path';

@Discord()
export abstract class SixtyNineEvent implements AbuelaEvent {
  private readonly letters = JSON.parse(
    readFileSync(Path.join(__dirname, '..', 'assets', 'letter-emojis.json')).toString()
  );

  @On('message')
  async on([message]: ArgsOf<'message'>): Promise<void> {
    const match = message.content.split(' ').find(word => word === '69');

    if (match) {
      for (const letter of [this.letters.n, this.letters.i, this.letters.c, this.letters.e]) {
        await message.react(letter);
      }
    }
  }
}
