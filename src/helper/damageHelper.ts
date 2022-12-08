import { DamageFlag } from "isaac-typescript-definitions";
import { bitFlagsContainsAtLeastOneBitflags } from "./bitflagHelper";

/** Damage that makes sense when triggering effects. */
export function isSensibleDamage(damageFlags: BitFlags<DamageFlag>): boolean {
  return !bitFlagsContainsAtLeastOneBitflags(damageFlags, [
    DamageFlag.DEVIL,
    DamageFlag.CHEST,
    DamageFlag.IV_BAG,
    DamageFlag.NO_PENALTIES,
    DamageFlag.CURSED_DOOR,
    DamageFlag.RED_HEARTS,
  ]);
}
