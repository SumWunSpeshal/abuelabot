import { Discord, Option, Slash } from '@typeit/discord';
import { AbuelaCommandInfos } from '../types';
import { Http } from '../utils/http';
import { JSDOM } from 'jsdom';
import { HazArticleInterface } from '../api/haz-article.interface';
import { CommandInteraction, EmbedField, MessageEmbed, MessageOptions } from 'discord.js';
import { CommandHelper } from '../utils/command-helper';

const INFOS: AbuelaCommandInfos = {
  commandName: 'haz',
  description: `Circumvent the paywall for HAZ online articles`,
  usage: '`!haz {url}`',
  aliases: ['paywall']
};

@Discord()
export abstract class HazCommand {
  @Slash(INFOS.commandName)
  async execute(
    @Option('url', { description: INFOS.description })
    url: string,
    interaction: CommandInteraction
  ) {
    const article = await this.getInfo(url);

    const embedFields = this.buildFields(article, 1000);
    const messageSplits = CommandHelper.createArrayChunks(embedFields, 3);

    for await (let arrayChunk of messageSplits) {
      if (messageSplits.indexOf(arrayChunk) === 0) {
        await interaction.reply(new MessageEmbed(this.buildEmbed(article, article.description, arrayChunk).embed));
      } else {
        const description = `*FORTSETZUNG* (Teil ${messageSplits.indexOf(arrayChunk) + 1})`;
        await interaction.followUp(new MessageEmbed(this.buildEmbed(article, description, arrayChunk).embed));
      }
    }
  }

  private buildEmbed(article: HazArticleInterface, description: string, body: EmbedField[]): MessageOptions {
    return {
      embed: {
        title: article.headline,
        description: description,
        color: article.isAccessibleForFree === 'False' ? '#f8c92b' : '#000000',
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

  private buildFields(article: HazArticleInterface, maxLength: number): EmbedField[] {
    const sentences = article.articleBody.split('.');
    let ret = [''];

    sentences.forEach(sentence => {
      if (ret[ret.length - 1].length + sentence.length <= maxLength) {
        ret[ret.length - 1] = ret[ret.length - 1] + sentence + '.';
      } else {
        ret.push(sentence + '.');
      }
    });

    return ret.map(chunk => ({ name: '▬▬▬▬▬▬▬▬▬▬', value: chunk, inline: false }));
  }

  private async getInfo(url: string): Promise<HazArticleInterface> {
    const content: string = await Http.fetch(url, 'text');
    const { window } = new JSDOM(content);
    const element = window.document.querySelector('.pdb-article script[type="application/ld+json"]');
    return JSON.parse(element!.textContent!);
  }
}
