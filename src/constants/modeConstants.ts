import { PlayerTypeCustom } from "../enums/general/PlayerTypeCustom";

// TODO: Make this file manual (no need to update every new PlayerType).

/** An array of PlayerType which classify under 'Normal' or 'Tainted' Deleted. */
export const PLAYER_TYPES_DELETED = [
  PlayerTypeCustom.DELETED_BASE,
  PlayerTypeCustom.DELETED_HAPPY99,
  PlayerTypeCustom.DELETED_ILOVEYOU,
  PlayerTypeCustom.DELETED_MORRIS,
  PlayerTypeCustom.T_DELETED_BASE,
];

/** An array of PlayerType which classify under 'Non-Tainted' Deleted. */
export const PLAYER_TYPES_NORMAL_DELETED = [
  PlayerTypeCustom.DELETED_BASE,
  PlayerTypeCustom.DELETED_HAPPY99,
  PlayerTypeCustom.DELETED_ILOVEYOU,
  PlayerTypeCustom.DELETED_MORRIS,
];

/** An array of PlayerType which classify under 'Tainted' Deleted. */
export const PLAYER_TYPES_TAINTED_DELETED = [PlayerTypeCustom.T_DELETED_BASE];
