import { BombVariant } from "isaac-typescript-definitions";

const BOMB_ENTITY_NAME_MAP: ReadonlyMap<BombVariant, string> = new Map([
  [BombVariant.BIG, "big bomb"],
  [BombVariant.BOBBY, "bobby bomb"],
  [BombVariant.BRIMSTONE, "brimstone bomb"],
  [BombVariant.BUTT, "butt bomb"],
  [BombVariant.DECOY, "best friend"],
  [BombVariant.GIGA, "giga bomb"],
  [BombVariant.GLITTER, "glitter bomb"],
  [BombVariant.GOLDEN_TROLL, "golden troll bomb"],
  [BombVariant.HOT, "hot bomb"],
  [BombVariant.MEGA_TROLL, "mega troll bomb"],
  [BombVariant.MR_MEGA, "mr. mega bomb"],
  [BombVariant.NORMAL, "bomb"],
  [BombVariant.POISON, "poison bomb"],
  [BombVariant.POISON_BIG, "big poison bomb"],
  [BombVariant.ROCKET, "rocket"],
  [BombVariant.ROCKET_GIGA, "giga rocket"],
  [BombVariant.SAD, "sad bomb"],
  [BombVariant.SAD_BLOOD, "bloody sad bomb"],
  [BombVariant.SMALL, "small bomb"],
  [BombVariant.THROWABLE, "throwable bomb"],
  [BombVariant.TROLL, "troll bomb"],
]);

/** Get the name of a bomb entity from its variant. */
export function getNonModdedBombEntityName(bombVariant: BombVariant): string {
  const name = BOMB_ENTITY_NAME_MAP.get(bombVariant);
  if (name === undefined) {
    error(`Unknown bomb variant: ${bombVariant}`);
  }
  return name;
}
