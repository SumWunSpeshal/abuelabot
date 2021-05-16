import { GuardFunction } from '@typeit/discord';

export const NotInVoiceChannelGuard: GuardFunction<'message'> = async ([message], client, next) => {
  const voiceChannel = message?.member?.voice?.channel;
  if (voiceChannel) {
    await next();
  }
};
