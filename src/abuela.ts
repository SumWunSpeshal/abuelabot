import { Discord } from '@typeit/discord';
import SETUP_CONFIG from './config';
import * as Path from 'path';

@Discord(SETUP_CONFIG.prefix, {
  import: [
    Path.join(__dirname, 'commands', '*.ts'),
    Path.join(__dirname, 'events', '*.event.ts')
  ]
})
export abstract class Abuela {}
