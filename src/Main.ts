import { Client } from '@typeit/discord';
import SETUP_CONFIG from './Config';
import Path from 'path';

const { token } = SETUP_CONFIG;

export class Main {
  private static _client: Client = new Client();

  static get Client(): Client {
    return this._client;
  }

  static async start(): Promise<void> {
    try {
      await this._client.login(token, Path.join(__dirname, 'Abuela.ts'));
    } catch (error) {
      console.error(error);
      process.exit(0);
    }
  }
}

Main.start();
