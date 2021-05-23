import { Client, Command, CommandMessage, Guard, Infos } from '@typeit/discord';
import { NotBotGuard } from '../guards/not-bot.guard';
import { AbuelaCommand, AbuelaCommandInfos } from '../types';
import { Aliases } from '../decorators/aliases';
import { Random } from '../utils/random';
import { NotHelpGuard } from '../guards/not-help.guard';
import { readFileSync, writeFileSync } from 'fs';
import Path from 'path';
import { Guild } from 'discord.js';
import { colorText } from '../utils/color-text';

const INFOS: AbuelaCommandInfos = {
  commandName: 'goodbot',
  description: 'Tell me how much you love me! :heart:',
  usage: '`!goodbot`',
  aliases: ['bestbot', 'goodjob', 'gj', 'love', 'iloveu', 'iloveyou', 'nice']
};

interface Counter {
  [key: string]: number;
}

export abstract class ComplimentBotCommand implements AbuelaCommand {
  private path = Path.join(__dirname, '..', 'cache', 'counter.json');

  private readonly botResponses = [
    'Thank you, I love you too!',
    `I know I'm awesome.`,
    'Aww, thank you!',
    'Yeah! High five!',
    `We're killing it!`,
    'ggwp',
    'hdgdl, brudi'
  ];

  @Command(INFOS.commandName)
  @Infos(INFOS)
  @Guard(NotHelpGuard, NotBotGuard)
  @Aliases(INFOS.aliases)
  async execute(command: CommandMessage, client: Client) {
    const fileData: Counter = JSON.parse(readFileSync(this.path).toString());
    const currentGuild = client.guilds.cache.get(command.guild!.id);

    const counter = this.saveCounterValue(fileData, currentGuild!);
    await command.reply(
      Random.getRandomFrom(this.botResponses) +
      colorText('green', `I've been killing it [${counter}] times now`)
    );
  }

  private saveCounterValue(fileData: Counter, { id }: Guild): number {
    const counter = id in fileData ? fileData[id] : 0;
    const newCounter = counter + 1;
    fileData[id] = newCounter;
    writeFileSync(this.path, JSON.stringify(fileData));
    return newCounter;
  }
}
