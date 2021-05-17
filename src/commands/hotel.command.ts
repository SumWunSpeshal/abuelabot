import { Command, CommandMessage, Guard, Infos } from '@typeit/discord';
import { NotBotGuard } from '../guards/not-bot.guard';
import { AbuelaCommandInfos } from '../types';
import { NotHelpGuard } from '../guards/not-help.guard';

const INFOS: AbuelaCommandInfos = {
  commandName: 'hotel',
  description: `...`,
  usage: '`!hotel`',
  aliases: []
};

export abstract class HotelCommand {

  @Command(INFOS.commandName)
  @Infos(INFOS)
  @Guard(NotHelpGuard, NotBotGuard)
  async execute(command: CommandMessage) {
    await command.channel.send(':regional_indicator_t: :regional_indicator_r: :regional_indicator_i: :regional_indicator_v: :regional_indicator_a: :regional_indicator_g: :regional_indicator_o:');
  }
}
