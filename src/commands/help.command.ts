import { ArgsOf, Client, Command, CommandInfos, CommandMessage, Guard, Infos, On } from '@typeit/discord';
import { NotBotGuard } from '../guards/not-bot.guard';
import { AbuelaCommand, AbuelaCommandInfos } from '../types';
import { Aliases } from '../decorators/aliases';
import { NotCommandGuard } from '../guards/not-command.guard';
import { NotKnownCommandGuard } from '../guards/not-known-command.guard';
import { CommandHelper } from '../utils/command-helper';
import { HelpGuard } from '../guards/help.guard';
import { NotHelpGuard } from '../guards/not-help.guard';

export abstract class HelpCommand implements AbuelaCommand {
  private static readonly headline = 'Available Commands';
  private static readonly description = `Explore all Abuela's commands! 
  If you want to know more about a specific command or its usage, 
  type \`!{command} -h\``;

  private static readonly fallbacks = {
    description: 'No description available...',
    usage: 'No usage available...',
    aliases: 'None'
  };

  private static readonly infos: AbuelaCommandInfos = {
    description: 'Welp, you just found out...',
    usage: `...really?`,
    aliases: ['ls', 'list', 'man']
  };

  @Command('help')
  @Infos(HelpCommand.infos)
  @Aliases(HelpCommand.infos.aliases!)
  @Guard(NotHelpGuard, NotBotGuard)
  async execute(command: CommandMessage) {
    const commands = Client.getCommands();

    await command.channel.send({
      embed: {
        title: HelpCommand.headline as string,
        description: HelpCommand.description,
        fields: commands.map(({ commandName, description }) => ({
          name: CommandHelper.stripArgs(commandName as string),
          value: description || HelpCommand.fallbacks.description
        }))
      }
    });
  }

  @On('message')
  @Guard(NotBotGuard, NotCommandGuard, NotKnownCommandGuard, HelpGuard)
  static async commandDetails([message]: ArgsOf<'message'>, client: Client) {
    const { commandName, description, infos } = CommandHelper.getCommandName(message as CommandMessage) as CommandInfos;

    await message.channel.send({
      embed: {
        title: commandName as string,
        description: description || HelpCommand.fallbacks.description,
        fields: [
          {
            name: 'Usage',
            value: infos?.usage || this.fallbacks.usage
          },
          {
            name: 'Aliases',
            value:
              infos?.aliases && infos?.aliases?.length
                ? infos?.aliases.map((alias: string) => '• `!' + alias + '`')
                : HelpCommand.fallbacks.aliases
          }
        ]
      }
    });
  }
}
