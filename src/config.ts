import { config } from 'dotenv';

config();

export type SetupConfig = {
  token: string;
  prefix: string;
  giphyKey: string;
  descriptionFlag: string;
  imgFlipUser: string;
  imgFlipPw: string;
};

const SETUP_CONFIG: SetupConfig = {
  token: process.env.BOT_TOKEN!,
  prefix: process.env.PREFIX!,
  giphyKey: process.env.GIPHY_KEY!,
  descriptionFlag: process.env.EXTENDED_DESCRIPTION_FLAG!,
  imgFlipUser: process.env.IMGFLIP_USER!,
  imgFlipPw: process.env.IMGFLIP_PW!
};

export default SETUP_CONFIG;
