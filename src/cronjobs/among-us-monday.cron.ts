import { schedule } from 'node-cron';
import { CommandHelper } from '../utils/command-helper';
import { KnownEmojis, KnownRoles, KnownTextChannels } from '../utils/statics';

const rule = '0 12 * * MON';

export const amongUsMondayCron = schedule(rule, async () => {
  const amongUsChannel = CommandHelper.getTextChannelById(KnownTextChannels.AMONG_US);

  if (!amongUsChannel) {
    return;
  }

  const msg = await amongUsChannel.send(
    `${CommandHelper.mention(KnownRoles.AMONG_US_GANG)} Wer ist heute am Start? :eye: :lips: :eye:`
  );

  await msg.react(KnownEmojis.JOYFUL_STAR);
  await msg.react(KnownEmojis.OK_GOOD_COOL);
});
