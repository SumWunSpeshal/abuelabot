import { DCommand, DDiscord, Expression, MetadataStorage, Modifier, Rule } from '@typeit/discord';

export function Aliases(...aliases: Expression[]) {
  return (target: any, key?: string, descriptor?: PropertyDescriptor) => {
    MetadataStorage.instance.addModifier(
      Modifier
        .createModifier<DCommand | DDiscord>(
          async (original) => {
            original.argsRules = [
              ...original.argsRules,
              () => [Rule(aliases.join("|")).end()]
            ];
          }
        )
        .decorateUnknown(
          target,
          key,
          descriptor
        )
    );
  };
}
