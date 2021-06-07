import { Description, Discord, Option, Slash } from '@typeit/discord';
import { AbuelaCommandInfos } from '../types';
import { Http } from '../utils/http';
import { JSDOM } from 'jsdom';
import { HazArticleInterface } from '../api/haz-article.interface';
import { CommandInteraction, EmbedField, MessageEmbed, MessageOptions } from 'discord.js';
import { CommandHelper } from '../utils/command-helper';
import { SpecialChars } from '../utils/special-chars';
import { Colors } from '../statics';

const INFOS: AbuelaCommandInfos = {
  commandName: 'paywall',
  description: `Circumvent the paywall for one of the following online magazines: HAZ or MAZ`
};

@Discord()
export abstract class PayWallCommand {
  @Slash(INFOS.commandName)
  @Description(INFOS.description)
  async execute(
    @Option('url', { description: 'Provide a valid magazine url', required: true })
    url: string,
    interaction: CommandInteraction
  ) {
    const richSnippetExtract = await this.getInfo(url);

    const paragraphs = CommandHelper.splitLargeString(richSnippetExtract.articleBody, 1000);
    const embedFields = paragraphs.map(chunk => ({ name: SpecialChars.SEPARATOR, value: chunk, inline: false }));
    const messageSplits = CommandHelper.createArrayChunks(embedFields, 3);

    for await (let arrayChunk of messageSplits) {
      if (messageSplits.indexOf(arrayChunk) === 0) {
        await interaction.reply(new MessageEmbed(this.buildEmbed(richSnippetExtract, richSnippetExtract.description, arrayChunk).embed));
      } else {
        const description = `*FORTSETZUNG* (Teil ${messageSplits.indexOf(arrayChunk) + 1})`;
        await interaction.followUp(new MessageEmbed(this.buildEmbed(richSnippetExtract, description, arrayChunk).embed));
      }
    }
  }

  private buildEmbed(article: HazArticleInterface, description: string, body: EmbedField[]): MessageOptions {
    return {
      embed: {
        title: article.headline,
        description: description,
        color: article.isAccessibleForFree === 'False' ? '#f8c92b' : Colors.BLURPLE,
        url: article.mainEntityOfPage['@id'],
        fields: body,
        thumbnail: {
          url: article.thumbnailUrl
        },
        image: {
          url: article.image.url
        }
      }
    };
  }

  private async getInfo(url: string): Promise<HazArticleInterface> {
    const content: string = await Http.fetch(url, 'text');
    const { window } = new JSDOM(content);
    const element = window.document.querySelector('.pdb-article script[type="application/ld+json"]');
    return JSON.parse(element!.textContent!);
  }
}
