import { Choices, Description, Discord, Option, Slash } from '@typeit/discord';
import { AbuelaCommandInfos } from '../types';
import { CommandInteraction, MessageAttachment } from 'discord.js';
import { CanvasService } from '../services/canvas.service';
import { LocalTemplateName } from '../api/clippy.interface';

const INFOS: AbuelaCommandInfos = {
  commandName: 'clippy',
  description: 'Decorate clippy or one of his aliases with an original caption',
  choices: [
    {
      Clippy: 'clippy',
      Hagrid: 'hagrid',
      Jotaro: 'jotaro',
      Keem: 'keem',
      Plankton: 'plankton'
    }
  ]
};

@Discord()
export abstract class ClippyCommand {
  @Slash(INFOS.commandName)
  @Description(INFOS.description)
  async execute(
    @Option('templates', { description: '... choose existing templates', required: true })
    @Choices(INFOS.choices![0])
    template: LocalTemplateName,
    @Option('caption', { description: '... now add your caption' }) text: string,
    interaction: CommandInteraction
  ) {
    await interaction.defer();
    const image = await CanvasService.init(template, text ?? '');
    await interaction.editReply(new MessageAttachment(image));
  }
}
