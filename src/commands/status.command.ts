import { AbuelaCommand, AbuelaCommandInfos } from '../types';
import { ActivityType, Client, CommandInteraction } from 'discord.js';
import { findBestMatch } from 'string-similarity';
import { statusTypes } from '../utils/statics';
import { Choices, Description, Discord, Option, Slash } from '@typeit/discord';

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
  async execute(
    @Option('status', { description: 'Set a status text', required: true })
    userInput: string,
    @Option('activity', { description: 'Set one of the available activities', required: true })
    @Choices(INFOS.choices![0])
    activity: string,
    interaction: CommandInteraction,
    client: Client
  ) {
    const typeMatch = activity
      ? (findBestMatch(activity.toUpperCase(), statusTypes).bestMatch.target as ActivityType)
      : 'PLAYING';

    await client.user?.setActivity(userInput, {
      type: typeMatch
    });

    await interaction.reply('`Status successfully set...`');
  }
}
