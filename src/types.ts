import { ArgsOf, CommandMessage } from '@typeit/discord';
import { Client } from 'discord.js';

export interface AbuelaCommand {
  execute: (command: CommandMessage) => Promise<void>;
}

export interface AbuelaEvent {
  on: ([message]: ArgsOf<any>, client: Client) => Promise<void>; // todo fix this stupid ass generic
}

export interface AbuelaReady {
  onReady: (client: Client) => Promise<void>;
}
