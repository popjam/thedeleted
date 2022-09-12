import { buildDefaultActionSet } from "../../builders/corruption/actionSet/defaultActionSetBuilder";
import { ActionSetBuilders } from "../../enums/corruption/actionSets/ActionSetBuilders";
import { ActionSet } from "../../interfaces/corruption/actionSets/ActionSet";
import { Builder } from "../../types/general/Builder";

/** Maps ActionSetBuilders enum to ActionSetBuilders. Use MAP[ActionSetBuilders.DEFAULT] format. */
export const ACTION_SET_BUILDER_MAP: Record<
  ActionSetBuilders,
  Builder<ActionSet>
> = {
  [ActionSetBuilders.DEFAULT]: () => buildDefaultActionSet(),
} as const;
