import { getPlayerIndex, getPlayers } from "isaacscript-common";
import type { PlayerIndex } from "isaacscript-common";
import type { InvertedActiveActionSet } from "../../../classes/corruption/actionSets/Inverted/InvertedActiveActionSet";
import { mod } from "../../../mod";
import { ActiveSlot } from "isaac-typescript-definitions";

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
export function setCustomActiveInSlot(
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
