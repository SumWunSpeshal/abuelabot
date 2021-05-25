import { Client } from '@typeit/discord';
import { AbuelaCommand, AbuelaCommandInfos } from '../types';
import config from '../config';
import { Http } from '../utils/http';
import { IGiphy } from '../api/giphy.interface';
import { url } from '../utils/tagged-templates';

const INFOS: AbuelaCommandInfos = {
  commandName: 'gif',
  description: 'Get a random GIF with an optional search term to narrow down the results',
  usage: '`!gif` or `!gif {searchTerm}`',
  aliases: []
};

export abstract class GifCommand implements AbuelaCommand {
  private readonly rating = 'r';

  // @Command(INFOS.commandName)
  // @Infos(INFOS)
  // @Guard(NotHelpGuard, NotBotGuard)
  // @GetAllUserArgs()
  async execute(command: any, client: Client, allUserArgs: string) {
    const response = await Http.fetch<IGiphy>(
      url`https://api.giphy.com/v1/gifs/random?api_key=${config.giphyKey}&tag=${allUserArgs}&rating=${this.rating}`
    );

    await command.channel.send(response?.data?.image_original_url);
  }
}
