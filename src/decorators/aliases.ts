import { DCommand, DDiscord, Expression, MetadataStorage, Modifier, Rule } from '@typeit/discord';

/**
 * @description
 *
 * @param aliases
 * @constructor
 */
export function Aliases(aliases: Expression[] | string[]) {
  return (target: any, key?: string, descriptor?: PropertyDescriptor) => {
    aliases.forEach(alias => {
      MetadataStorage.instance.addModifier(
        Modifier.createModifier<DCommand | DDiscord>(async original => {
          // original.argsRules = [...original.argsRules, () => [Rule(alias + '(\\s{1,}|$)')]];
          original.argsRules = [...original.argsRules, () => [Rule(alias).spaceOrEnd()]];
        }).decorateUnknown(target, key, descriptor)
      );
    });
  };
}
