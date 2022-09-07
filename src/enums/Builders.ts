import { ActionSetType } from "../interfaces/corruption/ActionSet";
import { Builder } from "../types/Builder";

export enum ActionSetBuilders {
  ACTION_SET_BUILDER_DEFAULT = "ACTION_SET_BUILDER_DEFAULT",
}

export enum ActionBuilders {
  ACTION_BUILDER_DEFAULT = "ACTION_BUILDER_DEFAULT",
}

export enum ResponseBuilders {
  RESPONSE_BUILDER_DEFAULT = "RESPONSE_BUILDER_DEFAULT",
}

export const Builders = {
  ...ActionSetBuilders,
  ...ActionBuilders,
  ...ResponseBuilders,
} as const;

export type Builders = typeof Builders;

const BUILDERS_MAP: ReadonlyMap<keyof Builders, Builder<any>> = new Map([
  [
    Builders.ACTION_SET_BUILDER_DEFAULT,
    () => ({ actionSetType: ActionSetType.STANDARD, actions: [] }),
  ],
]);

export function getBuilder<Type>(
  keyOfBuilders: keyof Builders,
): Builder<Type> | undefined {
  return BUILDERS_MAP.get(keyOfBuilders);
}
