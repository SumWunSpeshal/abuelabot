import { Client } from '@typeit/discord';
import SETUP_CONFIG from './config';
import Path from 'path';

const { token, devToken } = SETUP_CONFIG;

export class Main {
  private static _client: Client = new Client({
    classes: [Path.join(__dirname, 'abuela.ts')],
    variablesChar: ':'
  });

  static get client(): Client {
    return this._client;
  }

  static async start(): Promise<void> {
    this._client.login(token).catch(error => {
      console.error(error);
      process.exit(0);
    });
  }
}

Main.start().then();
