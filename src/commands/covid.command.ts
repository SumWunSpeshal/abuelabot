import { Client, Command, CommandMessage, Guard, Infos } from '@typeit/discord';
import { NotBotGuard } from '../guards/not-bot.guard';
import { AbuelaCommand, AbuelaCommandInfos } from '../types';
import { NotHelpGuard } from '../guards/not-help.guard';
import { Http } from '../utils/http';
import { GetAllUserArgs } from '../decorators/get-all-user-args';
import { RkiCovidInterface } from '../api/rki-covid.interface';
import { readFileSync } from 'fs';
import Path from 'path';
import { findBestMatch } from 'string-similarity';
import { CommandHelper } from '../utils/command-helper';
import { EmbedField, MessageOptions } from 'discord.js';
import { colorText } from '../utils/color-text';
import { Aliases } from '../decorators/aliases';

const INFOS: AbuelaCommandInfos = {
  commandName: 'covid',
  description:
    'Get the latest COVID related information about your district (Landkreis) as well as the COVID infos about your state (Bundesland) as well as your states vaccination infos. OR... get all the info about all of Germany by not sending any args at all',
  usage: '`!covid` for all of Germany\n`!covid {district}` for a specific district',
  aliases: ['corona', 'covid19', 'sarscov2', 'ncov', 'cov']
};

export abstract class CovidCommand implements AbuelaCommand {
  private readonly baseUrl = 'https://api.corona-zahlen.org/';

  private readonly agsMap: RkiCovidInterface.AgsMap = JSON.parse(
    readFileSync(Path.join(__dirname, '..', 'assets', 'german-districts.json')).toString()
  );

  private readonly zeroWidthSpace = '\u200b';

  @Command(INFOS.commandName)
  @Infos(INFOS)
  @Guard(NotHelpGuard, NotBotGuard)
  @Aliases(INFOS.aliases)
  @GetAllUserArgs()
  async execute(command: CommandMessage, client: Client, allUserArgs: string) {
    if (!allUserArgs) {
      await this.displayGermanyData(command);
      return;
    }

    const agsObj: RkiCovidInterface.AgsShort | undefined = this.getClosestDistrictMatch(allUserArgs);
    const district = await this.getRkiData<RkiCovidInterface.DistrictRoot>('districts', agsObj?.ags);
    const metaData: RkiCovidInterface.Meta = district.meta;
    const districtDetails: RkiCovidInterface.Ags = district.data[agsObj!.ags];
    const stateAbbreviation = districtDetails.stateAbbreviation as RkiCovidInterface.StateAbbreviation;

    const [state, vaccinations, colorRange] = await Promise.all([
      this.getRkiData<RkiCovidInterface.DistrictRoot>('states', stateAbbreviation),
      this.getRkiData<RkiCovidInterface.VaccRoot>('vaccinations'),
      this.getRkiData<RkiCovidInterface.ColorRoot>('map', 'districts/legend')
    ]);

    const stateDetails = state.data[stateAbbreviation];
    const stateVaccData = vaccinations.data.states[stateAbbreviation];
    const infectionEmbed = this.buildInfectionEmbed(districtDetails, metaData, colorRange);
    const vaccinationEmbed = this.buildVaccinationEmbed(stateDetails, stateVaccData, metaData, colorRange);

    await command.channel.send(infectionEmbed);
    await command.channel.send(vaccinationEmbed);
  }

  private async displayGermanyData(command: CommandMessage) {
    const [germanyData, states, vaccinations, colorRanges] = await Promise.all([
      this.getRkiData<RkiCovidInterface.Ags>('germany'),
      this.getRkiData<RkiCovidInterface.DistrictRoot>('states'),
      this.getRkiData<RkiCovidInterface.VaccRoot>('vaccinations'),
      this.getRkiData<RkiCovidInterface.ColorRoot>('map', 'districts/legend')
    ]);

    const totalPopulation = Object.keys(states.data)
      .map(key => states.data[key].population)
      .reduce((acc, curr) => acc + curr);

    germanyData.population = totalPopulation; // monkey patching the german population

    await command.channel.send({
      embed: {
        color: this.getIncidentColor(colorRanges, germanyData?.weekIncidence)?.color || '#000',
        title: `Aktuelle COVID Daten für \`Deutschland\``,
        fields: [
          ...this.buildCovidInfos(germanyData),
          ...this.buildVaccInfos(vaccinations.data, { population: germanyData.population })
        ],
        footer: {
          text: `Quelle: ${germanyData.meta!.source} | Letztes Update: ${this.formatDate(germanyData.meta!.lastUpdate)}`
        }
      }
    });
  }

  private buildInfectionEmbed(
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

  private buildVaccinationEmbed(
    state: RkiCovidInterface.Ags,
    vaccData: RkiCovidInterface.VaccData | RkiCovidInterface.State,
    meta: RkiCovidInterface.Meta,
    colorRange: RkiCovidInterface.ColorRoot
  ): MessageOptions {
    return {
      embed: {
        color: this.getIncidentColor(colorRange, state?.weekIncidence)?.color || '#000',
        title: `Aktuelle Daten für das entsprechende Bundesland \`${state?.name}\``,
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
        value: colorText('blue', `[${(location?.weekIncidence).toLocaleString()}]`),
        inline: false
      },
      { name: this.zeroWidthSpace, value: this.zeroWidthSpace, inline: false },
      { name: '**Unterschied zu gestern**', value: '▬▬▬▬▬▬▬▬▬▬', inline: false },
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
      { name: this.zeroWidthSpace, value: this.zeroWidthSpace, inline: false },
      { name: '**Insgesamt (in %)**', value: '▬▬▬▬▬▬▬▬▬▬', inline: false },
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
      { name: this.zeroWidthSpace, value: this.zeroWidthSpace, inline: false }
    ];
  }

  private buildVaccInfos(
    vaccData: RkiCovidInterface.VaccData | RkiCovidInterface.State,
    location: { population: number }
  ): EmbedField[] {
    return [
      { name: '**Impfungen**', value: '▬▬▬▬▬▬▬▬▬▬', inline: false },
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
      { name: this.zeroWidthSpace, value: this.zeroWidthSpace, inline: false }
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
