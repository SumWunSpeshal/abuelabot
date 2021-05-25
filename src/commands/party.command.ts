import { AbuelaCommand, AbuelaCommandInfos } from '../types';
import { setInterval } from 'timers';
import { sleep } from '../utils/sleep';
import { Random } from '../utils/random';
import { Colors, colorText } from '../utils/color-text';

const INFOS: AbuelaCommandInfos = {
  commandName: 'party',
  description: `Let's get fucking weird :sunglasses:`,
  usage: '`!party`',
  aliases: ['letsgo', 'hype', 'disco']
};

export abstract class PartyCommand implements AbuelaCommand {
  private partyBalls = ['🟢', '🟡', '🔴', '🟠', '🟣', '🔵'];

  private dancingPeople = ['💃', '🙅', '🕺', '🙆', '🤟', '🕴', '🙋', '👯'];

  // @Command(INFOS.commandName)
  // @Infos(INFOS)
  // @Guard(NotHelpGuard, NotBotGuard)
  async execute(command: any) {
    const textMsg = await command.channel.send(this.randomTextMessage());
    const emojiMsg = await command.channel.send(this.randomEmojiMessage());

    // await Promise.all([
    //   command.react(this.partyBalls[0]),
    //   command.react(this.partyBalls[1]),
    //   command.react(this.partyBalls[2])
    // ]);

    const interval = setInterval(async () => {
      // const [emoji, messageReaction]: [string, MessageReaction] = command?.reactions?.cache?.entries()?.next()?.value;

      await Promise.all([
        // messageReaction.remove(),
        // command.react(emoji),
        textMsg.edit(this.randomTextMessage()),
        emojiMsg.edit(this.randomEmojiMessage())
      ]);
    }, 1000);

    await sleep(30000);
    clearInterval(interval);
  }

  randomTextMessage() {
    const colors = ['blue', 'yellow', 'dark_yellow', 'turquoise', 'green', 'red'];
    return colorText(Random.getRandomFrom(colors) as keyof Colors, `[Disco time!]`);
  }

  randomEmojiMessage() {
    return (
      Random.getRandomFrom(this.dancingPeople) +
      Random.shuffle(this.partyBalls).reduce((acc, curr) => acc + curr) +
      Random.getRandomFrom(this.dancingPeople)
    );
  }
}
