import { Main } from '../main';
import { CustomEvents } from './statics';
import { CommandMessage } from '@typeit/discord';

export abstract class EventHelper {

  static dispatch(customEvent: CustomEvents, command: CommandMessage) {
    Main.client.emit(customEvent, command);
  }

  static showDetailedHelp(command: CommandMessage) {
    this.dispatch(CustomEvents.MANUAL_HELP_TRIGGER, command);
  }
}
