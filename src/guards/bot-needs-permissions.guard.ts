/**
 * @description
 * FIXME Haven't tested this yet. Might not work, dunno.
 *
 * @param _permissions
 * @constructor
 */
// export const BotNeedsPermissionsGuard = (_permissions: PermissionString[]): GuardFunction<'commandMessage'> => {
//   return async ([message], client, next) => {
//     const voiceChannel = message?.member?.voice?.channel;
//     const permissions = voiceChannel?.permissionsFor(message.client.user!);
//
//     if (permissions?.has(_permissions)) {
//       await next();
//     } else {
//       const permsString = (_permissions as string[]).reduce((acc, curr) => acc + ', ' + curr);
//       await message.channel.send(`AbuelaBot does not have some or all of these permissions: \`${permsString}\``);
//     }
//   };
// };
