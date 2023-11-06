import { getRandomArrayElement } from "isaacscript-common";
import type { InvertedItemActionSet } from "../../../classes/corruption/actionSets/Inverted/InvertedItemActionSet";
import {
  generateDefaultInvertedItemActionSet,
  generateInvertedItemActionSetFromPlayer,
} from "../../../features/corruption/corruptionGeneration";
import {
  getInvertedPlayers,
  isGameInverted,
} from "../../../features/corruption/inversion/playerInversion";
import type { ActionSetBuilderInput } from "../../../interfaces/corruption/actionSets/ActionSetBuilderInput";

/**
 * Returns an InvertedItemActionSet based on the game circumstances. If the game is inverted,
 * randomly chooses between inverted players to generate an ActionSet based on their preferences.
 * Otherwise, uses a default ActionSetBuilder.
 */
export function getGameInvertedItemActionSet(
  inputs?: ActionSetBuilderInput,
): InvertedItemActionSet {
  if (isGameInverted()) {
    const invertedPlayers = getInvertedPlayers();
    const chosenRandomPlayer = getRandomArrayElement(
      invertedPlayers,
      undefined,
    );
    return generateInvertedItemActionSetFromPlayer(chosenRandomPlayer, inputs);
  }
  return generateDefaultInvertedItemActionSet(inputs);
}
