import {
  game,
  getCurseIDByName,
  getGridEntities,
  getPickups,
  getPlayerTransformations,
  getRandomInt,
  getRoomType,
  hasCurse,
} from "isaacscript-common";
import { Conditional } from "../enums/general/Conditional";
import { isPlayerHoldingTrinkets } from "../helper/entityHelper/trinketHelper";
import {
  doesPlayerHaveAnyActiveItem,
  getPlayerTotalHealth,
  isPlayerHoldingCard,
  isPlayerHoldingPill,
} from "../helper/playerHelper";
import type {
  Difficulty,
  CardType,
  CollectibleType,
  LevelStage,
  PillColor,
  PlayerForm,
  PlayerType,
  RoomType,
  Direction,
} from "isaac-typescript-definitions";
import { isWorldInverted } from "../helper/deletedSpecific/inversion/worldInversionHelper";
import { isWorld } from "../helper/deletedSpecific/worlds/worldHelper";
import type { World } from "../enums/worlds/Worlds";
import { getCurses, hasAnyCurse } from "../helper/curseHelper";

const CONDITIONAL_TO_FUNCTION_MAP: ReadonlyMap<
  Conditional,
  (player: EntityPlayer, num: number) => boolean
> = new Map([
  [
    Conditional.PLAYER_HAS_X_OR_MORE_HEALTH,
    (player, num) => getPlayerTotalHealth(player) >= num,
  ],
  [
    Conditional.PLAYER_HAS_X_OR_MORE_COINS,
    (player, num) => player.GetNumCoins() >= num,
  ],
  [
    Conditional.PLAYER_HAS_X_OR_MORE_BOMBS,
    (player, num) => player.GetNumBombs() >= num,
  ],
  [
    Conditional.PLAYER_HAS_X_OR_MORE_KEYS,
    (player, num) => player.GetNumKeys() >= num,
  ],
  [
    Conditional.PLAYER_HAS_X_OR_MORE_COLLECTIBLES,
    (player, num) => player.GetCollectibleCount() >= num,
  ],
  [
    Conditional.PLAYER_HAS_TRANSFORMATION_X,
    (player, num) => getPlayerTransformations(player).has(num as PlayerForm),
  ],
  [
    Conditional.PLAYER_HOLDING_TRINKET,
    (player) => isPlayerHoldingTrinkets(player),
  ],
  [
    Conditional.PLAYER_HAS_TRINKET_X,
    (player, num) => player.HasTrinket(num, true),
  ],
  [Conditional.PLAYER_HOLDING_PILL, (player) => isPlayerHoldingPill(player)],
  [Conditional.PLAYER_HOLDING_CARD, (player) => isPlayerHoldingCard(player)],
  [
    Conditional.PLAYER_HOLDING_PILL_X,
    (player, num) => isPlayerHoldingPill(player, num as PillColor),
  ],
  [
    Conditional.PLAYER_HOLDING_CARD_X,
    (player, num) => isPlayerHoldingCard(player, num as CardType),
  ],
  [
    Conditional.PLAYER_HAS_ACTIVE_ITEM,
    (player) => doesPlayerHaveAnyActiveItem(player),
  ],
  [
    Conditional.PLAYER_HAS_COLLECTIBLE_X,
    (player, num) => player.HasCollectible(num as CollectibleType, true),
  ],
  [
    Conditional.PLAYER_IS_IN_ROOM_X,
    (_player, num) => getRoomType() === (num as RoomType),
  ],
  [
    Conditional.PLAYER_IS_ON_FLOOR_X,
    (_player, num) => game.GetLevel().GetStage() === (num as LevelStage),
  ],
  [
    Conditional.PLAYER_IS_CHARACTER_X,
    (player, num) => player.GetPlayerType() === (num as PlayerType),
  ],

  // TODO.
  [
    Conditional.PLAYER_IS_ON_LEFT_SIDE_OF_ROOM,
    (player) => player.Position.X < 320,
  ],

  [
    Conditional.PLAYER_IS_ON_X_HEALTH,
    (player, num) => getPlayerTotalHealth(player) === num,
  ],

  // TODO.
  [
    Conditional.PLAYER_HAS_X_HEART_TYPE,
    (_player, num) => getRandomInt(1, 2, undefined) === num,
  ],

  // TODO.
  [
    Conditional.PLAYER_HAS_ONLY_X_HEARTS,
    (_player, num) => getRandomInt(1, 2, undefined) === num,
  ],

  [Conditional.WORLD_IS_INVERTED, (_player, _num) => isWorldInverted()],
  [Conditional.WORLD_IS_X, (_player, num) => isWorld(num as World)],
  [
    Conditional.IS_DIFFICULTY_X,
    (_player, num) => game.Difficulty === (num as Difficulty),
  ],
  [
    Conditional.ROOM_HAS_ENEMIES,
    (_player, _num) => game.GetRoom().GetAliveEnemiesCount() > 0,
  ],
  [Conditional.ROOM_HAS_PICKUPS, (_player, _num) => getPickups().length > 0],
  [
    Conditional.ROOM_HAS_OBSTACLES,
    (_player, _num) => getGridEntities().length > 0,
  ],
  [
    Conditional.PLAYER_IS_MOVING,
    (player, _num) => player.Velocity.X !== 0 || player.Velocity.Y !== 0,
  ],
  [Conditional.PLAYER_IS_FLYING, (player, _num) => player.IsFlying()],

  // TODO: DayType enum.

  // TODO: HolidayType enum.

  [Conditional.FLOOR_IS_CURSED, (_player, _num) => hasAnyCurse()],

  // TODO: Player has only X type of heart.
]);

/**
 * Determine if a conditional is true.
 *
 * @param conditional The conditional to check.
 * @param player The player to check the conditional against. Defaults to the first player.
 * @param amount The amount to check the conditional against. If the conditional doesn't use an
 *               amount, this will be ignored. Defaults to 1.
 */
export function isConditionalSatisfied(
  conditional: Conditional,
  player: EntityPlayer = Isaac.GetPlayer(),
  amount = 1,
): boolean {
  const func = CONDITIONAL_TO_FUNCTION_MAP.get(conditional);
  if (func === undefined) {
    error(`No function for conditional ${conditional}.`);
  }
  return func(player, amount);
}
