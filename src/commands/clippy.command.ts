import { Client, Command, CommandMessage, Guard, Infos } from '@typeit/discord';
import { NotBotGuard } from '../guards/not-bot.guard';
import { AbuelaCommand, AbuelaCommandInfos } from '../types';
import { NotHelpGuard } from '../guards/not-help.guard';
import { MessageAttachment } from 'discord.js';
import { CanvasService } from '../services/canvas.service';
import { GetAllUserArgs } from '../decorators/get-all-user-args';
import { Aliases } from '../decorators/aliases';
import { LocalTemplateName } from '../api/clippy.interface';
import { FixCommandNameGuard } from '../guards/fix-command-name.guard';

export abstract class ClippyCommand implements AbuelaCommand {
  private static readonly infos: AbuelaCommandInfos = {
    description: 'Decorate clippy or one of his aliases with an original caption',
    usage: '`!clippy {caption?}` ... try the other ones too!',
    aliases: ['hagrid', 'jotaro', 'keem', 'plankton'] as LocalTemplateName[]
  };

  @Command('clippy')
  @Infos(ClippyCommand.infos)
  @Aliases(ClippyCommand.infos.aliases!)
  @Guard(NotHelpGuard, NotBotGuard, FixCommandNameGuard(['clippy', ...ClippyCommand.infos.aliases!]))
  @GetAllUserArgs()
  async execute(command: CommandMessage, client: Client, allUserArgs: string) {
    const image = await CanvasService.init(command.commandName as LocalTemplateName, allUserArgs);
    await command.channel.send(new MessageAttachment(image));
  }
}
