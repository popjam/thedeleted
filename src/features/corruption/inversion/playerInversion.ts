import {
  DefaultMap,
  getPlayerIndex,
  getPlayers,
  getRandomArrayElement,
  PlayerIndex,
} from "isaacscript-common";
import { InvertedItemActionSet } from "../../../classes/corruption/actionSets/InvertedItemActionSet";
import { ActionSetBuilderInput } from "../../../interfaces/corruption/actionSets/ActionSetBuilderInput";
import { mod } from "../../../mod";
import {
  generateDefaultInvertedItemActionSet,
  generateInvertedItemActionSetFromPlayer,
} from "../corruptionGeneration";

/**
 * Tracks player inversion status. Non-Deleted's always start off un-inverted, while some Deleted
 * modes start inverted. If any one player is inverted, the game will be in an 'inverted' state.
 * Depending on the mode, the inverted state does different things. If there are more than one
 * players inverted, the game will randomly swap between inversion effects of the modes.
 * Non-deleted's can turn inverted through items or soul stones. Deleted's that are supposed to be
 * inverted-only (e.g SPYWIPER) can turn normal if they somehow get an item such as bitflip.
 */

const v = {
  run: {
    /** Describes if the player is in corrupted form. */
    inversionStatus: new DefaultMap<PlayerIndex, boolean>(false),
  },
};

export function inversionInit(): void {
  mod.saveDataManager("inversion", v);
}

/** Returns the specified players' inversion status. */
export function isPlayerInverted(player: EntityPlayer): boolean {
  return v.run.inversionStatus.getAndSetDefault(getPlayerIndex(player));
}

/** Set the specified players' inversion status. */
export function setPlayerInversion(
  player: EntityPlayer,
  inversion: boolean,
): void {
  v.run.inversionStatus.set(getPlayerIndex(player), inversion);
}

/** Returns array of inverted players. */
export function getInvertedPlayers(): EntityPlayer[] {
  const invertedPlayers: EntityPlayer[] = [];
  for (const player of getPlayers()) {
    if (isPlayerInverted(player)) {
      invertedPlayers.push(player);
    }
  }
  return invertedPlayers;
}

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
    const chosenRandomPlayer = getRandomArrayElement(invertedPlayers);
    return generateInvertedItemActionSetFromPlayer(chosenRandomPlayer, inputs);
  }
  return generateDefaultInvertedItemActionSet(inputs);
}

/** Returns true if the Game is in an inverted state. */
export function isGameInverted(): boolean {
  return getInvertedPlayers().length > 0;
}
