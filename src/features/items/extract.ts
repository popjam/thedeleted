import { CollectibleType, UseFlag } from "isaac-typescript-definitions";
import { extractPickup } from "../../helper/deletedSpecific/items/extractHelper";
import { getClosestPickupTo } from "../../helper/entityHelper";
import { fprint } from "../../helper/printHelper";

// POST_USE_ITEM
export function extractPostUseItem(
  _collectibleType: CollectibleType,
  _rng: RNG,
  player: EntityPlayer,
  _useFlags: BitFlags<UseFlag>,
  _activeSlot: int,
  _customVarData: int,
):
  | boolean
  | { Discharge: boolean; Remove: boolean; ShowAnim: boolean }
  | undefined {
  /** Extract targets the closest pickup. */
  const closestPickup = getClosestPickupTo(player.Position);
  if (closestPickup === undefined) {
    fprint("No pickups to extract.");
    return;
  }

  extractPickup(closestPickup);
  return undefined;
}
