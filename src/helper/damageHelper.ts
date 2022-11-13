import { DamageFlag } from "isaac-typescript-definitions";
import { bitFlagsContainsAtLeastOneBitflags } from "./bitflagHelper";

export function isAcceptableDamage(damageFlags: BitFlags<DamageFlag>): boolean {
  return !bitFlagsContainsAtLeastOneBitflags(damageFlags, [
    DamageFlag.DEVIL,
    DamageFlag.CHEST,
    DamageFlag.IV_BAG,
    DamageFlag.NO_PENALTIES,
    DamageFlag.CURSED_DOOR,
    DamageFlag.RED_HEARTS,
  ]);
}
