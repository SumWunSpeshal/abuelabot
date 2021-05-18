import { Command, CommandMessage, Guard, Infos } from '@typeit/discord';
import { NotBotGuard } from '../guards/not-bot.guard';
import { AbuelaCommandInfos } from '../types';
import { NotHelpGuard } from '../guards/not-help.guard';
import { ActivityType, Client } from 'discord.js';
import { BotNeedsPermissionsGuard } from '../guards/bot-needs-permissions.guard';
import { UserNeedsPermissionsGuard } from '../guards/user-needs-permissions.guard';
import { GetAllUserArgs } from '../decorators/get-all-user-args';
import { findBestMatch } from 'string-similarity';
import { statusTypes } from '../utils/statusTypes';

const INFOS: AbuelaCommandInfos = {
  commandName: 'status',
  description: `[ADMINS ONLY] Set my status`,
  usage: '`!status  {text} / {type?}`',
  aliases: []
};

export abstract class StatusCommand {
  @Command(INFOS.commandName)
  @Infos(INFOS)
  @Guard(NotHelpGuard, NotBotGuard, UserNeedsPermissionsGuard(['ADMINISTRATOR']))
  @GetAllUserArgs('/')
  async execute(command: CommandMessage, client: Client, allUserArgs: string[]) {
    const [text, type] = allUserArgs;

    const typeMatch = type
      ? (findBestMatch(type.toUpperCase(), statusTypes).bestMatch.target as ActivityType)
      : 'PLAYING';

    await client.user?.setActivity(text, {
      type: typeMatch,
    });

    await command.channel.send('Status successfully set...');
  }
}
