import { ActivityType } from 'discord.js';
import config from './config';
import SETUP_CONFIG from './config';

const { token, devToken } = SETUP_CONFIG;

export const statusTypes: ActivityType[] = [
  'CUSTOM_STATUS',
  'COMPETING',
  'LISTENING',
  'WATCHING',
  'PLAYING',
  'STREAMING'
];

export enum Colors {
  BLURPLE = '#7289DA'
}

export enum KnownBots {
  ABUELA_ID = '838829572681105488',
  ABUELADEV_ID = '845991359742607421'
}

export enum KnownGuilds {
  GARTENFREUNDE = '243082552783405056',
  ABUELA_PLAYGROUND_ID = '838784788260192296',
  ABUELA_ONLY_ID = '841326836545093672'
}

export enum KnownTextChannels {
  GENERAL = '243082552783405056',
  AMONG_US = '775108002658779197',
  DISCO_BOT = '838770117357469706',
  MEMES = '781559889859706910',
  COCO = '813717369851084810',
  PROGRAMMER_HUMOR = '775120271853879366'
}

export enum KnownRoles {
  AMONG_US_GANG = '789141151654739970',
  COCO = '813717094234456144',
  EVERYONE = '243082552783405056',
  SUPER_DUPER_PERMISSIONS = '243089075530104834'
}

export enum CustomEvents {
  MANUAL_HELP_TRIGGER = 'manual-help-trigger'
}

export enum KnownEmojis {
  JOYFUL_STAR = '347411991914217472',
  EDWAD = '347412055080435742',
  JOYFUL_SNOW = '393729686355574786',
  JOYFUL_SOB = '435013827248259073',
  OK_GOOD_COOL = '779123069394485290',
  MINION = '846027214457274378',
  TIMIHEAD = '846027388286140447',
  TIMIGLAD = '846027426843590656',
  INCHENANGRY = '846085764730322994',
  SMARTASINCHEN = '846088595580125245',
  SAHACUTE = '846091300709466134',
  SAHAPSYCHO = '846091333746556958'
}

export enum EmojiFallbacks {
  '347411991914217472' = '🙌', // jofyulStar
  '347412055080435742' = '👹', // edwad
  '393729686355574786' = '🙌', // joyfulSnow
  '435013827248259073' = '😭', // joyfulSob
  '779123069394485290' = '👌', // okgoodcool
  '846027214457274378' = '🤡', // minion
  '846027388286140447' = '💩', // timihead
  '846027426843590656' = '😃', // timiglad
  '846085764730322994' = '😡', // inchenangry
  '846088595580125245' = '🤓', // smartasinchen
  '846091300709466134' = '💁', // sahacute
  '846091333746556958' = '😬', // sahapsycho
}

export const ENV_IS_LIVE = config.env === 'PROD';

export const BOT_ID = ENV_IS_LIVE ? KnownBots.ABUELA_ID : KnownBots.ABUELADEV_ID;

export const BOT_TOKEN = ENV_IS_LIVE ? token : devToken;

export const SLASH_GUILDS = ENV_IS_LIVE ? undefined : [KnownGuilds.ABUELA_ONLY_ID];
