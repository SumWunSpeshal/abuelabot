import { DCommand, DDiscord, Expression, MetadataStorage, Modifier, Rule } from '@typeit/discord';

/**
 * @description
 * FIXME Kind of embarrassing but this WIDELY used decorator doesn't actually work correctly.
 * FIXME The aliases match anywhere in the userInput instead of just as a commandName. I can't get it to
 * FIXME work explicitly as a commandName though. I hope I will be smarter next time I look at this.
 *
 * @param aliases
 * @constructor
 */
export function Aliases(aliases: Expression[] | string[]) {
  return (target: any, key?: string, descriptor?: PropertyDescriptor) => {
    aliases.forEach(alias => {
      MetadataStorage.instance.addModifier(
        Modifier.createModifier<DCommand | DDiscord>(async original => {
          original.argsRules = [...original.argsRules, () => [Rule(alias)]];
        }).decorateUnknown(target, key, descriptor)
      );
    });
  };
}
