import { Client, Description, Discord, Option, Slash } from '@typeit/discord';
import { AbuelaCommand, AbuelaCommandInfos } from '../types';
import { Http } from '../utils/http';
import config from '../config';
import { ImALazyFuck, YoutubeService } from '../services/youtube.service';
import { RequestInit } from 'node-fetch';
import { colorText } from '../utils/color-text';
import { CommandInteraction } from 'discord.js';

const INFOS: AbuelaCommandInfos = {
  commandName: 'wiki',
  description: `Quickly search Wikipedia`
};

// @Discord()
export abstract class WikiCommand {
  private readonly wikiUrl = 'https://de.wikipedia.org/w/api.php?action=query&format=json&list=search&srsearch=intitle:';

  // @Slash(INFOS.commandName)
  // @Description(INFOS.description)
  async execute(
    @Option('search-wikipedia', { description: 'Search as if you were on Wikipedia', required: true })
    userInput: string,
    interaction: CommandInteraction,
  ) {

    const response: any = await Http.fetch(this.wikiUrl + encodeURIComponent(userInput));
    console.log(response.query.search[0]);
    await interaction.reply('wiki');
  }
}
