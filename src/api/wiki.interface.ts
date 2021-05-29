export interface IWiki {
  batchcomplete: string;
  query: Query;
}

export interface Normalized {
  from: string;
  to: string;
}

export interface PageExtract {
  pageid: number;
  ns: number;
  title: string;
  extract: string;
}

export interface PageInfo {
  pageid: number,
  ns: number,
  title: string,
  contentmodel: string,
  pagelanguage: string,
  pagelanguagehtmlcode: string,
  pagelanguagedir: string,
  touched: string,
  lastrevid: number,
  length: number,
  talkid: number,
  fullurl: string,
  editurl: string,
  canonicalurl: string
}

export interface Pages {
  [key: string]: PageExtract | PageInfo;
}

export interface Query {
  normalized: Normalized[];
  pages: Pages;
}
