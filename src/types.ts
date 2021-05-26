import { ArgsOf, Client } from '@typeit/discord';
import { CommandInteraction } from 'discord.js';

// fixme rewrite this
export interface AbuelaCommand {
  execute(command: CommandInteraction, client: Client, ...rest: any[]): Promise<void>;
}

export interface AbuelaCommandInfos {
  commandName: string;
  description: string;
  alias?: string;
  choices?: Record<string, string>[]
}

export interface AbuelaEvent {
  on: (messageEvent: ArgsOf<any>, client: Client) => Promise<void>; // todo fix this stupid ass generic
}

export interface AbuelaReady {
  onReady: (client: Client) => Promise<void>;
}
