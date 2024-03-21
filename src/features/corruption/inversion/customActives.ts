/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { getPlayerIndex, getPlayers } from "isaacscript-common";
import type { PlayerIndex } from "isaacscript-common";
import type { InvertedActiveActionSet } from "../../../classes/corruption/actionSets/Inverted/InvertedActiveActionSet";
import { mod } from "../../../mod";
import type { CollectibleType } from "isaac-typescript-definitions";
import { ActiveSlot } from "isaac-typescript-definitions";
import type { Action } from "../../../classes/corruption/actions/Action";

/**
 * This file stores data regarding players' currently held custom active items. It is used by the
 * CustomActiveFacet. A custom active item is essentially an InvertedActiveActionSet that mimics a
 * normal active item.
 *
 * A player can have a custom active item in one of four slots:
 * - PrimarySlot (always the larger active item)
 * - SecondarySlot (always the smaller active item)
 * - PocketSlot
 * - SingleUsePocketSlot
 */
const v = {
  run: {
    primarySlot: new Map<PlayerIndex, InvertedActiveActionSet | undefined>(),
    secondarySlot: new Map<PlayerIndex, InvertedActiveActionSet | undefined>(),
    pocketSlot: new Map<PlayerIndex, InvertedActiveActionSet | undefined>(),
    singleUsePocketSlot: new Map<
      PlayerIndex,
      InvertedActiveActionSet | undefined
    >(),
  },
};

export function customActivesInit(): void {
  mod.saveDataManager("customActives", v);
}

/**
 * Gets the custom active in the selected ActiveSlot:
 *
 * - PrimarySlot (always the larger active item)
 * - SecondarySlot (always the smaller active item)
 * - PocketSlot
 * - SingleUsePocketSlot
 *
 * If the player does not have a custom active in the selected slot, returns undefined.
 */
export function getCustomActiveInSlot(
  player: EntityPlayer,
  slot: ActiveSlot,
): InvertedActiveActionSet | undefined {
  const playerIndex = getPlayerIndex(player);
  switch (slot) {
    case ActiveSlot.PRIMARY: {
      return v.run.primarySlot.get(playerIndex);
    }

    case ActiveSlot.SECONDARY: {
      return v.run.secondarySlot.get(playerIndex);
    }

    case ActiveSlot.POCKET: {
      return v.run.pocketSlot.get(playerIndex);
    }

    case ActiveSlot.POCKET_SINGLE_USE: {
      return v.run.singleUsePocketSlot.get(playerIndex);
    }
  }
}

/**
 * Returns a list (ordered primary > secondary > pocket > singleUsePocket) of a players custom
 * actives (if any).
 */
export function getAllCustomActives(
  player: EntityPlayer,
): readonly InvertedActiveActionSet[] {
  const playerIndex = getPlayerIndex(player);
  return [
    v.run.primarySlot.get(playerIndex),
    v.run.secondarySlot.get(playerIndex),
    v.run.pocketSlot.get(playerIndex),
    v.run.singleUsePocketSlot.get(playerIndex),
  ].filter(
    (customActive) => customActive !== undefined,
  ) as InvertedActiveActionSet[];
}

/**
 * Retrieve all custom actives the player has in an array of tuples [ActiveSlot,
 * InvertedActiveActionSet].
 */
export function getAllCustomActivesWithSlot(
  player: EntityPlayer,
): ReadonlyArray<[ActiveSlot, InvertedActiveActionSet]> {
  const playerIndex = getPlayerIndex(player);
  const customActives: Array<[ActiveSlot, InvertedActiveActionSet]> = [];
  if (v.run.primarySlot.get(playerIndex) !== undefined) {
    customActives.push([
      ActiveSlot.PRIMARY,
      v.run.primarySlot.get(playerIndex)!,
    ]);
  }
  if (v.run.secondarySlot.get(playerIndex) !== undefined) {
    customActives.push([
      ActiveSlot.SECONDARY,
      v.run.secondarySlot.get(playerIndex)!,
    ]);
  }
  if (v.run.pocketSlot.get(playerIndex) !== undefined) {
    customActives.push([ActiveSlot.POCKET, v.run.pocketSlot.get(playerIndex)!]);
  }
  if (v.run.singleUsePocketSlot.get(playerIndex) !== undefined) {
    customActives.push([
      ActiveSlot.POCKET_SINGLE_USE,
      v.run.singleUsePocketSlot.get(playerIndex)!,
    ]);
  }
  return customActives;
}

/**
 * Sets the Custom Active in the ActiveSlot:
 *
 * - PrimarySlot (always the larger active item)
 * - SecondarySlot (always the smaller active item)
 * - PocketSlot
 * - SingleUsePocketSlot
 *
 * Will override existing CustomActiveSlot data. Does not actually add the CustomActive, use
 * addNewInvertedActiveToPlayer() for that. Does not deepCopy!
 */
export function _setCustomActiveInSlot(
  player: EntityPlayer,
  slot: ActiveSlot,
  customActive: InvertedActiveActionSet | undefined,
): void {
  const playerIndex = getPlayerIndex(player);
  switch (slot) {
    case ActiveSlot.PRIMARY: {
      v.run.primarySlot.set(playerIndex, customActive);
      break;
    }

    case ActiveSlot.SECONDARY: {
      v.run.secondarySlot.set(playerIndex, customActive);
      break;
    }

    case ActiveSlot.POCKET: {
      v.run.pocketSlot.set(playerIndex, customActive);
      break;
    }

    case ActiveSlot.POCKET_SINGLE_USE: {
      v.run.singleUsePocketSlot.set(playerIndex, customActive);
      break;
    }
  }
}

/**
 * Returns true if the player has the inverted active of the specified type, otherwise returns
 * false.
 */
export function doesPlayerHaveCustomActive(
  player: EntityPlayer,
  collectibleType: CollectibleType,
): boolean {
  const playerIndex = getPlayerIndex(player);
  return (
    v.run.primarySlot.get(playerIndex)?.getCollectibleType() ===
      collectibleType ||
    v.run.secondarySlot.get(playerIndex)?.getCollectibleType() ===
      collectibleType ||
    v.run.pocketSlot.get(playerIndex)?.getCollectibleType() ===
      collectibleType ||
    v.run.singleUsePocketSlot.get(playerIndex)?.getCollectibleType() ===
      collectibleType
  );
}

/**
 * Returns true if the player has a custom active in the specified slot, otherwise returns false.
 */
export function doesPlayerHaveCustomActiveInSlot(
  player: EntityPlayer,
  slot: ActiveSlot,
): boolean {
  const playerIndex = getPlayerIndex(player);
  switch (slot) {
    case ActiveSlot.PRIMARY: {
      return v.run.primarySlot.get(playerIndex) !== undefined;
    }

    case ActiveSlot.SECONDARY: {
      return v.run.secondarySlot.get(playerIndex) !== undefined;
    }

    case ActiveSlot.POCKET: {
      return v.run.pocketSlot.get(playerIndex) !== undefined;
    }

    case ActiveSlot.POCKET_SINGLE_USE: {
      return v.run.singleUsePocketSlot.get(playerIndex) !== undefined;
    }
  }
}

/** Returns true if the player has any custom actives. */
export function doesPlayerHaveAnyCustomActives(player: EntityPlayer): boolean {
  const playerIndex = getPlayerIndex(player);
  return (
    v.run.primarySlot.get(playerIndex) !== undefined ||
    v.run.secondarySlot.get(playerIndex) !== undefined ||
    v.run.pocketSlot.get(playerIndex) !== undefined ||
    v.run.singleUsePocketSlot.get(playerIndex) !== undefined
  );
}

/** Returns true if any player is currently holding a custom active. */
export function doesAnyPlayerHaveAnyCustomActives(): boolean {
  for (const player of getPlayers()) {
    if (doesPlayerHaveAnyCustomActives(player)) {
      return true;
    }
  }
  return false;
}

/**
 * Get the 'current charge' (the internally tracked current charge of the custom active), returns
 * undefined if the player does not have a custom active in the specified slot.
 */
export function getCustomActiveCurrentCharge(
  player: EntityPlayer,
  slot: ActiveSlot,
): number | undefined {
  const customActive = getCustomActiveInSlot(player, slot);
  if (customActive === undefined) {
    return undefined;
  }
  return customActive._getCurrentCharge();
}

/**
 * Removes an action from the custom active items of a player.
 *
 * @param player The player entity.
 * @param collectibleType The type of inverted collectible to remove the action from.
 * @param action The action to remove.
 * @returns True if the action was successfully removed, false otherwise.
 */
export function _removeActionFromCustomActive(
  player: EntityPlayer,
  collectibleType: CollectibleType,
  action: Action,
): boolean {
  const playerIndex = getPlayerIndex(player);
  const customActives = [
    v.run.primarySlot.get(playerIndex),
    v.run.secondarySlot.get(playerIndex),
    v.run.pocketSlot.get(playerIndex),
    v.run.singleUsePocketSlot.get(playerIndex),
  ];
  for (const customActive of customActives) {
    if (customActive?.getCollectibleType() === collectibleType) {
      // Check if the action exists by reference, and if so, remove it.
      const actions = customActive.getActions();
      const actionIndex = actions.indexOf(action);
      if (actionIndex !== -1) {
        actions.splice(actionIndex, 1);
        return true;
      }
    }
  }
  return false;
}
