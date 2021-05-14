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
  private static readonly baseUrl = 'https://api.corona-zahlen.org/';

  private static readonly agsMap: RkiCovidInterface.AgsMap = JSON.parse(
    readFileSync(Path.join(__dirname, '..', 'assets', 'german-districts.json')).toString()
  );

  private static readonly zeroWidthSpace = '\u200b';

  @Command(INFOS.commandName)
  @Infos(INFOS)
  @Guard(NotHelpGuard, NotBotGuard)
  @Aliases(INFOS.aliases)
  @GetAllUserArgs()
  async execute(command: CommandMessage, client: Client, allUserArgs: string) {
    if (!allUserArgs) {
      await CovidCommand.displayGermanyData(command);
      return;
    }

    const agsObj: RkiCovidInterface.AgsShort | undefined = CovidCommand.getClosestDistrictMatch(allUserArgs);
    const district = await CovidCommand.getRkiData<RkiCovidInterface.DistrictRoot>('districts', agsObj?.ags);
    const metaData: RkiCovidInterface.Meta = district.meta;
    const districtDetails: RkiCovidInterface.Ags = district.data[agsObj!.ags];
    const stateAbbreviation = districtDetails.stateAbbreviation as RkiCovidInterface.StateAbbreviation;

    const [state, vaccinations, colorRange] = await Promise.all([
      CovidCommand.getRkiData<RkiCovidInterface.DistrictRoot>('states', stateAbbreviation),
      CovidCommand.getRkiData<RkiCovidInterface.VaccRoot>('vaccinations'),
      CovidCommand.getRkiData<RkiCovidInterface.ColorRoot>('map', 'districts/legend')
    ]);

    const stateDetails = state.data[stateAbbreviation];
    const stateVaccData = vaccinations.data.states[stateAbbreviation];
    const infectionEmbed = CovidCommand.buildInfectionEmbed(districtDetails, metaData, colorRange);
    const vaccinationEmbed = CovidCommand.buildVaccinationEmbed(stateDetails, stateVaccData, metaData, colorRange);

    await command.channel.send(infectionEmbed);
    await command.channel.send(vaccinationEmbed);
  }

  static async displayGermanyData(command: CommandMessage) {
    const [germanyData, colorRanges] = await Promise.all([
      CovidCommand.getRkiData<RkiCovidInterface.Ags>('germany'),
      CovidCommand.getRkiData<RkiCovidInterface.ColorRoot>('map', 'districts/legend')
    ]);

    germanyData.population = 83756658; // fixme kek

    await command.channel.send({
      embed: {
        color: CovidCommand.getIncidentColor(colorRanges, germanyData?.weekIncidence)?.color || '#000',
        title: `Aktuelle COVID Daten für \`Deutschland\``,
        fields: [...CovidCommand.buildCovidInfos(germanyData)],
        footer: {
          text: `Quelle: ${germanyData.meta!.source} | Letztes Update: ${CovidCommand.formatDate(germanyData.meta!.lastUpdate)}`
        }
      }
    });
  }

  static buildInfectionEmbed(
    district: RkiCovidInterface.Ags,
    meta: RkiCovidInterface.Meta,
    colorRange: RkiCovidInterface.ColorRoot
  ): MessageOptions {
    const incidentColor = CovidCommand.getIncidentColor(colorRange, district?.weekIncidence);

    return {
      embed: {
        color: incidentColor?.color || '#000',
        title: `Aktuelle COVID Daten für \`${district.name}\``,
        fields: [...CovidCommand.buildCovidInfos(district)],
        footer: {
          text: `Quelle: ${meta.source} | Letztes Update: ${CovidCommand.formatDate(meta.lastUpdate)}`
        }
      }
    };
  }

  static buildVaccinationEmbed(
    state: RkiCovidInterface.Ags,
    vaccData: any,
    meta: RkiCovidInterface.Meta,
    colorRange: RkiCovidInterface.ColorRoot
  ): MessageOptions {
    const incidentColor = CovidCommand.getIncidentColor(colorRange, state?.weekIncidence);

    return {
      embed: {
        color: incidentColor?.color || '#000',
        title: `Aktuelle Daten für das entsprechende Bundesland \`${state?.name}\``,
        fields: [
          ...CovidCommand.buildCovidInfos(state),
          { name: '**Impfungen**', value: '▬▬▬▬▬▬▬▬▬▬', inline: false },
          {
            name: ':syringe: seit gestern',
            value: colorText('green', `[${vaccData?.delta}]`),
            inline: true
          },
          {
            name: ':one: Impfung insg. (in %)',
            value: colorText(
              'green',
              `[${vaccData?.vaccinated} (${CovidCommand.inPercent(vaccData?.vaccinated, state?.population)})]`
            ),
            inline: true
          },
          {
            name: ':two: Impfung insg. (in %)',
            value: colorText(
              'green',
              `[${vaccData?.secondVaccination.vaccinated} (${CovidCommand.inPercent(
                vaccData?.secondVaccination.vaccinated,
                state?.population
              )})]`
            ),
            inline: true
          },
          { name: CovidCommand.zeroWidthSpace, value: CovidCommand.zeroWidthSpace, inline: false }
        ],
        footer: {
          text: `Quelle: ${meta.source} | Letztes Update: ${CovidCommand.formatDate(meta.lastUpdate)}`
        }
      }
    };
  }

  static inPercent(stat: number, population: number): string {
    return `${+((stat / population) * 100).toFixed(2)}%`;
  }

  static computeEmbedFields<T extends RkiCovidInterface.Ags | RkiCovidInterface.Meta | RkiCovidInterface.State>(
    obj: T
  ): EmbedField[] {
    return Object.keys(obj)
      .filter(key => {
        const type = typeof obj[key as keyof T];
        return type === 'string' || type === 'number';
      })
      .map(key => ({ name: key, value: obj[key as keyof T], inline: false })) as any;
  }

  static formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('de-DE', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  static buildCovidInfos(location: RkiCovidInterface.Ags) {
    return [
      { name: 'Wocheninzidenz', value: colorText('blue', `[${location?.weekIncidence}]`), inline: false },
      { name: CovidCommand.zeroWidthSpace, value: CovidCommand.zeroWidthSpace, inline: false },
      { name: '**Unterschied zu gestern**', value: '▬▬▬▬▬▬▬▬▬▬', inline: false },
      {
        name: ':four_leaf_clover: Δ Genesen',
        value: colorText('green', `[${location?.delta?.recovered}]`),
        inline: true
      },
      { name: ':microbe: Δ Fälle', value: colorText('yellow', `[${location?.delta?.cases}]`), inline: true },
      { name: ':skull: Δ Tode', value: colorText('red', `[${location?.delta?.deaths}]`), inline: true },
      { name: CovidCommand.zeroWidthSpace, value: CovidCommand.zeroWidthSpace, inline: false },
      { name: '**Insgesamt (in %)**', value: '▬▬▬▬▬▬▬▬▬▬', inline: false },
      {
        name: ':four_leaf_clover: Genesen',
        value: colorText(
          'green',
          `[${location?.recovered} (${CovidCommand.inPercent(location?.recovered, location?.population)})]`
        ),
        inline: true
      },
      {
        name: ':microbe: Fälle',
        value: colorText(
          'yellow',
          `[${location?.cases} (${CovidCommand.inPercent(location?.cases, location?.population)})]`
        ),
        inline: true
      },
      {
        name: ':skull: Tode',
        value: colorText(
          'red',
          `[${location?.deaths} (${CovidCommand.inPercent(location?.deaths, location?.population)})]`
        ),
        inline: true
      },
      { name: CovidCommand.zeroWidthSpace, value: CovidCommand.zeroWidthSpace, inline: false }
    ];
  }

  static async getRkiData<T>(endPoint: RkiCovidInterface.ApiEndPoint, arg?: string | undefined): Promise<T> {
    return Http.fetch<T>(`${CovidCommand.baseUrl + endPoint}/${arg || ''}`);
  }

  static getClosestDistrictMatch(userInput: string): RkiCovidInterface.AgsShort | undefined {
    const districts = CovidCommand.agsMap.map(item => item.name);
    const { bestMatch } = findBestMatch(CommandHelper.ucFirstLetterOfWords(userInput), districts);
    return CovidCommand.agsMap.find(item => item.name === bestMatch?.target);
  }

  static getIncidentColor(
    colorMap: RkiCovidInterface.ColorRoot,
    incidence: number
  ): RkiCovidInterface.IncidentRange | undefined {
    return colorMap.incidentRanges.find(item => incidence >= item.min! && incidence <= item.max!);
  }
}
