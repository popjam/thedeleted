import type { ActiveSlot } from "isaac-typescript-definitions";
import { fprint } from "./printHelper";

/**
 * Get the total charges of a players' active item, including any overcharged charges with the
 * Battery. Max charges possible is total charges * 2.
 */
export function getTotalCharges(player: EntityPlayer, slot: ActiveSlot): int {
  return player.GetActiveCharge(slot) + player.GetBatteryCharge(slot);
}
