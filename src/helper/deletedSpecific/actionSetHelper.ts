import type { InvertedActiveActionSet } from "../../classes/corruption/actionSets/Inverted/InvertedActiveActionSet";
import type { InvertedPassiveActionSet } from "../../classes/corruption/actionSets/Inverted/InvertedPassiveActionSet";
import type { NonInvertedPickupActionSet } from "../../classes/corruption/actionSets/NonInverted/NonInvertedPickupActionSet";
import { ActionSetType } from "../../enums/corruption/actionSets/ActionSetType";

/** Type guard to check if ActionSet is for an Inverted Active Item. */
export function isInvertedActiveActionSet(
  actionSet:
    | InvertedActiveActionSet
    | InvertedPassiveActionSet
    | NonInvertedPickupActionSet,
): actionSet is InvertedActiveActionSet {
  return actionSet.actionSetType === ActionSetType.INVERTED_ACTIVE_ITEM;
}

/** Type guard to check if ActionSet is for an Inverted Passive Item. */
export function isInvertedPassiveActionSet(
  actionSet:
    | InvertedActiveActionSet
    | InvertedPassiveActionSet
    | NonInvertedPickupActionSet,
): actionSet is InvertedPassiveActionSet {
  return actionSet.actionSetType === ActionSetType.INVERTED_PASSIVE_ITEM;
}

/** Type guard to check if ActionSet is for an Non-Inverted Pickup. */
export function isNonInvertedPickupActionSet(
  actionSet:
    | InvertedActiveActionSet
    | InvertedPassiveActionSet
    | NonInvertedPickupActionSet,
): actionSet is NonInvertedPickupActionSet {
  return actionSet.actionSetType === ActionSetType.NON_INVERTED_PICKUP;
}
