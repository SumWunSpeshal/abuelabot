import { Client } from '@typeit/discord';
import SETUP_CONFIG from './config';
import Path from 'path';

const { token } = SETUP_CONFIG;

export class Main {

  private static _client: Client = new Client();

  static get client(): Client {
    return this._client;
  }


  static async start(): Promise<void> {
    try {
      await this._client.login(token, Path.join(__dirname, 'abuela.ts'));
    } catch (error) {
      console.error(error);
      process.exit(0);
    }
  }
}

Main.start().then();
