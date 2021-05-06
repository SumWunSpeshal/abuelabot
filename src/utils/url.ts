export abstract class Url {
  /**
   * @description
   * Simple method to stitch together a URL, while making sure that the arguments are url-compliant first.
   * Use this as a tagged template. It's the fun way 🙃
   *
   * @param stringPartials
   * @param snippets
   */
  static encode(stringPartials: TemplateStringsArray, ...snippets: string[]): string {
    const encoded = snippets.map(snippet => encodeURIComponent(snippet));
    return stringPartials.map((stringPartial, inx) => stringPartial + (encoded[inx] || '')).join('');
  }
}
