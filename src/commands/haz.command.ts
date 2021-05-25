import { Client } from '@typeit/discord';
import { AbuelaCommand, AbuelaCommandInfos } from '../types';
import { Http } from '../utils/http';
import { JSDOM } from 'jsdom';
import { HazArticleInterface } from '../api/haz-article.interface';
import { EmbedField } from 'discord.js';
import { CommandHelper } from '../utils/command-helper';

const INFOS: AbuelaCommandInfos = {
  commandName: 'haz',
  description: `Circumvent the paywall for HAZ online articles`,
  usage: '`!haz {url}`',
  aliases: ['paywall']
};

export abstract class HazCommand implements AbuelaCommand {
  // @Command(INFOS.commandName)
  // @Infos(INFOS)
  // @Aliases(INFOS.aliases)
  // @Guard(NotHelpGuard, NotBotGuard)
  // @GetAllUserArgs()
  async execute(command: any, client: Client, allUserArgs: string) {
    const article = await this.getInfo(allUserArgs);

    const embedFields = this.buildFields(article, 1000);
    const messageSplits = CommandHelper.createArrayChunks(embedFields, 3);

    for await (let arrayChunk of messageSplits) {
      await command.channel.send({
        embed: {
          title: article.headline,
          description: messageSplits.indexOf(arrayChunk) === 0 ? `*${article.description}*` : `*FORTSETZUNG* (Teil ${messageSplits.indexOf(arrayChunk) + 1})`,
          color: article.isAccessibleForFree === 'False' ? '#f8c92b' : '#000000',
          url: article.mainEntityOfPage['@id'],
          fields: arrayChunk,
          thumbnail: {
            url: article.thumbnailUrl
          },
          image: {
            url: article.image.url
          }
        }
      });
    }
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
