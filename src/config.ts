import { config } from "dotenv";
config();

type SetupConfig = {
  token: string;
  prefix: string;
  giphyKey: string;
};

const SETUP_CONFIG: SetupConfig = {
  token: process.env.BOT_TOKEN!,
  prefix: process.env.PREFIX!,
  giphyKey: process.env.GIPHY_KEY!
};

export default SETUP_CONFIG;
