/** The traditional Tainted Deleted mode. */

import { CollectibleType } from "isaac-typescript-definitions";
import { playerAddCollectible } from "isaacscript-common";

/** Initiate the player to the SOPHOS mode. */
export function sophosModeSetup(player: EntityPlayer): void {
  playerAddCollectible(player, CollectibleType.TMTRAINER);
}

/** When the player swaps out from SOPHOS mode. */
export function sophosModeFin(player: EntityPlayer): void {}
