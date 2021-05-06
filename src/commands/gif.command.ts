import { Command, CommandMessage, Guard } from '@typeit/discord';
import { NotBotGuard } from '../guards/not-bot.guard';
import { AbuelaCommand } from '../types';
import config from '../config';
import { CommandHelper } from '../utils/command-helper';
import { Http } from '../utils/http';
import { GiphyInterface } from '../api/giphy.interface';
import { Url } from '../utils/url';
import { GetAllUserArgs } from '../decorators/get-all-user-args';
import { Client } from '@typeit/discord';

export abstract class GifCommand implements AbuelaCommand {
  private readonly rating = 'r';

  @Command('gif')
  @GetAllUserArgs()
  @Guard(NotBotGuard)
  async execute(command: CommandMessage, client: Client, userArgs: string) {
    const response = await Http.get<GiphyInterface.RootObject>(
      Url.encode`https://api.giphy.com/v1/gifs/random?api_key=${config.giphyKey}&tag=${userArgs}&rating=${this.rating}`
    );
    await command.channel.send(CommandHelper.safeObjectKeyAccess(response?.data?.image_original_url));
  }
}
