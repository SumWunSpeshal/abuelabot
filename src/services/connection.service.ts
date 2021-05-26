import { CommandInteraction, VoiceConnection } from 'discord.js';
import { CommandHelper } from '../utils/command-helper';

export abstract class ConnectionService {
  private static _voiceConnection: VoiceConnection | undefined = undefined;

  static async join(commandInteraction: CommandInteraction) {
    const guild = CommandHelper.getGuildById(commandInteraction.guildID!);
    const member = CommandHelper.getMemberById(guild!, commandInteraction.user.id);
    this._voiceConnection = await member?.voice?.channel?.join();
  }

  static leave(commandInteraction: CommandInteraction) {
    const guild = CommandHelper.getGuildById(commandInteraction.guildID!);
    const member = CommandHelper.getMemberById(guild!, commandInteraction.user.id);
    member?.guild?.me?.voice?.channel?.leave();
    this._voiceConnection = undefined;
  }

  static get voiceConnection(): VoiceConnection | undefined {
    return this._voiceConnection;
  }
}
