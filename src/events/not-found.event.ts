import { CommandMessage, CommandNotFound } from '@typeit/discord';

export abstract class NotFoundEvent {
  @CommandNotFound()
  async notFound(command: CommandMessage) {
    await command.reply('Command not found!');
  }
}
