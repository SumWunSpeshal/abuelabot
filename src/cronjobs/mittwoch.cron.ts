import { schedule } from 'node-cron';
import { CommandHelper } from '../utils/command-helper';
import { KnownTextChannels } from '../statics';
import { readdirSync } from 'fs';
import Path from 'path';
import { Random } from '../utils/random';

const rule = '0 08 * * WED';

export const mittwochCron = schedule(rule, async () => {
  const memesChannel = CommandHelper.getTextChannelById(KnownTextChannels.MEMES);

  if (!memesChannel) {
    return;
  }



  const numOfFiles = readdirSync(Path.join(__dirname, '..', 'assets', 'img', 'mittwoch')).length - 1;
  const randomNum = Random.getRandomNumBetween(1, numOfFiles);
  const img = Path.join(__dirname, '..', 'assets', 'img', 'mittwoch', `${randomNum}.jpg`);
  await memesChannel.send('Es ist Mittwoch, meine Buben :frog:', { files: [img] });
});
