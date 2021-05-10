import { Client, Command, CommandMessage, Guard, Infos } from '@typeit/discord';
import { NotBotGuard } from '../guards/not-bot.guard';
import { AbuelaCommand, AbuelaCommandInfos } from '../types';
import { NotHelpGuard } from '../guards/not-help.guard';
import { Aliases } from '../decorators/aliases';
import { GetAllUserArgs } from '../decorators/get-all-user-args';
import { readFileSync } from 'fs';
import Path from 'path';
import { EmojiListInterface } from '../api/emoji-list.interface';

export abstract class EmojifyCommand implements AbuelaCommand {
  private static readonly infos: AbuelaCommandInfos = {
    description: 'Type your text and watch how Abuela inserts Emojis where a match is found',
    usage: '`!emojify {text}`',
    aliases: ['emoji', 'copypasta', 'shitpost']
  };

  private static readonly emojis: EmojiListInterface = JSON.parse(
    readFileSync(Path.join(__dirname, '..', 'assets', 'emojis.json')).toString()
  );

  @Command('emojify')
  @Infos(EmojifyCommand.infos)
  @Aliases(EmojifyCommand.infos.aliases!)
  @Guard(NotHelpGuard, NotBotGuard)
  @GetAllUserArgs()
  async execute(command: CommandMessage, client: Client, allUserArgs: string) {
    const result = EmojifyCommand.replaceAllOccurrences(allUserArgs);
    await command.channel.send(result);
  }

  private static replaceAllOccurrences(userInput: string): string {
    const userInputSplit = userInput.split(' ');
    const { emojis } = EmojifyCommand.emojis;

    return userInputSplit
      .map(word => {
        const match = emojis.find(({ name }) =>
          name.split(' ').find(emojiDescriptionName => emojiDescriptionName === word.toLowerCase())
        );
        return match ? word + ' ' + match.emoji : word;
      })
      .join(' ');
  }
}
