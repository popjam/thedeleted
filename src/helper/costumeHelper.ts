import {
  addCollectibleCostume,
  removeCollectibleCostume,
} from "isaacscript-common";
import { mod } from "../mod";

/** Restores all item costumes. */
export function restoreAllCostumes(player: EntityPlayer): void {
  mod.getPlayerCollectibleTypes(player).forEach((collectibleType) => {
    addCollectibleCostume(player, collectibleType);
  });
}

/** Removes all item costumes the player has. */
export function removeAllCostumes(player: EntityPlayer): void {
  mod.getPlayerCollectibleTypes(player).forEach((collectibleType) => {
    removeCollectibleCostume(player, collectibleType);
  });
}
