/** The traditional Tainted Deleted mode. */

import { PlayerTypeCustom } from "../../../enums/general/PlayerTypeCustom";
import type { Range } from "../../../types/general/Range";

const PLAYER_TYPE = PlayerTypeCustom.DELETED_BAGLE;

/** Initiate the player to the SOPHOS mode. */
export function bagleModeSetup(player: EntityPlayer): void {}

/** When the player swaps out from SOPHOS mode. */
export function bagleModeFin(player: EntityPlayer): void {}
