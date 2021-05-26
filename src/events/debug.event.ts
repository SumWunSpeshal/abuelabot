import { ArgsOf, Client, Discord, On } from '@typeit/discord';
import { AbuelaEvent } from '../types';

@Discord()
export abstract class DebugEvent implements AbuelaEvent {

  @On('debug')
  async on([debugObj]: ArgsOf<'debug'>): Promise<void> {
    // console.log(debugObj);
  }
}
