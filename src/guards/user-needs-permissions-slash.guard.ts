import { CommandInteraction, PermissionString } from 'discord.js';
import { GuardFunction } from '@typeit/discord';
import { CommandHelper } from '../utils/command-helper';

/**
 * @description
 *
 * @param _permissions
 * @constructor
 */

export const UserNeedsPermissionsSlashGuard = (_permissions: PermissionString[]): GuardFunction<CommandInteraction> => {
  return async (interaction, client, next) => {
    const member = CommandHelper.getMemberById(interaction.guild!, interaction.user.id);
    const match = _permissions.find(perm => member?.permissions.has(perm));

    if (match) {
      await next();
    } else {
      const permsString = (_permissions as string[]).reduce((acc, curr) => acc + ', ' + curr);
      await interaction.reply(`You don't have any of these permissions: \`${permsString}\``, { ephemeral: true });
    }
  };
};
