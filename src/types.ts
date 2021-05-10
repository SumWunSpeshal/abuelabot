import { ArgsOf, CommandMessage } from '@typeit/discord';
import { Client } from '@typeit/discord';

export interface AbuelaCommand {
  execute(command: CommandMessage, client: Client, ...rest: any[]): Promise<void>;

  /**
   * @description
   * The implementation of this property needs to be static and required!
   * TypeScript doesn't allow for static properties in Interfaces, so this comment is necessary
   */
  readonly infos?: AbuelaCommandInfos;
}

export interface AbuelaCommandInfos {
  description: string;
  usage: string;
  aliases?: string[];
}

export interface AbuelaEvent {
  on: (messageEvent: ArgsOf<any>, client: Client) => Promise<void>; // todo fix this stupid ass generic
}

export interface AbuelaReady {
  onReady: (client: Client) => Promise<void>;
}
