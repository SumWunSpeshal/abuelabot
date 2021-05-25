import { Client } from '@typeit/discord';
import SETUP_CONFIG from './config';
import Path from 'path';
import config from './config';
import { Intents } from 'discord.js';
import { NotBotGuard } from './guards/not-bot.guard';

const { token, devToken } = SETUP_CONFIG;

export class Main {
  private static _client: Client = new Client({
    classes: [Path.join(__dirname, 'commands', '*.ts'), Path.join(__dirname, 'events', '*.event.ts')],
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
    silent: false,
    slashGuilds: config.env === 'PROD' ? undefined : ['841326836545093672'],
    guards: [NotBotGuard]
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

    this._client.on("interaction", (interaction) => {
      this._client.executeSlash(interaction);
    });
  }
}

Main.start().then();
