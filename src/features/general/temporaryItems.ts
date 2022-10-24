/**
 * This file aids in giving players temporary or permanent 'invisible' collectibles and trinkets
 * using the TemporaryEffects class.
 *
 * Temporary effects added to the player are removed upon leaving the room or exiting/continuing, so
 * this should be accounted for.
 *
 * Additionally, some effects do not work correctly, so the player should be given the item instead.
 *
 * Temporary effects can last the room or floor, or other lengths defined in TemporaryEffectType
 * enum.
 */

import { CollectibleType, TrinketType } from "isaac-typescript-definitions";
import {
  DefaultMap,
  defaultMapGetPlayer,
  game,
  getPlayerFromIndex,
  PlayerIndex,
  smeltTrinket,
} from "isaacscript-common";
import { TemporaryEffectType } from "../../enums/general/TemporaryEffectType";
import { mod } from "../../mod";
import { doesCollectibleEffectWork } from "../../sets/workingCollectibleEffects";

const INCLUDE_PARTLY_WORKING = true;

const v = {
  run: {
    temporaryLevelCollectibleEffects: new DefaultMap<
      PlayerIndex,
      CollectibleType[]
    >(() => []),
    temporaryLevelCollectibles: new DefaultMap<PlayerIndex, CollectibleType[]>(
      () => [],
    ),
    temporaryLevelTrinkets: new DefaultMap<PlayerIndex, TrinketType[]>(
      () => [],
    ),
    /** Temporary effects which automatically are removed next room. */
    temporaryRoomCollectibleEffects: new DefaultMap<
      PlayerIndex,
      CollectibleType[]
    >(() => []),
    /** Collectibles that are actually given to the player and removed next room. */
    temporaryRoomCollectibles: new DefaultMap<PlayerIndex, CollectibleType[]>(
      () => [],
    ),
    temporaryRoomTrinkets: new DefaultMap<PlayerIndex, TrinketType[]>(() => []),
    /**
     * Used to check if POST_NEW_ROOM_REORDERED firing is on save/continue, or actually going to a
     * new room.
     */
    roomIndex: 0,
  },
};

export function temporaryItemsInit(): void {
  mod.saveDataManager("temporaryItems", v);
}

export function temporaryItemsPostNewLevelReordered(): void {
  const currentRoomIndex = game.GetLevel().GetCurrentRoomIndex();
}

export function temporaryItemsPreNewLevel(player: EntityPlayer): void {
  removeTemporaryCollectibles(v.run.temporaryLevelCollectibles);
  removeTemporaryTrinkets(v.run.temporaryLevelTrinkets);
  v.run.temporaryLevelCollectibleEffects.forEach((value) => value.splice(0));
}

export function temporaryItemsPostNewRoomReordered(): void {
  const currentRoomIndex = game.GetLevel().GetCurrentRoomIndex();

  if (currentRoomIndex === v.run.roomIndex) {
    // If the room is the same (e.g save & continue), reapply temporary effects.
    reapplyTemporaryCollectibleEffects(v.run.temporaryRoomCollectibleEffects);
  } else {
    // If the room is different, remove temporary collectibles and trinkets.
    removeTemporaryCollectibles(v.run.temporaryRoomCollectibles);
    removeTemporaryTrinkets(v.run.temporaryRoomTrinkets);
    // Temporary effects automatically disappear so we only have to remove them from the arrays.
    v.run.temporaryRoomCollectibleEffects.forEach((value) => value.splice(0));
  }

  // Floor temporary effects need to be reapplied in every new room instance (they are removed
  // before this callback is called for the new floor).
  reapplyTemporaryCollectibleEffects(v.run.temporaryLevelCollectibleEffects);

  v.run.roomIndex = currentRoomIndex;
}

export function playerAddTemporaryTrinket(
  player: EntityPlayer,
  trinket: TrinketType,
  duration: TemporaryEffectType,
): void {
  smeltTrinket(player, trinket);
  if (duration === TemporaryEffectType.ROOM) {
    defaultMapGetPlayer(v.run.temporaryRoomTrinkets, player).push(trinket);
  } else if (duration === TemporaryEffectType.LEVEL) {
    defaultMapGetPlayer(v.run.temporaryLevelTrinkets, player).push(trinket);
  }
}

export function playerAddTemporaryCollectible(
  player: EntityPlayer,
  collectibleType: CollectibleType,
  duration: TemporaryEffectType,
): void {
  const isEffectWorking = doesCollectibleEffectWork(
    collectibleType,
    INCLUDE_PARTLY_WORKING,
  );
  if (isEffectWorking) {
    player
      .GetEffects()
      .AddCollectibleEffect(collectibleType as TemporaryCollectibleType);
    if (duration === TemporaryEffectType.ROOM) {
      defaultMapGetPlayer(v.run.temporaryRoomCollectibleEffects, player).push(
        collectibleType,
      );
    } else if (duration === TemporaryEffectType.LEVEL) {
      defaultMapGetPlayer(v.run.temporaryLevelCollectibleEffects, player).push(
        collectibleType,
      );
    }
  } else {
    player.AddCollectible(collectibleType);
    if (duration === TemporaryEffectType.ROOM) {
      defaultMapGetPlayer(v.run.temporaryRoomCollectibles, player).push(
        collectibleType,
      );
    } else if (duration === TemporaryEffectType.LEVEL) {
      defaultMapGetPlayer(v.run.temporaryLevelCollectibles, player).push(
        collectibleType,
      );
    }
  }
}

/** Temporary effects disappear upon saving and continuing, so this function reapplies them. */
function reapplyTemporaryCollectibleEffects(
  map: DefaultMap<PlayerIndex, CollectibleType[]>,
) {
  map.forEach((temporaryCollectibles, playerIndex) => {
    const player = getPlayerFromIndex(playerIndex);
    if (player !== undefined) {
      temporaryCollectibles.forEach((collectibleType) => {
        player
          .GetEffects()
          .AddCollectibleEffect(collectibleType as TemporaryCollectibleType);
      });
    }
  });
}

/**
 * Removes temporary collectibles from the player (e.g upon going to the next room). Will also
 * remove them from the appropriate array.
 */
function removeTemporaryCollectibles(
  map: DefaultMap<PlayerIndex, CollectibleType[]>,
) {
  map.forEach((collectibleTypes, playerIndex) => {
    const player = getPlayerFromIndex(playerIndex);
    if (player !== undefined) {
      collectibleTypes.forEach((collectibleType) => {
        player.RemoveCollectible(collectibleType);
      });
    }
    collectibleTypes.splice(0);
  });
}

/**
 * Removes temporary trinkets from the player (e.g upon going to the next room). Will also remove
 * them from the appropriate array.
 */
function removeTemporaryTrinkets(map: DefaultMap<PlayerIndex, TrinketType[]>) {
  map.forEach((trinketTypes, playerIndex) => {
    const player = getPlayerFromIndex(playerIndex);
    if (player !== undefined) {
      trinketTypes.forEach((trinketType) => {
        player.TryRemoveTrinket(trinketType);
      });
    }
    trinketTypes.splice(0);
  });
}
