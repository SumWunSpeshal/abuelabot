import { Command, CommandMessage, Guard, Infos } from '@typeit/discord';
import { NotBotGuard } from '../guards/not-bot.guard';
import { AbuelaCommand, AbuelaCommandInfos } from '../types';
import { NotHelpGuard } from '../guards/not-help.guard';
import { Aliases } from '../decorators/aliases';

export abstract class RichardRolleCommand implements AbuelaCommand {
  private static readonly infos: AbuelaCommandInfos = {
    description: 'This command is very usefull.',
    usage: 'type "richardrolle" and see magic happen :sparkles:',
    aliases: ['rolle', 'richard', 'richard-rolle', 'rr']
  };

  @Command('richardrolle')
  @Infos(RichardRolleCommand.infos)
  @Guard(NotHelpGuard, NotBotGuard)
  @Aliases(RichardRolleCommand.infos.aliases!)
  async execute(command: CommandMessage) {
    await command.channel.send('https://tenor.com/view/rick-ashtley-never-gonna-give-up-rick-roll-gif-4819894');
  }
}
