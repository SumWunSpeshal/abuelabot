import { ArgsOf, Client, Description, Discord, DiscordEvents, On, Slash } from '@typeit/discord';
import { AbuelaCommand, AbuelaCommandInfos } from '../types';
import { CommandHelper } from '../utils/command-helper';
import { CustomEvents } from '../utils/statics';
import { CommandInteraction, MessageEmbed } from 'discord.js';

const INFOS: AbuelaCommandInfos = {
  commandName: 'help',
  description: 'List all available Abuela commands',
};

@Discord()
export abstract class HelpCommand {
  private readonly headline = 'Available Commands';
  private readonly description = `Explore all Abuela's commands! If you want to know more about a specific command or its usage, type \`!{command} -h\``;

  private readonly fallbacks = {
    description: 'No description available...',
    usage: 'No usage available...',
    aliases: 'None'
  };

  @Slash(INFOS.commandName)
  @Description(INFOS.description)
  async execute(interaction: CommandInteraction) {
    const commands = (Client as any).getCommands();

    await interaction.reply(new MessageEmbed({
      title: this.headline as string,
      description: this.description,
      fields: commands.map(({ commandName, description }: any) => {
        const shortenedDescription = description
          ? description.split(' ').slice(0, 10).join(' ') + (description.split(' ').length > 10 ? ' [...]' : '')
          : '';

        return {
          name: CommandHelper.stripArgs(commandName as string),
          value: shortenedDescription || this.fallbacks.description
        };
      })
    }));
  }

  // @On('message')
  // @Guard(NotBotGuard, NotCommandGuard, NotKnownCommandGuard, HelpGuard)
  async commandDetails([message]: ArgsOf<'message'>, client: Client) {
    // await this.showDetailedHelp(message);
  }

  // @On((CustomEvents.MANUAL_HELP_TRIGGER as unknown) as DiscordEvents)
  async onManualHelpTrigger([message]: ArgsOf<'message'>) {
    // await this.showDetailedHelp(message);
  }

  // async showDetailedHelp(message: Message) {
  //   const { commandName, description, infos } = CommandHelper.getCommandName(message as CommandMessage) as CommandInfos;
  //
  //   await message.channel.send({
  //     embed: {
  //       title: commandName as string,
  //       description: description || this.fallbacks.description,
  //       fields: [
  //         {
  //           name: `Usage ('?' means the field is optional)`,
  //           value: infos?.usage || this.fallbacks.usage
  //         },
  //         {
  //           name: 'Aliases',
  //           value:
  //             infos?.aliases && infos?.aliases?.length
  //               ? infos?.aliases.map((alias: string) => '• `!' + alias + '`')
  //               : this.fallbacks.aliases
  //         }
  //       ]
  //     }
  //   });
  // }
}
