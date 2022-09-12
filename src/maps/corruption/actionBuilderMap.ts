import { buildDefaultAction } from "../../builders/corruption/action/defaultActionBuilder";
import { ActionBuilders } from "../../enums/corruption/actions/ActionBuilders";
import { ActionSetBuilders } from "../../enums/corruption/actionSets/ActionSetBuilders";
import { Action } from "../../interfaces/corruption/actions/Action";
import { Builder } from "../../types/general/Builder";

/** Maps ActionBuilders enum to ActionBuilders. Use MAP[ActionBuilders.DEFAULT] format. */
export const ACTION_BUILDER_MAP: Record<ActionBuilders, Builder<Action>> = {
  [ActionSetBuilders.DEFAULT]: () => buildDefaultAction(),
} as const;
