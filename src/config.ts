import { config } from 'dotenv';

config();

export type EnvironmentOptions = 'PROD' | 'DEV';

export type SetupConfig = {
  env: EnvironmentOptions;
  token: string;
  devToken: string;
  imgFlipUser: string;
  imgFlipPw: string;
  w2gKey: string;
  ytKey: string;
  giphyKey: string;
  cloudinary_name: string;
  cloudinary_api_key: string;
  cloudinary_api_secret: string;
};

const SETUP_CONFIG: SetupConfig = {
  env: process.env.ENV! as EnvironmentOptions,
  token: process.env.BOT_TOKEN!,
  devToken: process.env.DEV_BOT_TOKEN!,
  imgFlipUser: process.env.IMGFLIP_USER!,
  imgFlipPw: process.env.IMGFLIP_PW!,
  w2gKey: process.env.W2G_KEY!,
  ytKey: process.env.YT_KEY!,
  giphyKey: process.env.GIPHY_KEY!,
  cloudinary_name: process.env.CLOUDINARY_NAME!,
  cloudinary_api_key: process.env.CLOUDINARY_API_KEY!,
  cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET!,
};

export default SETUP_CONFIG;
