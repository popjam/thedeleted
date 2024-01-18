import { DamageFlag } from "isaac-typescript-definitions";

const DAMAGE_FLAG_TEXT_MAP: ReadonlyMap<DamageFlag, string> = new Map([
  [DamageFlag.ACID, "Acid"],
  [DamageFlag.BOOGER, "Booger tears"],
  [DamageFlag.CHEST, "Spiked chests"],
  [DamageFlag.CLONES, "Clones"],
  [DamageFlag.COUNTDOWN, "Countdown"],
  [DamageFlag.CRUSH, "Being crushed"],
  [DamageFlag.CURSED_DOOR, "Cursed room doors"],
  [DamageFlag.DEVIL, "Devil deals"],
  [DamageFlag.EXPLOSION, "Explosions"],
  [DamageFlag.FAKE, "Fake damage sources"],
  [DamageFlag.FIRE, "Fire"],
  [DamageFlag.IGNORE_ARMOR, "Armor ignoring damage sources"],
  [DamageFlag.INVINCIBLE, "Invincible piercing damage sources"],
  [DamageFlag.ISSAC_HEART, "Isaac's Heart being hit"],
  [DamageFlag.IV_BAG, "IV Bag"],
  [DamageFlag.LASER, "Lasers"],
  [DamageFlag.NO_KILL, "Damage that does not kill"],
  [DamageFlag.NO_MODIFIERS, "Damage that is does not follow modifiers"],
  [DamageFlag.NO_PENALTIES, "Damage that has no penalties"],
  [DamageFlag.PITFALL, "Pitfalls"],
  [DamageFlag.POISON_BURN, "Poison or burns"],
  [DamageFlag.POOP, "Poop"],
  [DamageFlag.RED_HEARTS, "Red hearts"],
  [DamageFlag.SPAWN_BLACK_HEART, "Sources that spawn black hearts"],
  [DamageFlag.SPAWN_CARD, "Sources that spawn cards"],
  [DamageFlag.SPAWN_COIN, "Sources that spawn coins"],
  [DamageFlag.SPAWN_FLY, "Sources that spawn flies"],
  [DamageFlag.SPAWN_RED_HEART, "Sources that spawn red hearts"],
  [DamageFlag.SPAWN_RUNE, "Sources that spawn runes"],
  [
    DamageFlag.SPAWN_TEMP_HEART,
    "Sources that spawn disappearing half red hearts",
  ],
  [DamageFlag.SPIKES, "Spikes"],
  [DamageFlag.TIMER, "Timed sources"],
  [DamageFlag.TNT, "TNT"],
]);

export function damageFlagToString(damageFlag: DamageFlag): string {
  const text = DAMAGE_FLAG_TEXT_MAP.get(damageFlag);
  if (text !== undefined) {
    return text;
  }
  error("DamageFlagText: DamageFlag text cannot be found.");
}
