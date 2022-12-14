import { CollectibleType } from "isaac-typescript-definitions";

/** A set of CollectibleTypes which work with the TemporaryEffect AddCollectibleEffect() method. */
const WORKING_PASSIVE_COLLECTIBLE_EFFECTS: ReadonlySet<CollectibleType> =
  new Set([
    CollectibleType.SAD_ONION,
    CollectibleType.INNER_EYE,
    CollectibleType.SPOON_BENDER,
    CollectibleType.MY_REFLECTION,
    CollectibleType.NUMBER_ONE,
    CollectibleType.BROTHER_BOBBY,
    CollectibleType.MAGIC_MUSHROOM,
    CollectibleType.VIRUS,
    CollectibleType.ROID_RAGE,
    CollectibleType.TRANSCENDENCE,
    CollectibleType.MOMS_UNDERWEAR,
    CollectibleType.MOMS_HEELS,
    CollectibleType.MOMS_LIPSTICK,
    CollectibleType.MOMS_EYE,
    CollectibleType.DISTANT_ADMIRATION,
    CollectibleType.SISTER_MAGGY,
    CollectibleType.GROWTH_HORMONES,
    CollectibleType.MINI_MUSH,
    CollectibleType.CUBE_OF_MEAT,
    CollectibleType.LITTLE_CHUBBY,
    CollectibleType.LITTLE_CHAD,
    CollectibleType.SACK_OF_PENNIES,
    CollectibleType.ROBO_BABY,
    CollectibleType.RELIC,
    CollectibleType.LITTLE_GISH,
    CollectibleType.LITTLE_STEVEN,
    CollectibleType.WAFER,
    CollectibleType.MOMS_CONTACTS,
    CollectibleType.GUARDIAN_ANGEL,
    CollectibleType.DEMON_BABY,
    CollectibleType.MOMS_KNIFE,
    CollectibleType.OUIJA_BOARD,
    CollectibleType.BRIMSTONE,
    CollectibleType.ODD_MUSHROOM_THIN,
    CollectibleType.ODD_MUSHROOM_LARGE,
    CollectibleType.FOREVER_ALONE,
    CollectibleType.BOMB_BAG,
    CollectibleType.SPEED_BALL,
    CollectibleType.BUM_FRIEND,
    CollectibleType.TOUGH_LOVE,
    CollectibleType.GHOST_BABY,
    CollectibleType.HARLEQUIN_BABY,
    CollectibleType.DADDY_LONGLEGS,
    CollectibleType.SACRIFICIAL_DAGGER,
    CollectibleType.RAINBOW_BABY,
    CollectibleType.HOLY_WATER,
    CollectibleType.GUPPYS_HAIRBALL,
    CollectibleType.ABEL,
    CollectibleType.MOMS_KEY,
    CollectibleType.MOMS_EYESHADOW,
    CollectibleType.IRON_BAR,
    CollectibleType.GUILLOTINE,
    CollectibleType.BALL_OF_BANDAGES,
    CollectibleType.ANEMIC,
    CollectibleType.MOMS_WIG,
    CollectibleType.MOMS_PERFUME,
    CollectibleType.DEATHS_TOUCH,
    CollectibleType.HIVE_MIND,
    CollectibleType.FIRE_MIND,
    CollectibleType.DARK_MATTER,
    CollectibleType.PROPTOSIS,
    CollectibleType.SMART_FLY,
    CollectibleType.DRY_BABY,
    CollectibleType.JUICY_SACK,
    CollectibleType.ROBO_BABY_2,
    CollectibleType.ROTTEN_BABY,
    CollectibleType.HEADLESS_BABY,
    CollectibleType.LEECH,
    CollectibleType.MYSTERY_SACK,
    CollectibleType.BBF,
    CollectibleType.BOBS_BRAIN,
    CollectibleType.LIL_BRIMSTONE,
    CollectibleType.LIL_HAUNT,
    CollectibleType.DARK_BUM,
    CollectibleType.BIG_FAN,
    CollectibleType.SISSY_LONGLEGS,
    CollectibleType.PUNCHING_BAG,
    CollectibleType.LEO,
    CollectibleType.HOLY_MANTLE,
    CollectibleType.MYSTERIOUS_LIQUID,
    CollectibleType.GEMINI,
    CollectibleType.CAINS_OTHER_EYE,
    CollectibleType.BLUE_BABYS_ONLY_FRIEND,
    CollectibleType.SAMSONS_CHAINS,
    CollectibleType.MONGO_BABY,
    CollectibleType.BLUE_CAP,
    CollectibleType.SYNTHOIL,
    CollectibleType.MOMS_PEARLS,
    CollectibleType.WIZ,
    CollectibleType.INCUBUS,
    CollectibleType.FATES_REWARD,
    CollectibleType.LIL_CHEST,
    CollectibleType.SWORN_PROTECTOR,
    CollectibleType.FRIEND_ZONE,
    CollectibleType.LOST_FLY,
    CollectibleType.CHARGED_BABY,
    CollectibleType.HOLY_LIGHT,
    CollectibleType.LIL_GURDY,
    CollectibleType.BUMBO,
    CollectibleType.CENSER,
    CollectibleType.KEY_BUM,
    CollectibleType.RUNE_BAG,
    CollectibleType.SERAPHIM,
    CollectibleType.GODS_FLESH,
    CollectibleType.SPIDER_MOD,
    CollectibleType.FARTING_BABY,
    CollectibleType.SUCCUBUS,
    CollectibleType.FRUIT_CAKE,
    CollectibleType.OBSESSED_FAN,
    CollectibleType.HEAD_OF_THE_KEEPER,
    CollectibleType.PAPA_FLY,
    CollectibleType.MULTIDIMENSIONAL_BABY,
    CollectibleType.LIL_LOKI,
    CollectibleType.FINGER,
    CollectibleType.SHADE,
    CollectibleType.DEPRESSION,
    CollectibleType.HUSHY,
    CollectibleType.LIL_MONSTRO,
    CollectibleType.KING_BABY,
    CollectibleType.BIG_CHUBBY,
    CollectibleType.ACID_BABY,
    CollectibleType.YO_LISTEN,
    CollectibleType.ADRENALINE,
    CollectibleType.EUTHANASIA,
    CollectibleType.CAMO_UNDIES,
    CollectibleType.SACK_OF_SACKS,
    CollectibleType.MOMS_RAZOR,
    CollectibleType.BLOODSHOT_EYE,
    CollectibleType.ANGRY_FLY,
    CollectibleType.BUDDY_IN_A_BOX,
    CollectibleType.LIL_DELIRIUM,
    CollectibleType.SEVEN_SEALS,
    CollectibleType.ANGELIC_PRISM,
    CollectibleType.LIL_SPEWER,
    CollectibleType.MYSTERY_EGG,
    CollectibleType.SLIPPED_RIB,
    CollectibleType.HALLOWED_GROUND,
    CollectibleType.POINTY_RIB,
    CollectibleType.JAW_BONE,
    CollectibleType.BLOOD_PUPPY,
    CollectibleType.PSY_FLY,
    CollectibleType.URANUS,
    CollectibleType.BOILED_BABY,
    CollectibleType.FREEZER_BABY,
    CollectibleType.LIL_DUMPY,
    CollectibleType.BOT_FLY,
    CollectibleType.TINYTOMA,
    CollectibleType.FRUITY_PLUM,
    CollectibleType.CUBE_BABY,
    CollectibleType.LIL_ABADDON,
    CollectibleType.LIL_PORTAL,
    CollectibleType.WORM_FRIEND,
    CollectibleType.TWISTED_PAIR,
    CollectibleType.MOMS_RING,
  ]);

/**
 * A set of CollectibleTypes which partly work with the TemporaryEffect AddCollectibleEffect()
 * method. They may only emulate part of the item.
 */
const PARTLY_WORKING_PASSIVE_COLLECTIBLE_EFFECTS: ReadonlySet<CollectibleType> =
  new Set([
    CollectibleType.DEAD_BIRD,
    CollectibleType.WHORE_OF_BABYLON,
    CollectibleType.PEEPER,
    CollectibleType.ANEMIC,
    CollectibleType.EXPERIMENTAL_TREATMENT,
    CollectibleType.TWENTY_TWENTY,
    CollectibleType.BEST_BUD,
    CollectibleType.TRACTOR_BEAM,
    CollectibleType.EMPTY_VESSEL,
    CollectibleType.LUSTY_BLOOD,
    CollectibleType.CROWN_OF_LIGHT,
    CollectibleType.MILK,
    CollectibleType.DARK_PRINCES_CROWN,
    CollectibleType.PASCHAL_CANDLE,
    CollectibleType.EYE_OF_THE_OCCULT,
    CollectibleType.INTRUDER,
    CollectibleType.MARS,
    CollectibleType.BIRD_CAGE,
    CollectibleType.ASTRAL_PROJECTION,
    CollectibleType.INNER_CHILD,
  ]);

/**
 * Checks if the CollectibleType works using its corresponding CollectibleEffect.
 *
 * @param collectibleType The CollectibleType you want to check.
 * @param includePartlyWorking Will also return true if it is part of the 'partly working' set,
 *                             which may only replicate part of the collectible.
 */
export function doesCollectibleEffectWork(
  collectibleType: CollectibleType,
  includePartlyWorking: boolean,
): boolean {
  const inWorking = WORKING_PASSIVE_COLLECTIBLE_EFFECTS.has(collectibleType);
  if (!inWorking) {
    if (includePartlyWorking) {
      return PARTLY_WORKING_PASSIVE_COLLECTIBLE_EFFECTS.has(collectibleType);
    }
  }
  return inWorking;
}

/**
 * If the Temporary Collectible effect works, adds it, otherwise adds the collectible (with no logic
 * for removal).
 */
export function addTemporaryCollectibleOrNormalCollectible(
  player: EntityPlayer,
  collectibleType: CollectibleType,
  partlyWorking = true,
): void {
  if (doesCollectibleEffectWork(collectibleType, partlyWorking)) {
    player
      .GetEffects()
      .AddCollectibleEffect(collectibleType as TemporaryCollectibleType);
  } else {
    player.AddCollectible(collectibleType);
  }
}
