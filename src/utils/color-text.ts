export type Colors = {
  [key in 'blue' | 'yellow' | 'dark_yellow' | 'turquoise' | 'green' | 'red']: string;
};

const languages: Colors = {
  blue: 'ini', // use with brackets
  yellow: 'fix',
  dark_yellow: 'apache',
  red: 'css', // use with brackets
  turquoise: 'bash',
  green: 'json'
};

export const colorText = (color: keyof Colors, text: string) => {
  return `\`\`\`${languages[color]}\n${text}\`\`\``;
}
