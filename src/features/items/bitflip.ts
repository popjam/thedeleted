import { CollectibleType, UseFlag } from "isaac-typescript-definitions";
import { invertPlayer } from "../../helper/deletedSpecific/inversion/playerInversion";

export function bitflipPostUseItem(
  collectibleType: CollectibleType,
  rng: RNG,
  player: EntityPlayer,
  useFlags: BitFlags<UseFlag>,
  activeSlot: int,
  customVarData: int,
): boolean {
  return bitFlipUse(player);
}

/**
 * On bitflip, invert the players' inversion status. Additionally, change inversion status of all
 * pre-existing items on the floor to that of the players' new inversion status.
 */
function bitFlipUse(player: EntityPlayer): boolean {
  invertPlayer(player);
  return false;
}
