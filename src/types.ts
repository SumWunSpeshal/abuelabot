import { CommandMessage } from "@typeit/discord";

export interface AbuelaCommand {
  execute: (command: CommandMessage) => void;
}
