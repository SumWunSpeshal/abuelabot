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
}
