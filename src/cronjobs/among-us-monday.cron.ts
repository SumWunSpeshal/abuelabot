import { schedule } from 'node-cron';
import { CommandHelper } from '../utils/command-helper';
import { KnownEmojis, KnownGuilds, KnownRoles, KnownTextChannels } from '../utils/statics';
import { Main } from '../main';

const rule = '0 11 * * MON';

export const amongUsMondayCron = schedule(rule, async () => {
  const amongUsChannel = CommandHelper.getTextChannelById(KnownTextChannels.DISCO_BOT);

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
