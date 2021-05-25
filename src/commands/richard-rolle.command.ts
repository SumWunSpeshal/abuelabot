import { AbuelaCommand, AbuelaCommandInfos } from '../types';

const INFOS: AbuelaCommandInfos = {
  commandName: 'richardrolle',
  description: 'This command is very usefull.',
  usage: 'type "richardrolle" and see magic happen :sparkles:',
  aliases: ['rolle', 'richard', 'richard-rolle', 'rr']
};

export abstract class RichardRolleCommand implements AbuelaCommand {

  // @Command(INFOS.commandName)
  // @Infos(INFOS)
  // @Guard(NotHelpGuard, NotBotGuard)
  // @Aliases(INFOS.aliases)
  async execute(command: any) {
    await command.channel.send('https://tenor.com/view/rick-ashtley-never-gonna-give-up-rick-roll-gif-4819894');
  }
}
