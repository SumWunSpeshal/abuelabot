/**
 * @description
 * Simple function to stitch together a URL, while making sure that the arguments are url-compliant first.
 * Use it as a tagged template. It's the fun way 🙃
 *
 * @param stringPartials
 * @param snippets
 */
export const url = (stringPartials: TemplateStringsArray, ...snippets: string[]): string => {
  const encoded = snippets.map(snippet => encodeURIComponent(snippet));
  return stringPartials.map((stringPartial, inx) => stringPartial + (encoded[inx] || '')).join('');
};

/**
 * @description
 * Use as higher order function to specify delimiter.
 * FIXME This is crap and not useful yet. DO NOT USE.
 *
 * @param delimiter
 */
type Delimiter = '-' | '.' | '_' | '&';

export const __ucFirst = (delimiter: Delimiter = '-') => {
  return (stringPartials: TemplateStringsArray, ...snippets: string[]) => {
    return stringPartials
      .map(item => {
        return item
          .split(delimiter)
          .map(word => {
            const [firstLetter, ...rest] = word;
            return firstLetter.toUpperCase() + rest.join('');
          })
          .join(delimiter);
      })
      .join('');
  };
};

export const format = (open: string, close?: string) => {
  return (stringPartials: TemplateStringsArray, ...snippets: string[]): string => {
    const ret = stringPartials
      .map((item, index) => item + (snippets[index] ? open + snippets[index] + (close || open) : ''))
      .join('');
    return ret;
  };
};
