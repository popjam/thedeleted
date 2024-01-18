import { TearVariant } from "isaac-typescript-definitions";
import { ReadonlyMap } from "isaacscript-common";

const TEAR_VARIANT_NAME_MAP = new ReadonlyMap<TearVariant, string>([
  [TearVariant.BLUE, "Blue"],
  [TearVariant.BLOOD, "Blood"],
  [TearVariant.TOOTH, "Tooth"],
  [TearVariant.METALLIC, "Metallic"],
  [TearVariant.BOBS_HEAD, "Bob's Head"],
  [TearVariant.FIRE_MIND, "Fire Mind"],
  [TearVariant.DARK_MATTER, "Dark Matter"],
  [TearVariant.MYSTERIOUS, "Mysterious"],
  [TearVariant.SCHYTHE, "Schythe"],
  [TearVariant.CHAOS_CARD, "Chaos Card"],
  [TearVariant.LOST_CONTACT, "Lost Contact"],
  [TearVariant.CUPID_BLUE, "Blue Cupid"],
  [TearVariant.CUPID_BLOOD, "Cupid Blood"],
  [TearVariant.NAIL, "Nail"],
  [TearVariant.PUPULA, "Pupula"],
  [TearVariant.PUPULA_BLOOD, "Pupula Blood"],
  [TearVariant.GODS_FLESH, "God's Flesh"],
  [TearVariant.GODS_FLESH_BLOOD, "God's Flesh Blood"],
  [TearVariant.DIAMOND, "Diamond"],
  [TearVariant.EXPLOSIVO, "Explosivo"],
  [TearVariant.COIN, "Coin"],
  [TearVariant.MULTIDIMENSIONAL, "Multidimensional"],
  [TearVariant.STONE, "Stone"],
  [TearVariant.NAIL_BLOOD, "Nail Blood"],
  [TearVariant.GLAUCOMA, "Glaucoma"],
  [TearVariant.GLAUCOMA_BLOOD, "Glaucoma Blood"],
  [TearVariant.BOOGER, "Booger"],
  [TearVariant.EGG, "Egg"],
  [TearVariant.RAZOR, "Razor"],
  [TearVariant.BONE, "Bone"],
  [TearVariant.BLACK_TOOTH, "Black Tooth"],
  [TearVariant.NEEDLE, "Needle"],
  [TearVariant.BELIAL, "Belial"],
  [TearVariant.EYE, "Eye"],
  [TearVariant.EYE_BLOOD, "Eye Blood"],
  [TearVariant.BALLOON, "Balloon"],
  [TearVariant.HUNGRY, "Hungry"],
  [TearVariant.BALLOON_BRIMSTONE, "Brimstone Balloon"],
  [TearVariant.BALLOON_BOMB, "Balloon Bomb"],
  [TearVariant.FIST, "Fist"],
  [TearVariant.GRID_ENTITY, "Grid Entity"],
  [TearVariant.ICE, "Ice"],
  [TearVariant.ROCK, "Rock"],
  [TearVariant.KEY, "Key"],
  [TearVariant.KEY_BLOOD, "Key Blood"],
  [TearVariant.ERASER, "Eraser"],
  [TearVariant.FIRE, "Fire"],
  [TearVariant.SWORD_BEAM, "Sword Beam"],
  [TearVariant.SPORE, "Spore"],
  [TearVariant.TECH_SWORD_BEAM, "Tech Sword Beam"],
  [TearVariant.FETUS, "Fetus"],
]);

/**
 * Convert the TearVariant to string form.
 *
 * @example TearVariant.BALLOON -> "Balloon"
 */
export function tearVariantToString(tearVariant: TearVariant): string {
  const name = TEAR_VARIANT_NAME_MAP.get(tearVariant);
  if (name === undefined) {
    error(`Unknown tear variant: ${tearVariant}`);
  }

  return name;
}
