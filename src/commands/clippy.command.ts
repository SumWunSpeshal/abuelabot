import { Client, Command, CommandMessage, Guard, Infos } from '@typeit/discord';
import { NotBotGuard } from '../guards/not-bot.guard';
import { AbuelaCommand, AbuelaCommandInfos } from '../types';
import { NotHelpGuard } from '../guards/not-help.guard';
import { MessageAttachment } from 'discord.js';
import { CanvasService } from '../services/canvas.service';
import { GetAllUserArgs } from '../decorators/get-all-user-args';
import { Aliases } from '../decorators/aliases';
import { LocalTemplateName } from '../api/clippy.interface';

export abstract class ClippyCommand implements AbuelaCommand {
  private static readonly infos: AbuelaCommandInfos = {
    description: 'TODO',
    usage: 'TODO with `code`',
    aliases: ['hagrid', 'jotaro', 'keem', 'plankton'] as LocalTemplateName[]
  };

  @Command('clippy')
  @Infos(ClippyCommand.infos)
  @Aliases(ClippyCommand.infos.aliases!)
  @Guard(NotHelpGuard, NotBotGuard)
  @GetAllUserArgs()
  async execute(command: CommandMessage, client: Client, allUserArgs: string) {
    const templateName = command.args[0].substring(1).trim().toLowerCase(); // FIXME ugly, fix this
    const canvas = new CanvasService(templateName as LocalTemplateName, allUserArgs);
    await canvas.loadImage();
    canvas.addText();
    const image = canvas.exportAsBuffer();

    await command.channel.send(new MessageAttachment(image));
  }
}
