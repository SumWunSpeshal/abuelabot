import { Client } from '@typeit/discord';
import SETUP_CONFIG from './config';
import Path from 'path';
import config from './config';
import { Intents } from 'discord.js';
import { NotBotGuard } from './guards/not-bot.guard';
import { cronJobs } from './cronjobs';

const { token, devToken } = SETUP_CONFIG;

export class Main {
  private static _client: Client = new Client({
    classes: [Path.join(__dirname, 'commands', '*.ts'), Path.join(__dirname, 'events', '*.event.ts')],
    intents: [
      Intents.FLAGS.GUILDS,
      Intents.FLAGS.GUILD_MESSAGES,
      Intents.FLAGS.GUILD_INTEGRATIONS,
      Intents.FLAGS.GUILD_VOICE_STATES,
      Intents.FLAGS.GUILD_EMOJIS,
    ],
    silent: false,
    slashGuilds: config.env === 'PROD' ? undefined : ['841326836545093672'],
    guards: [NotBotGuard]
  });

  static get client(): Client {
    return this._client;
  }

  static async start(): Promise<void> {
    this._client.login(config.env === 'PROD' ? token : devToken).catch(error => {
      console.error(error);
      process.exit(0);
    });

    this.initOnInteractionEvent();
    this.initCronJobs();
  }

  private static initOnInteractionEvent() {
    this._client.on('interaction', async (interaction) => {
      await this._client.executeSlash(interaction);
    });
  }

  private static initCronJobs() {
    cronJobs.forEach(job => job.start());
  }
}

Main.start().then();
