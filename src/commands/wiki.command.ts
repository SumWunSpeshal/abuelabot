import { Choices, Description, Discord, Option, Slash } from '@typeit/discord';
import { AbuelaCommandInfos } from '../types';
import { Http } from '../utils/http';
import { CommandInteraction, MessageEmbed } from 'discord.js';
import { CommandHelper } from '../utils/command-helper';
import { SpecialChars } from '../utils/special-chars';
import { IWiki, PageExtract, PageInfo } from '../api/wiki.interface';
import { Colors } from '../statics';

type Prop = 'extracts' | 'info';
type WikiLanguage = 'de' | 'en';

const INFOS: AbuelaCommandInfos = {
  commandName: 'wiki',
  description: `Search as if you were on Wikipedia and let Abuela respond with the first search result!`,
  choices: [
    {
      German: 'de',
      English: 'en'
    }
  ]
};

@Discord()
export abstract class WikiCommand {

  @Slash(INFOS.commandName)
  @Description(INFOS.description)
  async execute(
    @Option('search-wikipedia', { description: 'Search as if you were on Wikipedia', required: true })
    userInput: string,
    @Option('language', { description: 'Choose your target article language' })
    @Choices(INFOS.choices![0])
    language: WikiLanguage,
    interaction: CommandInteraction
  ) {
    const info = await this.getInfo(userInput, language, 'info') as PageInfo;
    const page = await this.getInfo(userInput, language, 'extracts') as PageExtract;
    const chunk = page?.extract
      ? CommandHelper.splitLargeString(page?.extract, 800)[0] + '[...]'
      : `I'm sorry, I couldn't find anything :pensive:`;

    await interaction.reply(
      new MessageEmbed({
        title: page.title,
        color: Colors.BLURPLE,
        url: info.fullurl,
        fields: [
          {
            name: SpecialChars.ZERO_WIDTH_SPACE,
            value: chunk,
            inline: false
          }
        ],
        footer: {
          text: `Zuletzt bearbeitet: ${CommandHelper.formatDate(new Date(info.touched))}`
        }
      })
    );
  }

  private buildUrl(userInput: string, language: WikiLanguage = 'de', prop: Prop): string {
    const url = new URL(`https://${language}.wikipedia.org/w/api.php`);
    url.searchParams.append('format', 'json');
    url.searchParams.append('action', 'query');
    url.searchParams.append('prop', prop);
    prop === 'info' && url.searchParams.append('inprop', 'url|talkid');
    url.searchParams.append('exintro', '');
    url.searchParams.append('explaintext', '');
    url.searchParams.append('titles', encodeURIComponent(userInput));

    return url.href;
  }

  private async getInfo(userInput: string, language: WikiLanguage, prop: Prop): Promise<PageExtract | PageInfo> {
    const url = this.buildUrl(userInput, language, prop);
    const content = await Http.fetch<IWiki>(url);
    const firstKey = Object.keys(content?.query?.pages)[0];
    return content?.query?.pages?.[firstKey];
  }
}
