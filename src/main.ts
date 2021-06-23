import 'reflect-metadata';
import { Client } from '@typeit/discord';
import Path from 'path';
import { Intents } from 'discord.js';
import { NotBotGuard } from './guards/not-bot.guard';
import { cronJobs } from './cronjobs';
import { BOT_TOKEN, KnownGuilds } from './statics';
import config from './config';

export class Main {
  private static _client: Client = new Client({
    classes: [Path.join(__dirname, 'commands', '*.command.ts'), Path.join(__dirname, 'events', '*.event.ts')],
    intents: [
      Intents.FLAGS.GUILDS,
      Intents.FLAGS.GUILD_MEMBERS,
      Intents.FLAGS.GUILD_BANS,
      Intents.FLAGS.GUILD_EMOJIS,
      Intents.FLAGS.GUILD_INTEGRATIONS,
      Intents.FLAGS.GUILD_WEBHOOKS,
      Intents.FLAGS.GUILD_INVITES,
      Intents.FLAGS.GUILD_VOICE_STATES,
      Intents.FLAGS.GUILD_PRESENCES,
      Intents.FLAGS.GUILD_MESSAGES,
      Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
      Intents.FLAGS.GUILD_MESSAGE_TYPING,
      Intents.FLAGS.DIRECT_MESSAGES,
      Intents.FLAGS.DIRECT_MESSAGE_TYPING,
      Intents.FLAGS.DIRECT_MESSAGE_REACTIONS
    ],
    silent: false,
    slashGuilds: config.env === 'PROD' ? undefined : [KnownGuilds.ABUELA_ONLY_ID],
    guards: [NotBotGuard]
  });

  static get client(): Client {
    return this._client;
  }

  static async start(): Promise<void> {
    await this._client.login(BOT_TOKEN).catch(error => {
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
    console.info(`### Initialising Cron Jobs ... ###`);
    cronJobs.forEach(job => job.start());
  }

  
  private static async clearSlashes() {
    console.info(`### Clearing all Slashes ... ###`);

    for await (const guild of Main.client.guilds.cache) {
      await Main.client.clearSlashes(guild[0]);
    }
  }

  private static async initSlashes() {
    console.info(`### Initialising Slashes ... ###`);
    await Main.client.initSlashes();
  }

  private static initOnInteractionEvent() {
    console.info(`### Attaching Interaction Events ... ###`);

    this._client.on('interaction', async interaction => {
      await this._client.executeSlash(interaction);
    });
  }
}

Main.start().then();
