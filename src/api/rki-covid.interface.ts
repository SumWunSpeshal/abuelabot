export declare module RkiCovidInterface {
  type ApiEndPoint = 'districts' | 'states' | 'germany' | 'vaccinations' | 'map' | 'testing';

  type AgsString = string; // FIXME find a way to type this as 'numberstring'

  type StateAbbreviation =
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

  type AgsMap = AgsShort[];

  interface AgsShort {
    ags: AgsString;
    name: string;
  }

  interface Delta {
    cases: number;
    deaths: number;
    recovered: number;
  }

  interface Ags {
    id?: number;
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
    r?: R;
    meta?: Meta
  }
  interface R {
    value: number;
    date: Date;
  }


  interface DistrictData {
    [key: string]: Ags; // key is of type AgsString
  }

  interface Meta {
    source: string;
    contact: string;
    info: string;
    lastUpdate: Date;
    lastCheckedForUpdate: Date;
  }

  interface DistrictRoot {
    data: DistrictData;
    meta: Meta;
  }

  interface VaccRoot {
    data: VaccData;
    meta: Meta;
  }

  interface VaccData {
    administeredVaccinations: number;
    vaccinated: number;
    vaccination: VaccProduct;
    delta: number;
    quote: number;
    secondVaccination: SecondVaccination;
    indication?: Indication;
    states: States;
  }

  type States = {
    [key in StateAbbreviation]: State;
  };

  interface State {
    name: string;
    administeredVaccinations: number;
    vaccinated: number;
    vaccination: VaccProduct;
    delta: number;
    quote: number;
    secondVaccination: SecondVaccination;
    indication?: Indication;
  }

  interface VaccProduct {
    biontech: number;
    moderna: number;
    astraZeneca: number;
    janssen: number;
  }

  interface SecondVaccination {
    vaccinated: number;
    vaccination: VaccProduct;
    delta: number;
    quote: number;
  }

  interface Indication {
    age: null;
    job: null;
    medical: null;
    nursingHome: null;
    secondVaccination: {}; // todo
  }

  interface IncidentRange {
    min: number;
    max?: number;
    color: string;
  }

  interface ColorRoot {
    incidentRanges: IncidentRange[];
  }
}
