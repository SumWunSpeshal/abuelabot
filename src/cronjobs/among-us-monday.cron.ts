import { schedule } from 'node-cron';
import { CommandHelper } from '../utils/command-helper';
import { KnownEmojis, KnownGuilds, KnownRoles, KnownTextChannels } from '../statics';
import { Main } from '../main';

const rule = '00 10 * * MON';

export const amongUsMondayCron = schedule(rule, async () => {
  const amongUsChannel = CommandHelper.getTextChannelById(KnownTextChannels.AMONG_US);

  if (!amongUsChannel) {
    return;
  }

  const timihead = Main.client.guilds.cache.get(KnownGuilds.GARTENFREUNDE)?.emojis.cache.get(KnownEmojis.TIMIHEAD);
  const msg = await amongUsChannel.send(
    `${CommandHelper.mention(KnownRoles.AMONG_US_GANG)} Wer ist heute am Start? ${timihead}`
  );

  await msg.react(KnownEmojis.JOYFUL_STAR);
  await msg.react(KnownEmojis.OK_GOOD_COOL);
});
