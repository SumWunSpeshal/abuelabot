import { VoiceConnection } from 'discord.js';
import { CommandMessage } from '@typeit/discord';

export abstract class ConnectionService {
  private static _voiceConnection: VoiceConnection | undefined = undefined;

  static async join({ member }: CommandMessage) {
    this._voiceConnection = await member?.voice?.channel?.join();
  }

  static isBotInVoiceChannel({ member }: CommandMessage) {
    return !!member?.guild?.me?.voice?.channel;
  }

  static leave({ member }: CommandMessage) {
    member?.guild?.me?.voice?.channel?.leave();
    this._voiceConnection = undefined;
  }

  static get voiceConnection(): VoiceConnection | undefined {
    return this._voiceConnection;
  }
}
