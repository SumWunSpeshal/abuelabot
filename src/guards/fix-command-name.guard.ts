import { GuardFunction } from '@typeit/discord';

/**
 * @description
 * CAUTION: This Guard is a pretty dirty workaround to enforce the correct ${commandName} on the CommandMessage
 * parameter, meaning that we monkeypatch the Discord.ts API.
 *
 * This Guard should only be used when you intend to use ${commandName}. Using this Guard anywhere does NOT affect
 * any other Classes, meaning that Classes without GuardFunction() continue to have the same wrong ${commandName}
 * coming from Discord.ts
 *
 * @param commandNames
 * @constructor
 */
export const FixCommandNameGuard = (commandNames: string[]): GuardFunction<'commandMessage'> => {
  return async ([message], client, next) => {
    const userInputSplit = message?.commandContent.toLowerCase().split(' ');
    const aliases = commandNames.map(name => name.toLowerCase());
    const match = userInputSplit.find(word => aliases.find(name => name === word));

    if (match && match.length) {
      message.commandName = match;
    }

    await next();
  };
};
