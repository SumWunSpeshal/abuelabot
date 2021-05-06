import { ArgsOf, CommandMessage } from '@typeit/discord';
import { Client } from 'discord.js';

export interface AbuelaCommand {
  execute: (command: CommandMessage, client: Client) => Promise<void>;
}

export interface AbuelaEvent {
  on: (messageEvent: ArgsOf<any>, client: Client) => Promise<void>; // todo fix this stupid ass generic
}

export interface AbuelaReady {
  onReady: (client: Client) => Promise<void>;
}
