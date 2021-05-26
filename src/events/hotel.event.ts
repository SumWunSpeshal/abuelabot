import { ArgsOf, Discord, On } from '@typeit/discord';
import { AbuelaEvent } from '../types';
import { readFileSync } from 'fs';
import Path from 'path';

@Discord()
export abstract class HotelEvent implements AbuelaEvent {
  private readonly letters = JSON.parse(
    readFileSync(Path.join(__dirname, '..', 'assets', 'letter-emojis.json')).toString()
  );

  @On('message')
  async on([message]: ArgsOf<'message'>): Promise<void> {
    const match = message.content.split(' ').find(word => word.toLowerCase() === 'hotel');
    const trivago = [
      this.letters.t,
      this.letters.r,
      this.letters.i,
      this.letters.v,
      this.letters.a,
      this.letters.g,
      this.letters.o
    ];

    if (match) {
      for await (const letter of trivago) {
        await message.react(letter);
      }
    }
  }
}
