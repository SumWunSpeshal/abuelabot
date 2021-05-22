import { ActivityType } from 'discord.js';

export const statusTypes: ActivityType[] = [
  'CUSTOM_STATUS',
  'COMPETING',
  'LISTENING',
  'WATCHING',
  'PLAYING',
  'STREAMING'
];

export enum knownChannels {
  GENERAL = '243082552783405056',
  AMONG_US = '775108002658779197',
  MEMES = '781559889859706910'
}
