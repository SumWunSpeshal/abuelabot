import { Discord } from '@typeit/discord';
import SETUP_CONFIG from './config';
import * as Path from 'path';
import { cronJobs } from './cronjobs';

@Discord(SETUP_CONFIG.prefix, {
  import: [Path.join(__dirname, 'commands', '*.ts'), Path.join(__dirname, 'events', '*.event.ts')]
})
export abstract class Abuela {
  protected constructor() {
    cronJobs.forEach(job => job.start());
  }
}
