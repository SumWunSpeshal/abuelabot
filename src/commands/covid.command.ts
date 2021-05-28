import { Description, Discord, Option, Slash } from '@typeit/discord';
import { AbuelaCommandInfos } from '../types';
import { Http } from '../utils/http';
import { RkiCovidInterface } from '../api/rki-covid.interface';
import { findBestMatch } from 'string-similarity';
import { CommandHelper } from '../utils/command-helper';
import { CommandInteraction, EmbedField, MessageEmbed, MessageOptions } from 'discord.js';
import { colorText } from '../utils/color-text';
import { FileHelper } from '../utils/file-helper';
import { SpecialChars } from '../utils/special-chars';

const INFOS: AbuelaCommandInfos = {
  commandName: 'covid',
  description: 'Get the latest COVID related information by german district/state or all of Germany'
};

@Discord()
export abstract class CovidCommand {
  private readonly baseUrl = 'https://api.corona-zahlen.org/';

  private readonly agsMap: RkiCovidInterface.AgsMap = FileHelper.parseToJSON(
    __dirname,
    '..',
    'assets',
    'german-districts.json'
  );

  @Slash(INFOS.commandName)
  @Description(INFOS.description)
  async execute(
    @Option('landkreis', {
      description: 'Type your district and get info for district and state, or leave empty for Germany'
    })
    userInput: string,
    interaction: CommandInteraction
  ) {
    if (!userInput) {
      await this.displayGermanyData(interaction);
      return;
    }

    const agsObj: RkiCovidInterface.AgsShort | undefined = this.getClosestDistrictMatch(userInput);
    const district = await this.getRkiData<RkiCovidInterface.DistrictRoot>('districts', agsObj?.ags);
    const metaData: RkiCovidInterface.Meta = district.meta;
    const districtDetails: RkiCovidInterface.Ags = district.data[agsObj!.ags];
    const stateAbbreviation = districtDetails.stateAbbreviation as RkiCovidInterface.StateAbbreviation;

    const [state, vaccinations, colorRanges] = await Promise.all([
      this.getRkiData<RkiCovidInterface.DistrictRoot>('states', stateAbbreviation),
      this.getRkiData<RkiCovidInterface.VaccRoot>('vaccinations'),
      this.getRkiData<RkiCovidInterface.ColorRoot>('map', 'districts/legend')
    ]);

    const stateDetails = state.data[stateAbbreviation];
    const stateVaccData = vaccinations.data.states[stateAbbreviation];
    const districtEmbed = this.buildDistrictEmbed(districtDetails, metaData, colorRanges);
    const stateEmbed = this.buildStateEmbed(
      `Aktuelle Daten für das entsprechende Bundesland \`${stateDetails?.name}\``,
      stateDetails,
      stateVaccData,
      metaData,
      colorRanges
    );

    await interaction.reply(new MessageEmbed(districtEmbed.embed));
    await interaction.followUp(new MessageEmbed(stateEmbed.embed));
  }

  private async displayGermanyData(interaction: CommandInteraction) {
    const [states, vaccinations, colorRanges, germanyData] = await Promise.all([
      this.getRkiData<RkiCovidInterface.DistrictRoot>('states'),
      this.getRkiData<RkiCovidInterface.VaccRoot>('vaccinations'),
      this.getRkiData<RkiCovidInterface.ColorRoot>('map', 'districts/legend'),
      this.getRkiData<RkiCovidInterface.Ags>('germany')
    ]);

    germanyData.population = Object.keys(states.data)
      .map(key => states.data[key].population)
      .reduce((acc, curr) => acc + curr); // monkey patching the german population

    const germanyEmbed = this.buildStateEmbed(
      `Aktuelle COVID Daten für \`Deutschland\``,
      germanyData,
      vaccinations.data,
      germanyData.meta!,
      colorRanges
    );

    await interaction.reply(new MessageEmbed(germanyEmbed.embed));
  }

  private buildDistrictEmbed(
    district: RkiCovidInterface.Ags,
    meta: RkiCovidInterface.Meta,
    colorRange: RkiCovidInterface.ColorRoot
  ): MessageOptions {
    return {
      embed: {
        color: this.getIncidentColor(colorRange, district?.weekIncidence)?.color || '#000',
        title: `Aktuelle COVID Daten für \`${district.name}\``,
        fields: [...this.buildCovidInfos(district)],
        footer: {
          text: `Quelle: ${meta.source} | Letztes Update: ${this.formatDate(meta.lastUpdate)}`
        }
      }
    };
  }

  private buildStateEmbed(
    title: string,
    state: RkiCovidInterface.Ags,
    vaccData: RkiCovidInterface.VaccData | RkiCovidInterface.State,
    meta: RkiCovidInterface.Meta,
    colorRange: RkiCovidInterface.ColorRoot
  ): MessageOptions {
    return {
      embed: {
        color: this.getIncidentColor(colorRange, state?.weekIncidence)?.color || '#000',
        title: title,
        fields: [...this.buildCovidInfos(state), ...this.buildVaccInfos(vaccData, state)],
        footer: {
          text: `Quelle: ${meta.source} | Letztes Update: ${this.formatDate(meta.lastUpdate)}`
        }
      }
    };
  }

  private buildCovidInfos(location: RkiCovidInterface.Ags): EmbedField[] {
    return [
      {
        name: 'Wocheninzidenz',
        value: colorText('blue', `[${(location?.weekIncidence).toFixed().toLocaleString()}]`),
        inline: true
      },
      {
        name: '7-Tage-Mittelwert',
        value: colorText('blue', `[${(location?.casesPerWeek / 7).toFixed().toLocaleString()}]`),
        inline: true
      },
      { name: SpecialChars.ZERO_WIDTH_SPACE, value: SpecialChars.ZERO_WIDTH_SPACE, inline: false },
      { name: '**Unterschied zu gestern**', value: SpecialChars.SEPARATOR, inline: false },
      {
        name: ':four_leaf_clover: Δ Genesen',
        value: colorText('green', `[${(location?.delta?.recovered).toLocaleString()}]`),
        inline: true
      },
      {
        name: ':microbe: Δ Fälle',
        value: colorText('yellow', `[${(location?.delta?.cases).toLocaleString()}]`),
        inline: true
      },
      {
        name: ':skull: Δ Tode',
        value: colorText('red', `[${(location?.delta?.deaths).toLocaleString()}]`),
        inline: true
      },
      { name: SpecialChars.ZERO_WIDTH_SPACE, value: SpecialChars.ZERO_WIDTH_SPACE, inline: false },
      { name: '**Insgesamt (in %)**', value: SpecialChars.SEPARATOR, inline: false },
      {
        name: ':four_leaf_clover: Genesen',
        value: colorText(
          'green',
          `[${(location?.recovered).toLocaleString()} (${this.inPercent(location?.recovered, location?.population)})]`
        ),
        inline: true
      },
      {
        name: ':microbe: Fälle',
        value: colorText(
          'yellow',
          `[${(location?.cases).toLocaleString()} (${this.inPercent(location?.cases, location?.population)})]`
        ),
        inline: true
      },
      {
        name: ':skull: Tode',
        value: colorText(
          'red',
          `[${(location?.deaths).toLocaleString()} (${this.inPercent(location?.deaths, location?.population)})]`
        ),
        inline: true
      },
      { name: SpecialChars.ZERO_WIDTH_SPACE, value: SpecialChars.ZERO_WIDTH_SPACE, inline: false }
    ];
  }

  private buildVaccInfos(
    vaccData: RkiCovidInterface.VaccData | RkiCovidInterface.State,
    location: { population: number }
  ): EmbedField[] {
    return [
      { name: '**Impfungen**', value: SpecialChars.SEPARATOR, inline: false },
      {
        name: ':syringe: seit gestern',
        value: colorText('green', `[${(vaccData?.delta).toLocaleString()}]`),
        inline: true
      },
      {
        name: ':one: Impfung insg. (in %)',
        value: colorText(
          'green',
          `[${(vaccData?.vaccinated).toLocaleString()} (${this.inPercent(vaccData?.vaccinated, location?.population)})]`
        ),
        inline: true
      },
      {
        name: ':two: Impfung insg. (in %)',
        value: colorText(
          'green',
          `[${(vaccData?.secondVaccination.vaccinated).toLocaleString()} (${this.inPercent(
            vaccData?.secondVaccination.vaccinated,
            location?.population
          )})]`
        ),
        inline: true
      },
      { name: SpecialChars.ZERO_WIDTH_SPACE, value: SpecialChars.ZERO_WIDTH_SPACE, inline: false }
    ];
  }

  private inPercent(stat: number, population: number): string {
    return `${(+((stat / population) * 100).toFixed(2)).toLocaleString()}%`;
  }

  private computeEmbedFields<T extends RkiCovidInterface.Ags | RkiCovidInterface.Meta | RkiCovidInterface.State>(
    obj: T
  ): EmbedField[] {
    return Object.keys(obj)
      .filter(key => {
        const type = typeof obj[key as keyof T];
        return type === 'string' || type === 'number';
      })
      .map(key => ({ name: key, value: obj[key as keyof T], inline: false })) as any;
  }

  private formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('de-DE', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  private async getRkiData<T>(endPoint: RkiCovidInterface.ApiEndPoint, arg?: string | undefined): Promise<T> {
    return Http.fetch<T>(`${this.baseUrl + endPoint}/${arg || ''}`);
  }

  private getClosestDistrictMatch(userInput: string): RkiCovidInterface.AgsShort | undefined {
    const districts = this.agsMap.map(item => item.name);
    const { bestMatch } = findBestMatch(CommandHelper.ucFirstLetterOfWords(userInput), districts);
    return this.agsMap.find(item => item.name === bestMatch?.target);
  }

  private getIncidentColor(
    colorMap: RkiCovidInterface.ColorRoot,
    incidence: number
  ): RkiCovidInterface.IncidentRange | undefined {
    return colorMap.incidentRanges.find(item => incidence >= item.min! && incidence <= item.max!);
  }
}
