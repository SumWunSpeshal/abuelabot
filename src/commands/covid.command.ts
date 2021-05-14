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

const INFOS: AbuelaCommandInfos = {
  commandName: 'covid',
  description: 'TODO',
  usage: 'TODO with `code`',
  aliases: ['corona', 'covid19', 'sarscov2']
};

export abstract class CovidCommand implements AbuelaCommand {
  private static readonly baseUrl = 'https://api.corona-zahlen.org/';

  private static readonly agsMap: RkiCovidInterface.AgsMap = JSON.parse(
    readFileSync(Path.join(__dirname, '..', 'assets', 'german-districts.json')).toString()
  );

  private static readonly incidenceColorMap: RkiCovidInterface.ColorRoot = JSON.parse(
    readFileSync(Path.join(__dirname, '..', 'assets', 'incidence-color-map.json')).toString()
  );

  @Command(INFOS.commandName)
  @Infos(INFOS)
  @Guard(NotHelpGuard, NotBotGuard)
  @GetAllUserArgs()
  async execute(command: CommandMessage, client: Client, allUserArgs: string) {
    const agsObj: RkiCovidInterface.AgsShort | undefined = CovidCommand.getClosestDistrictMatch(allUserArgs);
    const district = await CovidCommand.getRkiData<RkiCovidInterface.DistrictRoot>('districts', agsObj?.ags);
    const metaData: RkiCovidInterface.Meta = district.meta;
    const districtDetails: RkiCovidInterface.Ags = district.data[agsObj!.ags];
    const stateAbbreviation = districtDetails.stateAbbreviation as RkiCovidInterface.StateAbbreviation;
    const state = await CovidCommand.getRkiData<RkiCovidInterface.DistrictRoot>('states', stateAbbreviation);
    const stateDetails = state.data[stateAbbreviation];
    const vaccinations = await CovidCommand.getRkiData<RkiCovidInterface.VaccRoot>('vaccinations');
    const stateVaccData = vaccinations.data.states[stateAbbreviation];
    const infectionEmbed = CovidCommand.buildInfectionEmbed(districtDetails, metaData);
    const vaccinationEmbed = CovidCommand.buildVaccinationEmbed(stateDetails, stateVaccData, metaData);

    await command.channel.send(infectionEmbed);
    await command.channel.send(vaccinationEmbed);
  }

  static buildInfectionEmbed(
    district: RkiCovidInterface.Ags,
    meta: RkiCovidInterface.Meta
  ): MessageOptions {
    const zeroWidthSpace = '\u200b';
    const incidentColor = CovidCommand.getIncidentColor(district?.weekIncidence);

    return {
      embed: {
        color: incidentColor?.color || '#000',
        title: `Aktuelle COVID Daten für \`${district.name}\``,
        fields: [
          { name: 'Wocheninzidenz', value: colorText('blue', `[${district?.weekIncidence}]`), inline: false },
          { name: zeroWidthSpace, value: zeroWidthSpace, inline: false },
          { name: '**Unterschied zu gestern**', value: '▬▬▬▬▬▬▬▬▬▬', inline: false },
          {
            name: ':four_leaf_clover: Δ Genesen',
            value: colorText('green', `[${district?.delta?.recovered}]`),
            inline: true
          },
          { name: ':microbe: Δ Fälle', value: colorText('yellow', `[${district?.delta?.cases}]`), inline: true },
          { name: ':skull: Δ Tode', value: colorText('red', `[${district?.delta?.deaths}]`), inline: true },
          { name: zeroWidthSpace, value: zeroWidthSpace, inline: false },
          { name: '**Insgesamt (in %)**', value: '▬▬▬▬▬▬▬▬▬▬', inline: false },
          {
            name: ':four_leaf_clover: Genesen',
            value: colorText(
              'green',
              `[${district?.recovered} (${CovidCommand.inPercent(district?.recovered, district?.population)})]`
            ),
            inline: true
          },
          {
            name: ':microbe: Fälle',
            value: colorText(
              'yellow',
              `[${district?.cases} (${CovidCommand.inPercent(district?.cases, district?.population)})]`
            ),
            inline: true
          },
          {
            name: ':skull: Tode',
            value: colorText(
              'red',
              `[${district?.deaths} (${CovidCommand.inPercent(district?.deaths, district?.population)})]`
            ),
            inline: true
          },

          { name: zeroWidthSpace, value: zeroWidthSpace, inline: false }
        ],
        footer: {
          text: `Quelle: ${meta.source} | Letztes Update: ${CovidCommand.formatDate(meta.lastUpdate)}`
        }
      }
    };
  }

  static buildVaccinationEmbed(
    state: RkiCovidInterface.Ags,
    vaccData: any,
    meta: RkiCovidInterface.Meta
  ): MessageOptions {
    const zeroWidthSpace = '\u200b';
    const incidentColor = CovidCommand.getIncidentColor(state?.weekIncidence);

    return {
      embed: {
        color: incidentColor?.color || '#000',
        title: `Aktuelle Daten für das entsprechende Bundesland \`${state?.name}\``,
        fields: [
          { name: 'Wocheninzidenz', value: colorText('blue', `[${state?.weekIncidence}]`), inline: false },
          { name: zeroWidthSpace, value: zeroWidthSpace, inline: false },
          { name: '**Unterschied zu gestern**', value: '▬▬▬▬▬▬▬▬▬▬', inline: false },
          {
            name: ':four_leaf_clover: Δ Genesen',
            value: colorText('green', `[${state?.delta?.recovered}]`),
            inline: true
          },
          { name: ':microbe: Δ Fälle', value: colorText('yellow', `[${state?.delta?.cases}]`), inline: true },
          { name: ':skull: Δ Tode', value: colorText('red', `[${state?.delta?.deaths}]`), inline: true },
          { name: zeroWidthSpace, value: zeroWidthSpace, inline: false },
          { name: '**Insgesamt (in %)**', value: '▬▬▬▬▬▬▬▬▬▬', inline: false },
          {
            name: ':four_leaf_clover: Genesen',
            value: colorText(
              'green',
              `[${state?.recovered} (${CovidCommand.inPercent(state?.recovered, state?.population)})]`
            ),
            inline: true
          },
          {
            name: ':microbe: Fälle',
            value: colorText(
              'yellow',
              `[${state?.cases} (${CovidCommand.inPercent(state?.cases, state?.population)})]`
            ),
            inline: true
          },
          {
            name: ':skull: Tode',
            value: colorText('red', `[${state?.deaths} (${CovidCommand.inPercent(state?.deaths, state?.population)})]`),
            inline: true
          },
          { name: zeroWidthSpace, value: zeroWidthSpace, inline: false },
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
          { name: zeroWidthSpace, value: zeroWidthSpace, inline: false }
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

  static async getRkiData<T>(endPoint: RkiCovidInterface.ApiEndPoint, arg?: string | undefined): Promise<T> {
    return Http.fetch<T>(`${CovidCommand.baseUrl + endPoint}/${arg || ''}`);
  }

  static getClosestDistrictMatch(userInput: string): RkiCovidInterface.AgsShort | undefined {
    const districts = CovidCommand.agsMap.map(item => item.name);
    const { bestMatch } = findBestMatch(CommandHelper.ucFirstLetterOfWords(userInput), districts);
    return CovidCommand.agsMap.find(item => item.name === bestMatch?.target);
  }

  static getIncidentColor(incidence: number): RkiCovidInterface.IncidentRange | undefined {
    const ranges: RkiCovidInterface.IncidentRange[] = CovidCommand.incidenceColorMap.incidentRanges;
    return ranges.find(item => incidence >= item.min! && incidence <= item.max!);
  }
}
