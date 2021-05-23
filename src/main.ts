import { Client } from '@typeit/discord';
import SETUP_CONFIG from './config';
import Path from 'path';
import config from './config';

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
    const _token = config.env === 'PROD' ? token : devToken;

    this._client.login(_token).catch(error => {
      console.error(error);
      process.exit(0);
    });
  }
}

Main.start().then();
