import { config } from "dotenv";
config();

type SetupConfig = {
  token: string;
  prefix: string;
};

const SETUP_CONFIG: SetupConfig = {
  token: process.env.BOT_TOKEN!,
  prefix: process.env.PREFIX!,
};

export default SETUP_CONFIG;
