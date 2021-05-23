import { config } from 'dotenv';

config();

export type EnvironmentOptions = 'PROD' | 'DEV';

export type SetupConfig = {
  env: EnvironmentOptions;
  token: string;
  devToken: string;
  prefix: string;
  giphyKey: string;
  descriptionFlag: string;
  imgFlipUser: string;
  imgFlipPw: string;
  w2gKey: string;
  ytKey: string;
};

const SETUP_CONFIG: SetupConfig = {
  env: process.env.ENV! as EnvironmentOptions,
  token: process.env.BOT_TOKEN!,
  devToken: process.env.DEV_BOT_TOKEN!,
  prefix: process.env.PREFIX!,
  giphyKey: process.env.GIPHY_KEY!,
  descriptionFlag: process.env.EXTENDED_DESCRIPTION_FLAG!,
  imgFlipUser: process.env.IMGFLIP_USER!,
  imgFlipPw: process.env.IMGFLIP_PW!,
  w2gKey: process.env.W2G_KEY!,
  ytKey: process.env.YT_KEY!
};

export default SETUP_CONFIG;
