/** Responsible for creating populated ActionSets, Actions and Responses. */

import {
  DefaultMap,
  defaultMapGetPlayer,
  defaultMapSetPlayer,
  PlayerIndex,
} from "isaacscript-common";
import { ActionSet } from "../../classes/corruption/actionSets/ActionSet";
import { DEFAULT_ACTION_SET_BUILDER_REFERENCE } from "../../constants/corruptionConstants";
import { ActionSetBuilderReference } from "../../enums/corruption/actionSets/ActionSetBuilders";
import { ActionSetBuilderInput } from "../../interfaces/corruption/actionSets/ActionSetBuilderInput";
import { getActionSetBuilderFromReference } from "../../maps/builders/actionSetBuilderMap";
import { mod } from "../../mod";
import { ActionSetBuilder } from "../../types/general/Builder";

const v = {
  run: {
    actionSetBuilderReference: new DefaultMap<
      PlayerIndex,
      ActionSetBuilderReference
    >(DEFAULT_ACTION_SET_BUILDER_REFERENCE),
  },
};

export function corruptionGenerationInit(): void {
  mod.saveDataManager("corruptionGeneration", v);
}

/**
 * Set the players' ActionSetBuilderReference. This will be used when the game is inverted and an
 * inverted item is looking for an ActionSet.
 */
export function setPlayerActionSetBuilderReference(
  player: EntityPlayer,
  reference: ActionSetBuilderReference,
): void {
  defaultMapSetPlayer(v.run.actionSetBuilderReference, player, reference);
}

/**
 * Gets the players' ActionSetBuilderReference. This will be used when the game is inverted and an
 * inverted item is looking for an ActionSet. You should probably use generateActionSetFromPlayer()
 * instead.
 */
export function getPlayerActionSetBuilderReference(
  player: EntityPlayer,
): ActionSetBuilderReference {
  return defaultMapGetPlayer(v.run.actionSetBuilderReference, player);
}

/** Generates an ActionSet from an ActionSetBuilderReference. */
export function generateActionSetFromReference(
  actionSetBuilder: ActionSetBuilderReference,
  inputs?: ActionSetBuilderInput,
): ActionSet {
  return getActionSetBuilderFromReference(actionSetBuilder)(inputs);
}

/** Generates an ActionSet depending on if the input is an ActionSetReference or ActionBuilder. */
export function generateActionSetFromReferenceOrBuilder(
  referenceOrBuilder: ActionSetBuilderReference | ActionSetBuilder,
  inputs?: ActionSetBuilderInput,
): ActionSet {
  if (typeof referenceOrBuilder === "function") {
    return referenceOrBuilder(inputs);
  }
  return generateActionSetFromReference(referenceOrBuilder, inputs);
}

/**
 * Generates an ActionSet based on the players' ActionSetBuilderReference. Will always include the
 * player as an Input.
 */
export function generateActionSetFromPlayer(
  player: EntityPlayer,
  inputs: ActionSetBuilderInput = {},
): ActionSet {
  inputs.player ??= player;
  return generateActionSetFromReference(
    defaultMapGetPlayer(v.run.actionSetBuilderReference, player),
    inputs,
  );
}

/** Generates an ActionSet from the default ActionSetBuilderReference. */
export function generateDefaultActionSet(
  inputs?: ActionSetBuilderInput,
): ActionSet {
  return generateActionSetFromReference(
    DEFAULT_ACTION_SET_BUILDER_REFERENCE,
    inputs,
  );
}
