import { schedule } from 'node-cron';
import { CommandHelper } from '../utils/command-helper';
import { knownChannels } from '../utils/statics';

const rule = '* * * * *';

export const amongUsMondayCron = schedule(rule, async () => {
  const amongUsChannel = CommandHelper.getTextChannelById(knownChannels.AMONG_US);

  if (amongUsChannel) {
    await amongUsChannel.send(`my cronjob is working. I found the amongus channel all by myself and I can now send scheduled messages`);
  }
});
