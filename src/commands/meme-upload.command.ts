import { Description, Discord, Option, Slash } from '@typeit/discord';
import { CommandInteraction, MessageEmbed } from 'discord.js';
import { AbuelaCommandInfos } from '../types';
import { CloudinaryService } from '../services/cloudinary.service';
import { Http } from '../utils/http';
import { Colors } from '../statics';
import { UploadApiResponse } from 'cloudinary';
import { colorText } from '../utils/color-text';

const INFOS: AbuelaCommandInfos = {
  commandName: 'memeupload',
  description: `Upload a new meme template for the /meme command`
};

@Discord()
export abstract class MemeUploadCommand {
  @Slash(INFOS.commandName)
  @Description(INFOS.description)
  async execute(
    @Option('imageURL', {
      description: '... give me the URL to the new meme template',
      required: true
    })
    imageURL: string,
    @Option('name', { description: '... choose a name for your meme', required: true }) name: string,
    interaction: CommandInteraction
  ) {
    const public_id = name.replace(/[ ._#!$%=&]/g, '-');

    if (!(await Http.isTargetAlive(imageURL))) {
      await interaction.reply(colorText('red', '[Invalid URL!]'), { ephemeral: true });
    }

    await interaction.defer();

    const response: UploadApiResponse = await CloudinaryService.upload(imageURL, {
      upload_preset: 'templates',
      public_id,
      transformation: {
        quality: 60,
        width: 640
      }
    });

    if (response?.existing) {
      await interaction.editReply(
        colorText('red', '[The name you have chosen already exists! Choose a different name!]')
      );
    }

    await interaction.editReply(
      new MessageEmbed({
        color: Colors.GREEN,
        title: 'Successfully uploaded your new meme template!',
        image: {
          url: imageURL
        },
        description: `Use your template with the name you have assigned: \`${public_id}\``
      })
    );
  }
}
