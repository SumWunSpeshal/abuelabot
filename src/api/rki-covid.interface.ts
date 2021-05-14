export declare module RkiCovidInterface {

  export type ApiEndPoint = 'districts' | 'states' | 'germany' | 'vaccinations' | 'map' | 'testing';

  export type AgsString = string; // FIXME find a way to type this as 'numberstring'

  export type StateAbbreviation =
    | 'BW'
    | 'BY'
    | 'BE'
    | 'BB'
    | 'HB'
    | 'HH'
    | 'HE'
    | 'MV'
    | 'NI'
    | 'NW'
    | 'RP'
    | 'SL'
    | 'SN'
    | 'ST'
    | 'SH'
    | 'TH'
    | 'Bund';

  export type AgsMap = AgsShort[];

  export interface AgsShort {
    ags: AgsString;
    name: string;
  }

  export interface Delta {
    cases: number;
    deaths: number;
    recovered: number;
  }

  export interface Ags {
    id?: number,
    ags?: AgsString;
    name: string;
    county: string;
    state: string;
    population: number;
    cases: number;
    deaths: number;
    casesPerWeek: number;
    deathsPerWeek: number;
    stateAbbreviation: string;
    recovered: number;
    weekIncidence: number;
    casesPer100k: number;
    delta: Delta;
  }

  export interface DistrictData {
    [key: string]: Ags; // key is of type AgsString
  }

  export interface Meta {
    source: string;
    contact: string;
    info: string;
    lastUpdate: Date;
    lastCheckedForUpdate: Date;
  }

  export interface DistrictRoot {
    data: DistrictData;
    meta: Meta;
  }

  export interface VaccRoot {
    data: VaccData;
    meta: Meta;
  }

  export interface VaccData {
    administeredVaccinations: number;
    vaccinated: number;
    vaccination: VaccProduct;
    delta: number;
    quote: number;
    secondVaccination: SecondVaccination;
    indication?: Indication;
    states: States;
  }

  export type States = {
    [key in StateAbbreviation]: State;
  };

  export interface State {
    name: string,
    administeredVaccinations: number,
    vaccinated: number,
    vaccination: VaccProduct,
    delta: number,
    quote: number,
    secondVaccination: SecondVaccination,
    indication?: Indication;
  }

  export interface VaccProduct {
    biontech: number;
    moderna: number;
    astraZeneca: number;
    janssen: number;
  }

  export interface SecondVaccination {
    vaccinated: number;
    vaccination: VaccProduct;
    delta: number;
    quote: number;
  }

  export interface Indication {
    age: null;
    job: null;
    medical: null;
    nursingHome: null;
    secondVaccination: {}; // todo
  }

  export interface IncidentRange {
    min: number;
    max?: number;
    color: string;
  }

  export interface ColorRoot {
    incidentRanges: IncidentRange[];
  }
}
