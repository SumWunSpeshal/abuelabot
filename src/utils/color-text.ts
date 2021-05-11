type Colors = {
  [key in 'blue' | 'yellow' | 'dark_yellow' | 'turquoise' | 'green']: string;
};

const languages: Colors = {
  blue: 'ini',
  yellow: 'fix',
  dark_yellow: 'apache',
  turquoise: 'bash',
  green: 'json'
};

export const colorText = (color: keyof Colors, text: string) => {
  return `\`\`\`${languages[color]}\n${text}\`\`\``;
}
