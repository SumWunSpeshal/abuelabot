import { Client, Description, Discord, Slash } from '@typeit/discord';
import { AbuelaCommand, AbuelaCommandInfos } from '../types';
import { Random } from '../utils/random';
import { readFileSync, writeFileSync } from 'fs';
import Path from 'path';
import { CommandInteraction, Guild } from 'discord.js';
import { colorText } from '../utils/color-text';

const INFOS: AbuelaCommandInfos = {
  commandName: 'gj',
  description: 'Tell me how much you love me! ❤️'
};

interface Counter {
  [key: string]: number;
}

@Discord()
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

  @Slash(INFOS.commandName)
  @Description(INFOS.description)
  async execute(interaction: CommandInteraction, client: Client) {
    const fileData: Counter = JSON.parse(readFileSync(this.path).toString());
    const currentGuild = client.guilds.cache.get(interaction.guild!.id);

    const counter = this.saveCounterValue(fileData, currentGuild!);
    await interaction.reply(
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
