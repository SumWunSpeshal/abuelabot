import { Client } from '@typeit/discord';
import SETUP_CONFIG from './config';
import config from './config';
import Path from 'path';
import { Intents } from 'discord.js';
import { NotBotGuard } from './guards/not-bot.guard';
import { cronJobs } from './cronjobs';
import { KnownGuilds } from './statics';

const { token, devToken } = SETUP_CONFIG;

export class Main {
  private static _client: Client = new Client({
    classes: [
      Path.join(__dirname, 'commands', '*.command.ts'),
      Path.join(__dirname, 'events', '*.event.ts')
    ],
    intents: [
      Intents.FLAGS.GUILDS,
      Intents.FLAGS.GUILD_MESSAGES,
      Intents.FLAGS.GUILD_INTEGRATIONS,
      Intents.FLAGS.GUILD_VOICE_STATES,
      Intents.FLAGS.GUILD_EMOJIS,
    ],
    silent: false,
    slashGuilds: config.env === 'PROD' ? [KnownGuilds.GARTENFREUNDE] : [KnownGuilds.ABUELA_ONLY_ID],
    guards: [NotBotGuard]
  });

  static get client(): Client {
    return this._client;
  }

  static async start(): Promise<void> {
    await this._client.login(config.env === 'PROD' ? token : devToken).catch(error => {
      console.error(error);
      process.exit(0);
    });

    this.initCronJobs();
    await this.clearSlashes();
    await this.initSlashes();
    this.initOnInteractionEvent();
    console.info(`### ${this._client.user?.username} ready! ###`);
  }

  private static initCronJobs() {
    console.info(`### Initialising Cron Jobs ... ###`)
    cronJobs.forEach(job => job.start());
  }

  private static async clearSlashes() {
    console.info(`### Clearing all Slashes ... ###`)

    for await (const guild of Main.client.guilds.cache) {
      await Main.client.clearSlashes(guild[0]);
    }
  }

  private static async initSlashes() {
    console.info(`### Initialising Slashes ... ###`)
    await Main.client.initSlashes();
  }

  private static initOnInteractionEvent() {
    console.info(`### Attaching Interaction Events ... ###`)

    this._client.on('interaction', async (interaction) => {
      await this._client.executeSlash(interaction);
    });
  }
}

Main.start().then();
