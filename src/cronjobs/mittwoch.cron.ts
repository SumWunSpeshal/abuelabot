import { schedule } from 'node-cron';
import { CommandHelper } from '../utils/command-helper';
import { knownChannels } from '../utils/statics';

export const mittwochCron = schedule('* * * * *', async () => {

  const memesChannel = CommandHelper.getTextChannelById(knownChannels.MEMES);

  if (memesChannel) {
    await memesChannel.send(`my cronjob is working. I found the memes channel all by myself and I can now send scheduled messages`);
  }
});
