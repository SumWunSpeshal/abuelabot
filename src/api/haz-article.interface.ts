export interface HazArticleInterface {
  '@context': string;
  '@type': string;
  genre: string;
  datePublished: Date;
  dateModified: Date;
  keywords: string;
  thumbnailUrl: string;
  mainEntityOfPage: MainEntityOfPage;
  author: Author;
  headline: string;
  description: string;
  articleBody: string;
  isAccessibleForFree: string;
  isPartOf: IsPartOf;
  hasPart: HasPart;
  publisher: Publisher;
  image: Image;
}


export interface MainEntityOfPage {
  '@type': string;
  '@id': string;
}

export interface Author {
  '@type': string;
  name: string;
}

export interface IsPartOf {
  '@type': string[];
  name: string;
  productID: string;
}

export interface HasPart {
  '@type': string;
  isAccessibleForFree: string;
  cssSelector: string;
}

export interface Logo {
  '@type': string;
  url: string;
}

export interface Publisher {
  '@type': string;
  name: string;
  logo: Logo;
}

export interface Image {
  '@type': string;
  name: string;
  url: string;
  description: string;
  copyrightHolder: string;
  height: number;
  width: number;
}

