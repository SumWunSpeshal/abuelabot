import { AbuelaCommandInfos } from '../types';
import { ActivityType, Client, CommandInteraction } from 'discord.js';
import { Choices, Description, Discord, Guard, Option, Slash } from '@typeit/discord';
import { UserNeedsPermissionsSlashGuard } from '../guards/user-needs-permissions-slash.guard';

const INFOS: AbuelaCommandInfos = {
  commandName: 'status',
  description: `[ADMINS ONLY] Set my status`,
  choices: [
    {
      Playing: 'PLAYING',
      Watching: 'WATCHING',
      Competing: 'COMPETING',
      Listening: 'LISTENING',
      Streaming: 'STREAMING'
    } as Record<string, ActivityType>
  ]
};

@Discord()
export abstract class StatusCommand {

  @Slash(INFOS.commandName)
  @Description(INFOS.description)
  @Guard(UserNeedsPermissionsSlashGuard(['ADMINISTRATOR']))
  async execute(
    @Option('status', { description: 'Set a status text', required: true })
    userInput: string,
    @Option('activity', { description: 'Set one of the available activities', required: true })
    @Choices(INFOS.choices![0])
    activity: ActivityType,
    interaction: CommandInteraction,
    client: Client
  ) {
    await client.user?.setActivity(userInput, {
      type: activity
    });

    await interaction.reply('`Status successfully set...`');
  }
}
