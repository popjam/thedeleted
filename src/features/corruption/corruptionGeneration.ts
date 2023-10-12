/** Responsible for creating populated InvertedActionSets, Actions and Responses. */

import type { PlayerIndex } from "isaacscript-common";
import {
  DefaultMap,
  defaultMapGetPlayer,
  defaultMapSetPlayer,
} from "isaacscript-common";
import type { InvertedActiveActionSet } from "../../classes/corruption/actionSets/Inverted/InvertedActiveActionSet";
import { DEFAULT_INVERTED_ITEM_ACTION_SET_BUILDER_REFERENCE } from "../../constants/corruptionConstants";
import type { InvertedItemActionSetBuilderReference } from "../../enums/corruption/actionSets/ActionSetBuilders";
import type { ActionSetBuilderInput } from "../../interfaces/corruption/actionSets/ActionSetBuilderInput";
import { getInvertedItemActionSetBuilderFromReference } from "../../maps/builders/actionSetBuilderMap";
import { mod } from "../../mod";
import type { InvertedItemActionSetBuilder } from "../../types/general/Builder";

const v = {
  run: {
    actionSetBuilderReference: new DefaultMap<
      PlayerIndex,
      InvertedItemActionSetBuilderReference
    >(DEFAULT_INVERTED_ITEM_ACTION_SET_BUILDER_REFERENCE),
  },
};

export function corruptionGenerationInit(): void {
  mod.saveDataManager("corruptionGeneration", v);
}

/**
 * Set the players' ActionSetBuilderReference. This will be used when the game is inverted and an
 * inverted item is looking for an ActionSet.
 */
export function setPlayerInvertedItemActionSetBuilderReference(
  player: EntityPlayer,
  reference: InvertedItemActionSetBuilderReference,
): void {
  defaultMapSetPlayer(v.run.actionSetBuilderReference, player, reference);
}

/**
 * Gets the players' ActionSetBuilderReference. This will be used when the game is inverted and an
 * inverted item is looking for an ActionSet. You should probably use generateActionSetFromPlayer()
 * instead.
 */
function getPlayerInvertedItemActionSetBuilderReference(
  player: EntityPlayer,
): InvertedItemActionSetBuilderReference {
  return defaultMapGetPlayer(v.run.actionSetBuilderReference, player);
}

/** Generates an InvertedActiveActionSet from an InvertedItemActionSetBuilderReference. */
function generateInvertedItemActionSetFromReference(
  actionSetBuilder: InvertedItemActionSetBuilderReference,
  inputs?: ActionSetBuilderInput,
): InvertedActiveActionSet {
  return getInvertedItemActionSetBuilderFromReference(actionSetBuilder)(inputs);
}

/**
 * Generates an InvertedActiveActionSet depending on if the input is an
 * InvertedItemActionSetBuilderReference or InvertedItemActionSetBuilder.
 */
function generateInvertedItemActionSetFromReferenceOrBuilder(
  referenceOrBuilder:
    | InvertedItemActionSetBuilderReference
    | InvertedItemActionSetBuilder,
  inputs?: ActionSetBuilderInput,
): InvertedActiveActionSet {
  if (typeof referenceOrBuilder === "function") {
    return referenceOrBuilder(inputs);
  }
  return generateInvertedItemActionSetFromReference(referenceOrBuilder, inputs);
}

/**
 * Generates an ActionSet based on the players' ActionSetBuilderReference. Will always include the
 * player as an Input.
 */
export function generateInvertedItemActionSetFromPlayer(
  player: EntityPlayer,
  inputs: ActionSetBuilderInput = {},
): InvertedActiveActionSet {
  inputs.player ??= player;
  return generateInvertedItemActionSetFromReference(
    defaultMapGetPlayer(v.run.actionSetBuilderReference, player),
    inputs,
  );
}

/** Generates an ActionSet from the default ActionSetBuilderReference. */
export function generateDefaultInvertedItemActionSet(
  inputs?: ActionSetBuilderInput,
): InvertedActiveActionSet {
  return generateInvertedItemActionSetFromReference(
    DEFAULT_INVERTED_ITEM_ACTION_SET_BUILDER_REFERENCE,
    inputs,
  );
}
