import { config } from "dotenv";
config();

export type SetupConfig = {
  token: string;
  prefix: string;
  giphyKey: string;
  xRapidKey: string;
};

const SETUP_CONFIG: SetupConfig = {
  token: process.env.BOT_TOKEN!,
  prefix: process.env.PREFIX!,
  giphyKey: process.env.GIPHY_KEY!,
  xRapidKey: process.env.X_RAPID_KEY!
};

export default SETUP_CONFIG;
