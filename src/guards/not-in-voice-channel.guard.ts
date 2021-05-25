// export const NotInVoiceChannelGuard: GuardFunction<'message'> = async ([message], client, next) => {
//   const voiceChannel = message?.member?.voice?.channel;
//   if (voiceChannel) {
//     await next();
//   } else {
//     await message.reply('I need you to be in a voice channel for me to join. Enter a voice channel and I will follow you.');
//   }
// };
