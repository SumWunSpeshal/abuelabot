import { Command, CommandMessage, Guard } from '@typeit/discord';
import { NotBotGuard } from '../guards/not-bot.guard';
import { AbuelaCommand } from '../types';
import config from '../config';
import { CommandHelper } from '../utils/command-helper';
import { Http } from '../utils/http';
import { GiphyInterface } from '../api/giphy.interface';

export abstract class GifCommand implements AbuelaCommand {

  private readonly rating = 'r';

  @Command('gif')
  @Guard(NotBotGuard)
  async execute(command: CommandMessage) {
    const userInput = CommandHelper.stripCommandKeyWord(command);
    const response = await Http.get<GiphyInterface.RootObject>(this.getUrl(userInput));
    await command.channel.send(CommandHelper.safeObjectKeyAccess(response?.data?.image_original_url));
  }

  private getUrl(searchTerm: string): string {
    const encoded = encodeURIComponent(searchTerm);
    console.log(encoded);
    return `https://api.giphy.com/v1/gifs/random?api_key=${config.giphyKey}&tag=${encoded}&rating=${this.rating}`;
  }
}
