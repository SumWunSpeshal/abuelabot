import { mittwochCron } from './mittwoch.cron';
import { amongUsMondayCron } from './among-us-monday.cron';

export const cronJobs = [
  mittwochCron,
  amongUsMondayCron
];
