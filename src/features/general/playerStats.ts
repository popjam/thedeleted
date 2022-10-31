import { CacheFlag } from "isaac-typescript-definitions";
import {
  addStat,
  DefaultMap,
  defaultMapGetPlayer,
  defaultMapSetPlayer,
  PlayerIndex,
} from "isaacscript-common";
import { triggerCacheUpdate } from "../../helper/statHelper";
import { mod } from "../../mod";

const STAT_CACHE_FLAGS_SET: ReadonlySet<CacheFlag> = new Set([
  CacheFlag.DAMAGE, // 1 << 0
  CacheFlag.FIRE_DELAY, // 1 << 1
  CacheFlag.SHOT_SPEED, // 1 << 2
  CacheFlag.RANGE, // 1 << 3
  CacheFlag.SPEED, // 1 << 4
  CacheFlag.LUCK, // 1 << 10
]);

/**
 * Responsible for the tracking of player stats during a run. These stats are additional stat
 * changes unique to this mod that will be applied in the EVALUATE_CACHE callback.
 *
 * These stat changes are not dynamic, so if an item gives +1 damage and you use this feature to
 * give damage, the damage will not be removed if the item is removed.
 */

const v = {
  run: {
    damage: new DefaultMap<PlayerIndex, number>(0),
    speed: new DefaultMap<PlayerIndex, number>(0),
    tears: new DefaultMap<PlayerIndex, number>(0),
    luck: new DefaultMap<PlayerIndex, number>(0),
    range: new DefaultMap<PlayerIndex, number>(0),
    shotSpeed: new DefaultMap<PlayerIndex, number>(0),
  },
};

export function playerStatsInit(): void {
  mod.saveDataManager("playerStats", v);
}

export function getStaticStat(
  player: EntityPlayer,
  cacheFlag: CacheFlag,
): number {
  if (!STAT_CACHE_FLAGS_SET.has(cacheFlag)) {
    error(
      `You cannot get a static player stat with the cache flag of: ${cacheFlag}`,
    );
  }

  switch (cacheFlag) {
    // 1 << 0
    case CacheFlag.DAMAGE: {
      return defaultMapGetPlayer(v.run.damage, player);
    }

    // 1 << 1
    case CacheFlag.FIRE_DELAY: {
      return defaultMapGetPlayer(v.run.tears, player);
    }

    // 1 << 2
    case CacheFlag.SHOT_SPEED: {
      return defaultMapGetPlayer(v.run.shotSpeed, player);
    }

    // 1 << 3
    case CacheFlag.RANGE: {
      return defaultMapGetPlayer(v.run.range, player);
    }

    // 1 << 4
    case CacheFlag.SPEED: {
      return defaultMapGetPlayer(v.run.speed, player);
    }

    // 1 << 10
    case CacheFlag.LUCK: {
      return defaultMapGetPlayer(v.run.luck, player);
    }
  }
  error("PlayerStats: CacheFlag does not exist!");
}

/**
 * Add a static stat to the player, which can be positive or negative. Call this function in any
 * callback, which will also trigger a cache evaluation. This only includes:
 *
 * CacheFlag.DAMAGE, // 1 << 0 CacheFlag.FIRE_DELAY, // 1 << 1 CacheFlag.SHOT_SPEED, // 1 << 2
 * CacheFlag.RANGE, // 1 << 3 CacheFlag.SPEED, // 1 << 4 CacheFlag.LUCK, // 1 << 10.
 *
 * To set tearColor, use addTearColorToPlayer().
 */
export function addStatToPlayer(
  player: EntityPlayer,
  cacheFlag: CacheFlag,
  amount: number,
): void {
  switch (cacheFlag) {
    // 1 << 0
    case CacheFlag.DAMAGE: {
      const newValue = defaultMapGetPlayer(v.run.damage, player) + amount;
      defaultMapSetPlayer(v.run.damage, player, newValue);
      break;
    }

    // 1 << 1
    case CacheFlag.FIRE_DELAY: {
      const newValue = defaultMapGetPlayer(v.run.tears, player) + amount;
      defaultMapSetPlayer(v.run.tears, player, newValue);
      break;
    }

    // 1 << 2
    case CacheFlag.SHOT_SPEED: {
      const newValue = defaultMapGetPlayer(v.run.shotSpeed, player) + amount;
      defaultMapSetPlayer(v.run.shotSpeed, player, newValue);
      break;
    }

    // 1 << 3
    case CacheFlag.RANGE: {
      const newValue = defaultMapGetPlayer(v.run.range, player) + amount;
      defaultMapSetPlayer(v.run.range, player, newValue);
      break;
    }

    // 1 << 4
    case CacheFlag.SPEED: {
      const newValue = defaultMapGetPlayer(v.run.speed, player) + amount;
      defaultMapSetPlayer(v.run.speed, player, newValue);
      break;
    }

    // 1 << 10
    case CacheFlag.LUCK: {
      const newValue = defaultMapGetPlayer(v.run.luck, player) + amount;
      defaultMapSetPlayer(v.run.luck, player, newValue);
      break;
    }
  }
  triggerCacheUpdate(player, cacheFlag);
}

// EVALUATE_CACHE
export function playerStatsEvaluateCache(
  player: EntityPlayer,
  cacheFlag: CacheFlag,
): void {
  if (STAT_CACHE_FLAGS_SET.has(cacheFlag)) {
    addStat(player, cacheFlag, getStaticStat(player, cacheFlag));
  }
}
