import { GuardFunction } from '@typeit/discord';
import { PermissionString } from 'discord.js';

/**
 * @description
 * FIXME Haven't tested this yet. Might not work, dunno.
 *
 * @param _permissions
 * @constructor
 */
export const UserHasNoPermissionsForGuard = (_permissions: PermissionString[]): GuardFunction<'commandMessage'> => {
  return async ([message], client, next) => {
    const match = _permissions.find(perm => message?.member?.permissions.has(perm));

    if (match) {
      await next();
    } else {
      const permsString = (_permissions as string[]).reduce((acc, curr) => acc + ', ' + curr);
      await message.channel.send(`You don't have any of these permissions: \`${permsString}\``);
    }
  };
};
