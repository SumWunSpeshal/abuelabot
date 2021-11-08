import { schedule } from 'node-cron';
import { CommandHelper } from '../utils/command-helper';
import { BOT_ID, KnownEmojis, KnownGuilds, KnownRoles, KnownTextChannels } from '../statics';
import { Main } from '../main';

const rule = '00 10 * * THU';

export const amongUsThursdayCron = schedule(rule, async () => {
  const amongUsChannel = CommandHelper.getTextChannelById(KnownTextChannels.AMONG_US);

  if (!amongUsChannel) {
    return;
  }

  const timihead = Main.client.guilds.cache.get(KnownGuilds.GARTENFREUNDE)?.emojis.cache.get(KnownEmojis.TIMIHEAD);
  const msg = await amongUsChannel.send(
    `${CommandHelper.mentionRole(KnownRoles.AMONG_US_GANG)} Wer ist heute am Start? ${timihead}`
  );

  msg
    .createReactionCollector((_, user) => user.id !== msg.author.id, { dispose: true })
    .on('collect', async collected => {
      if (collected.emoji.id !== KnownEmojis.JOYFUL_STAR) {
        await collected.remove();
      } else if (collected.count && collected.count > 1 && collected.users.cache.has(BOT_ID)) {
        await collected.users.remove(BOT_ID);
      }
    })
    .on('remove', async collected => {
      if (collected.emoji.id === KnownEmojis.JOYFUL_STAR && collected.users.cache.size === 0) {
        await msg.react(KnownEmojis.JOYFUL_STAR);
      }
    });

  await msg.react(KnownEmojis.JOYFUL_STAR);
});
