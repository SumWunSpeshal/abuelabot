export abstract class NotFoundEvent {
  // @CommandNotFound()
  async notFound(command: any) {
    await command.reply('Command not found! Type `!help` to learn more about all the commands I know.');
  }
}
