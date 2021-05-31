import { Description, Discord, Option, Slash } from '@typeit/discord';
import { AbuelaCommandInfos } from '../types';
import config from '../config';
import { Http } from '../utils/http';
import { IGiphy } from '../api/giphy.interface';
import { url } from '../utils/tagged-templates';
import { CommandInteraction } from 'discord.js';

const INFOS: AbuelaCommandInfos = {
  commandName: 'gif',
  description: 'Get a random GIF from Giphy'
};

@Discord()
export abstract class GifCommand {
  private readonly rating = 'r';

  @Slash(INFOS.commandName)
  @Description(INFOS.description)
  async execute(
    @Option('text', { description: 'Search for a gif', required: true })
    userInput: string,
    interaction: CommandInteraction
  ) {
    const response = await Http.fetch<IGiphy>(
      url`https://api.giphy.com/v1/gifs/random?api_key=${config.giphyKey}&tag=${userInput}&rating=${this.rating}`
    );

    await interaction.reply(response?.data?.image_original_url);
  }
}
