import { VoiceConnection } from 'discord.js';

export abstract class ConnectionService {
  private static _voiceConnection: VoiceConnection | undefined = undefined;

  static async join({ member }: any) {
    this._voiceConnection = await member?.voice?.channel?.join();
  }

  static isBotInVoiceChannel({ member }: any) {
    return !!member?.guild?.me?.voice?.channel;
  }

  static leave({ member }: any) {
    member?.guild?.me?.voice?.channel?.leave();
    this._voiceConnection = undefined;
  }

  static get voiceConnection(): VoiceConnection | undefined {
    return this._voiceConnection;
  }
}
