import {
  ArgsOf,
  Client,
  Command,
  CommandInfos,
  CommandMessage,
  Guard,
  Infos,
  On
} from '@typeit/discord';
import { NotBotGuard } from '../guards/not-bot.guard';
import { AbuelaCommand } from '../types';
import { Aliases } from '../decorators/aliases';
import { NotCommandGuard } from '../guards/not-command.guard';
import { NotKnownCommandGuard } from '../guards/not-known-command.guard';
import { MessageEmbed } from 'discord.js';
import { GetAllUserArgs } from '../decorators/get-all-user-args';
import { CommandHelper } from '../utils/command-helper';
import { HelpGuard } from '../guards/help.guard';
import { code } from '../utils/tagged-templates';
import { NotHelpGuard } from '../guards/not-help.guard';

export abstract class HelpCommand implements AbuelaCommand {
  private static headline = 'Available Commands';
  private static description = `Explore all Abuela's commands! If you want to know more about a specific command or its usage, type ${code`!{command} -h`}`;
  private static descriptionFallback = 'No description available';

  @Command('help')
  @Infos({ description: 'Welp, you just found out...', usage: `...really?` })
  @Aliases('ls', 'list')
  @Guard(NotHelpGuard, NotBotGuard)
  async execute(command: CommandMessage) {
    const embed = new MessageEmbed();
    const commands = Client.getCommands();

    embed.setTitle(HelpCommand.headline);
    embed.setDescription(HelpCommand.description);

    commands.forEach(({ commandName, description }) => {
      embed.addField(
        CommandHelper.stripArgs(commandName as string),
        description || HelpCommand.descriptionFallback
      );
    });

    await command.channel.send(embed);
  }

  @On('message')
  @Guard(NotBotGuard, NotCommandGuard, NotKnownCommandGuard, HelpGuard)
  static async commandDetails([message]: ArgsOf<'message'>, client: Client) {
    const embed = new MessageEmbed();
    const { commandName, description, infos } = CommandHelper.getCommandName(
      message as CommandMessage
    ) as CommandInfos;

    if (commandName) {
      embed.setTitle(commandName);
    }

    if (description) {
      embed.setDescription(description);
    }

    if (infos?.usage) {
      embed.addField('Usage', infos?.usage);
    }

    await message.channel.send(embed);
  }
}
