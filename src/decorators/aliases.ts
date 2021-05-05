import { DCommand, DDiscord, Expression, MetadataStorage, Modifier, Rule, Rules } from '@typeit/discord';

export function Aliases(...aliases: Expression[]) {
  return (target: any, key?: string, descriptor?: PropertyDescriptor) => {
    aliases.forEach(alias => {
      MetadataStorage.instance.addModifier(
        Modifier
          .createModifier<DCommand | DDiscord>(
            async (original) => {
              original.argsRules = [
                ...original.argsRules,
                () => [Rule(alias)]
              ];
            }
          )
          .decorateUnknown(
            target,
            key,
            descriptor
          )
      );
    });
  };
}
