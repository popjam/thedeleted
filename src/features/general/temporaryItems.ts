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

import {
  CollectibleType,
  DamageFlag,
  TrinketType,
} from "isaac-typescript-definitions";
import {
  arrayRemove,
  DefaultMap,
  defaultMapGetPlayer,
  defaultMapSetPlayer,
  game,
  getPlayerFromIndex,
  PlayerIndex,
  smeltTrinket,
} from "isaacscript-common";
import { TemporaryEffectType } from "../../enums/general/TemporaryEffectType";
import { mod } from "../../mod";
import { doesCollectibleEffectWork } from "../../sets/workingCollectibleEffects";

const INCLUDE_PARTLY_WORKING = true;
const FIRST_TIME_PICKING_UP = false;

const v = {
  run: {
    permanentCollectibleEffects: new DefaultMap<PlayerIndex, CollectibleType[]>(
      () => [],
    ),
    temporaryOnHitCollectibleEffects: new DefaultMap<
      PlayerIndex,
      CollectibleType[]
    >(() => []),
    temporaryOnHitCollectibles: new DefaultMap<PlayerIndex, CollectibleType[]>(
      () => [],
    ),
    temporaryOnHitTrinkets: new DefaultMap<PlayerIndex, TrinketType[]>(
      () => [],
    ),
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

// TODO: Make function to check if Damage is from a 'hostile' source (e.g Blood Banks shouldn't remove temp items).
export function temporaryItemsPlayerTakeDMG(
  entity: Entity,
  amount: float,
  damageFlags: BitFlags<DamageFlag>,
  source: EntityRef,
  countdownFrames: int,
): boolean | undefined {
  const player = entity.ToPlayer();
  if (player === undefined) {
    return;
  }

  // Remove temporary collectibles that are on hit.
  removeTemporaryCollectiblesFromPlayer(
    v.run.temporaryOnHitCollectibles,
    player,
  );

  // Remove temporary trinkets that are on hit.
  removeTemporaryTrinketsFromPlayer(v.run.temporaryOnHitTrinkets, player);

  // Remove temporary collectible effects that are on hit.
  removeTemporaryCollectibleEffectsFromPlayer(
    v.run.temporaryOnHitCollectibleEffects,
    player,
  );
  return undefined;
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
  // On hit effects need to be reapplied.
  reapplyTemporaryCollectibleEffects(v.run.temporaryOnHitCollectibleEffects);
  /** Permanent effects need to be reapplied. */
  reapplyTemporaryCollectibleEffects(v.run.permanentCollectibleEffects);

  v.run.roomIndex = currentRoomIndex;
}

/**
 * Add a temporary trinket to the player. This will be in the form of a smelted trinket (I don't
 * think TrinketEffects work). A duration can be specified, dictating when the collectible will be
 * removed.
 *
 * Default duration is 'room'.
 */
export function playerAddTemporaryTrinket(
  player: EntityPlayer,
  trinket: TrinketType,
  duration: TemporaryEffectType = TemporaryEffectType.ROOM,
): void {
  smeltTrinket(player, trinket);
  if (duration === TemporaryEffectType.ROOM) {
    defaultMapGetPlayer(v.run.temporaryRoomTrinkets, player).push(trinket);
  } else if (duration === TemporaryEffectType.LEVEL) {
    defaultMapGetPlayer(v.run.temporaryLevelTrinkets, player).push(trinket);
  } else if (duration === TemporaryEffectType.ON_HIT) {
    defaultMapGetPlayer(v.run.temporaryOnHitTrinkets, player).push(trinket);
  }
}

/**
 * Add a temporary collectible to the player. This will either be an actual collectible, or a
 * collectible effect. A duration can be specified, dictating when the collectible will be removed.
 *
 * Default duration is 'room'. Returns true if added a collectible effect, false if added a
 * collectible.
 */
export function playerAddTemporaryCollectible(
  player: EntityPlayer,
  collectibleType: CollectibleType,
  duration: TemporaryEffectType = TemporaryEffectType.ROOM,
): boolean {
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
    } else if (duration === TemporaryEffectType.ON_HIT) {
      defaultMapGetPlayer(v.run.temporaryOnHitCollectibleEffects, player).push(
        collectibleType,
      );
    } else if (duration === TemporaryEffectType.PERMANENT) {
      defaultMapGetPlayer(v.run.permanentCollectibleEffects, player).push(
        collectibleType,
      );
    }
    return true;
  }
  player.AddCollectible(collectibleType, undefined, FIRST_TIME_PICKING_UP);
  if (duration === TemporaryEffectType.ROOM) {
    defaultMapGetPlayer(v.run.temporaryRoomCollectibles, player).push(
      collectibleType,
    );
  } else if (duration === TemporaryEffectType.LEVEL) {
    defaultMapGetPlayer(v.run.temporaryLevelCollectibles, player).push(
      collectibleType,
    );
  } else if (duration === TemporaryEffectType.ON_HIT) {
    defaultMapGetPlayer(v.run.temporaryOnHitCollectibles, player).push(
      collectibleType,
    );
  }

  return false;
}

/**
 * Remove a permanent collectible effect from the player (that is set to reapply every room). If the
 * player does not have one of the specified collectibleType, does nothing. Will only remove one if
 * the player has multiple of the same type.
 *
 * Use 'addCollectibleOrEffect()' to add.
 */
export function playerRemovePermanentCollectibleEffect(
  player: EntityPlayer,
  collectible: CollectibleType,
): void {
  const permCollectibles = defaultMapGetPlayer(
    v.run.permanentCollectibleEffects,
    player,
  );
  player.GetEffects().RemoveCollectibleEffect(collectible);
  const newArray = arrayRemove<CollectibleType>(permCollectibles, collectible);
  defaultMapSetPlayer(v.run.permanentCollectibleEffects, player, newArray);
}

/** Temporary effects disappear upon saving and continuing, so this function reapplies them. */
function reapplyTemporaryCollectibleEffects(
  map: DefaultMap<PlayerIndex, CollectibleType[]>,
) {
  map.forEach((temporaryCollectibles, playerIndex) => {
    if (temporaryCollectibles.length > 0) {
      const player = getPlayerFromIndex(playerIndex);
      if (player !== undefined) {
        temporaryCollectibles.forEach((collectibleType) => {
          player
            .GetEffects()
            .AddCollectibleEffect(collectibleType as TemporaryCollectibleType);
        });
      }
    }
  });
}

/**
 * Removes temporary collectibles from all players in the specified map (e.g upon going to the next
 * room), also updating the map.
 */
function removeTemporaryCollectibles(
  map: DefaultMap<PlayerIndex, CollectibleType[]>,
) {
  map.forEach((collectibleTypes, playerIndex) => {
    if (collectibleTypes.length > 0) {
      const player = getPlayerFromIndex(playerIndex);
      if (player !== undefined) {
        collectibleTypes.forEach((collectibleType) => {
          player.RemoveCollectible(collectibleType);
        });
      }
      collectibleTypes.splice(0);
    }
  });
}

/**
 * Removes temporary trinkets from all players in the specified map (e.g upon going to the next
 * room), also updating the map.
 */
function removeTemporaryTrinkets(map: DefaultMap<PlayerIndex, TrinketType[]>) {
  map.forEach((trinketTypes, playerIndex) => {
    if (trinketTypes.length > 0) {
      const player = getPlayerFromIndex(playerIndex);
      if (player !== undefined) {
        trinketTypes.forEach((trinketType) => {
          player.TryRemoveTrinket(trinketType);
        });
      }
      trinketTypes.splice(0);
    }
  });
}

/**
 * Removes temporary collectibles from specified players in the specified map (e.g upon being hit),
 * also updating the map.
 */
function removeTemporaryCollectiblesFromPlayer(
  map: DefaultMap<PlayerIndex, CollectibleType[]>,
  player: EntityPlayer,
) {
  const collectibleTypes = defaultMapGetPlayer(map, player);
  if (collectibleTypes.length > 0) {
    collectibleTypes.forEach((collectibleType) => {
      player.RemoveCollectible(collectibleType);
    });
    collectibleTypes.splice(0);
  }
}

/**
 * Removes temporary trinkets from specified players in the specified map (e.g upon being hit), also
 * updating the map.
 */
function removeTemporaryTrinketsFromPlayer(
  map: DefaultMap<PlayerIndex, TrinketType[]>,
  player: EntityPlayer,
) {
  const trinketTypes = defaultMapGetPlayer(map, player);
  if (trinketTypes.length > 0) {
    trinketTypes.forEach((trinketType) => {
      player.TryRemoveTrinket(trinketType);
    });
    trinketTypes.splice(0);
  }
}

function removeTemporaryCollectibleEffectsFromPlayer(
  map: DefaultMap<PlayerIndex, CollectibleType[]>,
  player: EntityPlayer,
) {
  const playerTemporaryCollectibles = defaultMapGetPlayer(map, player);
  if (playerTemporaryCollectibles.length > 0) {
    const playerEffects = player.GetEffects();
    playerTemporaryCollectibles.forEach((collectibleType) => {
      playerEffects.RemoveCollectibleEffect(collectibleType);
    });
    playerTemporaryCollectibles.splice(0);
  }
}
