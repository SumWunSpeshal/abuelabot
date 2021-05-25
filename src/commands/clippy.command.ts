import { Choices, Discord, Option, Slash } from '@typeit/discord';
import { AbuelaCommandInfos } from '../types';
import { CommandInteraction, MessageAttachment } from 'discord.js';
import { CanvasService } from '../services/canvas.service';
import { LocalTemplateName } from '../api/clippy.interface';

const INFOS: AbuelaCommandInfos = {
  commandName: 'clippy',
  description: 'Decorate clippy or one of his aliases with an original caption',
  usage: '`!clippy {caption?}` ... try the other ones too!',
  aliases: ['hagrid', 'jotaro', 'keem', 'plankton'] as LocalTemplateName[]
};

@Discord()
export abstract class ClippyCommand {
  @Slash(INFOS.commandName)
  async execute(
    @Option('templates', { description: INFOS.description })
    @Choices({
      Clippy: 'clippy',
      Hagrid: 'hagrid',
      Jotaro: 'jotaro',
      Keem: 'keem',
      Plankton: 'plankton'
    })
    template: LocalTemplateName,
    @Option('caption', { description: '... now add your caption' })
    text: string,
    interaction: CommandInteraction,
  ) {
    const image = await CanvasService.init(template, text);
    await interaction.defer();
    await interaction.editReply(new MessageAttachment(image));
  }
}
