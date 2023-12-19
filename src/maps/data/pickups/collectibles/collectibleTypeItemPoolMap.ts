import { CollectibleType, ItemPoolType } from "isaac-typescript-definitions";

export const itemPools = new Map<CollectibleType, ItemPoolType[]>([
  [
    CollectibleType.SAD_ONION,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.CRANE_GAME,
    ],
  ],
  [
    CollectibleType.INNER_EYE,
    [ItemPoolType.TREASURE, ItemPoolType.GREED_TREASURE],
  ],
  [
    CollectibleType.SPOON_BENDER,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.CRANE_GAME,
    ],
  ],
  [
    CollectibleType.CRICKETS_HEAD,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.CRANE_GAME,
    ],
  ],
  [
    CollectibleType.MY_REFLECTION,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.CRANE_GAME,
    ],
  ],
  [
    CollectibleType.NUMBER_ONE,
    [ItemPoolType.TREASURE, ItemPoolType.GREED_TREASURE],
  ],
  [
    CollectibleType.BLOOD_OF_THE_MARTYR,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.ANGEL,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.GREED_ANGEL,
      ItemPoolType.WOODEN_CHEST,
    ],
  ],
  [
    CollectibleType.BROTHER_BOBBY,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.DEVIL,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.BABY_SHOP,
    ],
  ],
  [CollectibleType.SKATOLE, [ItemPoolType.SHELL_GAME]],
  [
    CollectibleType.HALO_OF_FLIES,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.KEY_MASTER,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.BABY_SHOP,
    ],
  ],
  [
    CollectibleType.ONE_UP,
    [ItemPoolType.SECRET, ItemPoolType.GREED_SHOP, ItemPoolType.GREED_SECRET],
  ],
  [
    CollectibleType.MAGIC_MUSHROOM,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.GREED_BOSS,
      ItemPoolType.ULTRA_SECRET,
    ],
  ],
  [
    CollectibleType.VIRUS,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.DEMON_BEGGAR,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.ULTRA_SECRET,
    ],
  ],
  [
    CollectibleType.ROID_RAGE,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.BOSS,
      ItemPoolType.DEMON_BEGGAR,
      ItemPoolType.GREED_BOSS,
    ],
  ],
  [
    CollectibleType.HEART,
    [ItemPoolType.TREASURE, ItemPoolType.GREED_BOSS, ItemPoolType.ULTRA_SECRET],
  ],
  [
    CollectibleType.RAW_LIVER,
    [ItemPoolType.SECRET, ItemPoolType.GREED_BOSS, ItemPoolType.GREED_SECRET],
  ],
  [
    CollectibleType.SKELETON_KEY,
    [ItemPoolType.TREASURE, ItemPoolType.SECRET, ItemPoolType.GREED_SECRET],
  ],
  [CollectibleType.BOOM, [ItemPoolType.TREASURE]],
  [
    CollectibleType.TRANSCENDENCE,
    [ItemPoolType.SECRET, ItemPoolType.GREED_SECRET],
  ],
  [
    CollectibleType.COMPASS,
    [ItemPoolType.SHOP, ItemPoolType.BEGGAR, ItemPoolType.CRANE_GAME],
  ],
  [
    CollectibleType.LUNCH,
    [ItemPoolType.BOSS, ItemPoolType.BEGGAR, ItemPoolType.GREED_BOSS],
  ],
  [
    CollectibleType.DINNER,
    [ItemPoolType.BOSS, ItemPoolType.BEGGAR, ItemPoolType.GREED_BOSS],
  ],
  [
    CollectibleType.DESSERT,
    [ItemPoolType.BOSS, ItemPoolType.BEGGAR, ItemPoolType.GREED_BOSS],
  ],
  [
    CollectibleType.BREAKFAST,
    [ItemPoolType.BOSS, ItemPoolType.BEGGAR, ItemPoolType.GREED_BOSS],
  ],
  [
    CollectibleType.ROTTEN_MEAT,
    [
      ItemPoolType.BOSS,
      ItemPoolType.BEGGAR,
      ItemPoolType.GREED_BOSS,
      ItemPoolType.ROTTEN_BEGGAR,
    ],
  ],
  [
    CollectibleType.WOODEN_SPOON,
    [ItemPoolType.BOSS, ItemPoolType.GREED_BOSS, ItemPoolType.WOODEN_CHEST],
  ],
  [
    CollectibleType.BELT,
    [ItemPoolType.BOSS, ItemPoolType.GOLDEN_CHEST, ItemPoolType.GREED_BOSS],
  ],
  [
    CollectibleType.MOMS_UNDERWEAR,
    [
      ItemPoolType.BOSS,
      ItemPoolType.GOLDEN_CHEST,
      ItemPoolType.MOMS_CHEST,
      ItemPoolType.GREED_BOSS,
      ItemPoolType.OLD_CHEST,
    ],
  ],
  [
    CollectibleType.MOMS_HEELS,
    [
      ItemPoolType.BOSS,
      ItemPoolType.MOMS_CHEST,
      ItemPoolType.GREED_BOSS,
      ItemPoolType.ULTRA_SECRET,
      ItemPoolType.OLD_CHEST,
    ],
  ],
  [
    CollectibleType.MOMS_LIPSTICK,
    [
      ItemPoolType.BOSS,
      ItemPoolType.MOMS_CHEST,
      ItemPoolType.GREED_BOSS,
      ItemPoolType.ULTRA_SECRET,
      ItemPoolType.OLD_CHEST,
    ],
  ],
  [
    CollectibleType.WIRE_COAT_HANGER,
    [
      ItemPoolType.BOSS,
      ItemPoolType.GOLDEN_CHEST,
      ItemPoolType.GREED_BOSS,
      ItemPoolType.CRANE_GAME,
    ],
  ],
  [
    CollectibleType.BIBLE,
    [ItemPoolType.SHOP, ItemPoolType.ANGEL, ItemPoolType.LIBRARY],
  ],
  [
    CollectibleType.BOOK_OF_BELIAL,
    [
      ItemPoolType.DEVIL,
      ItemPoolType.LIBRARY,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.GREED_DEVIL,
    ],
  ],
  [
    CollectibleType.NECRONOMICON,
    [
      ItemPoolType.DEVIL,
      ItemPoolType.SECRET,
      ItemPoolType.LIBRARY,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.GREED_DEVIL,
      ItemPoolType.GREED_SECRET,
    ],
  ],
  [CollectibleType.POOP, [ItemPoolType.TREASURE, ItemPoolType.SHELL_GAME]],
  [
    CollectibleType.MR_BOOM,
    [ItemPoolType.TREASURE, ItemPoolType.GREED_TREASURE, ItemPoolType.BOMB_BUM],
  ],
  [
    CollectibleType.TAMMYS_HEAD,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.CRANE_GAME,
    ],
  ],
  [
    CollectibleType.MOMS_BRA,
    [ItemPoolType.TREASURE, ItemPoolType.MOMS_CHEST, ItemPoolType.OLD_CHEST],
  ],
  [
    CollectibleType.KAMIKAZE,
    [ItemPoolType.TREASURE, ItemPoolType.ULTRA_SECRET],
  ],
  [
    CollectibleType.MOMS_PAD,
    [ItemPoolType.TREASURE, ItemPoolType.MOMS_CHEST, ItemPoolType.OLD_CHEST],
  ],
  [
    CollectibleType.BOBS_ROTTEN_HEAD,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.ROTTEN_BEGGAR,
    ],
  ],
  [CollectibleType.TELEPORT, [ItemPoolType.TREASURE, ItemPoolType.CRANE_GAME]],
  [
    CollectibleType.YUM_HEART,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.ULTRA_SECRET,
    ],
  ],
  [
    CollectibleType.LUCKY_FOOT,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.BEGGAR,
      ItemPoolType.GREED_SHOP,
      ItemPoolType.CRANE_GAME,
    ],
  ],
  [
    CollectibleType.DOCTORS_REMOTE,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.CRANE_GAME,
    ],
  ],
  [
    CollectibleType.CUPIDS_ARROW,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.CRANE_GAME,
    ],
  ],
  [
    CollectibleType.SHOOP_DA_WHOOP,
    [ItemPoolType.TREASURE, ItemPoolType.CRANE_GAME, ItemPoolType.ULTRA_SECRET],
  ],
  [CollectibleType.STEVEN, [ItemPoolType.GREED_TREASURE]],
  [
    CollectibleType.PENTAGRAM,
    [
      ItemPoolType.BOSS,
      ItemPoolType.DEVIL,
      ItemPoolType.DEMON_BEGGAR,
      ItemPoolType.CURSE,
      ItemPoolType.GREED_CURSE,
      ItemPoolType.GREED_DEVIL,
      ItemPoolType.CRANE_GAME,
      ItemPoolType.ULTRA_SECRET,
    ],
  ],
  [
    CollectibleType.DR_FETUS,
    [ItemPoolType.TREASURE, ItemPoolType.GREED_TREASURE],
  ],
  [CollectibleType.MAGNETO, [ItemPoolType.TREASURE, ItemPoolType.ULTRA_SECRET]],
  [CollectibleType.TREASURE_MAP, [ItemPoolType.SHOP, ItemPoolType.BEGGAR]],
  [
    CollectibleType.MOMS_EYE,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.MOMS_CHEST,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.OLD_CHEST,
    ],
  ],
  [
    CollectibleType.LEMON_MISHAP,
    [ItemPoolType.TREASURE, ItemPoolType.GREED_TREASURE],
  ],
  [
    CollectibleType.DISTANT_ADMIRATION,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.KEY_MASTER,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.BABY_SHOP,
    ],
  ],
  [
    CollectibleType.BOOK_OF_SHADOWS,
    [ItemPoolType.TREASURE, ItemPoolType.LIBRARY],
  ],
  [CollectibleType.LADDER, [ItemPoolType.SHOP, ItemPoolType.WOODEN_CHEST]],
  [
    CollectibleType.CHARM_OF_THE_VAMPIRE,
    [ItemPoolType.TREASURE, ItemPoolType.GREED_TREASURE],
  ],
  [
    CollectibleType.BATTERY,
    [
      ItemPoolType.SHOP,
      ItemPoolType.BATTERY_BUM,
      ItemPoolType.GREED_SHOP,
      ItemPoolType.CRANE_GAME,
    ],
  ],
  [
    CollectibleType.STEAM_SALE,
    [ItemPoolType.SHOP, ItemPoolType.GREED_TREASURE],
  ],
  [
    CollectibleType.ANARCHIST_COOKBOOK,
    [ItemPoolType.TREASURE, ItemPoolType.LIBRARY, ItemPoolType.GREED_TREASURE],
  ],
  [CollectibleType.HOURGLASS, [ItemPoolType.TREASURE, ItemPoolType.CRANE_GAME]],
  [
    CollectibleType.SISTER_MAGGY,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.DEVIL,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.GREED_DEVIL,
      ItemPoolType.ULTRA_SECRET,
      ItemPoolType.BABY_SHOP,
    ],
  ],
  [
    CollectibleType.TECHNOLOGY,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.GREED_DEVIL,
      ItemPoolType.CRANE_GAME,
    ],
  ],
  [
    CollectibleType.CHOCOLATE_MILK,
    [ItemPoolType.TREASURE, ItemPoolType.GREED_TREASURE],
  ],
  [
    CollectibleType.GROWTH_HORMONES,
    [ItemPoolType.BOSS, ItemPoolType.DEMON_BEGGAR, ItemPoolType.GREED_BOSS],
  ],
  [CollectibleType.MINI_MUSH, [ItemPoolType.TREASURE, ItemPoolType.GREED_BOSS]],
  [
    CollectibleType.ROSARY,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.ANGEL,
      ItemPoolType.GREED_ANGEL,
      ItemPoolType.ULTRA_SECRET,
    ],
  ],
  [
    CollectibleType.CUBE_OF_MEAT,
    [
      ItemPoolType.GREED_BOSS,
      ItemPoolType.GREED_SHOP,
      ItemPoolType.GREED_CURSE,
      ItemPoolType.ULTRA_SECRET,
      ItemPoolType.BABY_SHOP,
    ],
  ],
  [
    CollectibleType.QUARTER,
    [ItemPoolType.DEVIL, ItemPoolType.GOLDEN_CHEST, ItemPoolType.GREED_DEVIL],
  ],
  [
    CollectibleType.PHD,
    [ItemPoolType.TREASURE, ItemPoolType.SHOP, ItemPoolType.GREED_SHOP],
  ],
  [
    CollectibleType.XRAY_VISION,
    [ItemPoolType.TREASURE, ItemPoolType.GREED_SHOP],
  ],
  [
    CollectibleType.MY_LITTLE_UNICORN,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.CRANE_GAME,
    ],
  ],
  [
    CollectibleType.BOOK_OF_REVELATIONS,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.LIBRARY,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.GREED_ANGEL,
    ],
  ],
  [
    CollectibleType.MARK,
    [
      ItemPoolType.DEVIL,
      ItemPoolType.DEMON_BEGGAR,
      ItemPoolType.CURSE,
      ItemPoolType.GREED_CURSE,
      ItemPoolType.GREED_DEVIL,
      ItemPoolType.ULTRA_SECRET,
    ],
  ],
  [
    CollectibleType.PACT,
    [
      ItemPoolType.DEVIL,
      ItemPoolType.DEMON_BEGGAR,
      ItemPoolType.CURSE,
      ItemPoolType.GREED_CURSE,
      ItemPoolType.GREED_DEVIL,
      ItemPoolType.ULTRA_SECRET,
    ],
  ],
  [
    CollectibleType.DEAD_CAT,
    [
      ItemPoolType.DEVIL,
      ItemPoolType.RED_CHEST,
      ItemPoolType.CURSE,
      ItemPoolType.GREED_CURSE,
      ItemPoolType.GREED_DEVIL,
    ],
  ],
  [
    CollectibleType.LORD_OF_THE_PIT,
    [
      ItemPoolType.DEVIL,
      ItemPoolType.DEMON_BEGGAR,
      ItemPoolType.GREED_DEVIL,
      ItemPoolType.ULTRA_SECRET,
    ],
  ],
  [
    CollectibleType.NAIL,
    [ItemPoolType.DEVIL, ItemPoolType.DEMON_BEGGAR, ItemPoolType.GREED_DEVIL],
  ],
  [
    CollectibleType.WE_NEED_TO_GO_DEEPER,
    [
      ItemPoolType.DEVIL,
      ItemPoolType.SECRET,
      ItemPoolType.GREED_SHOP,
      ItemPoolType.GREED_SECRET,
    ],
  ],
  [
    CollectibleType.DECK_OF_CARDS,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.SHOP,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.CRANE_GAME,
    ],
  ],
  [CollectibleType.MONSTROS_TOOTH, [ItemPoolType.TREASURE]],
  [
    CollectibleType.LOKIS_HORNS,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.DEMON_BEGGAR,
      ItemPoolType.GREED_TREASURE,
    ],
  ],
  [
    CollectibleType.LITTLE_CHUBBY,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.BABY_SHOP,
    ],
  ],
  [
    CollectibleType.SPIDER_BITE,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.CRANE_GAME,
    ],
  ],
  [CollectibleType.SMALL_ROCK, [ItemPoolType.CRANE_GAME]],
  [
    CollectibleType.SPELUNKER_HAT,
    [ItemPoolType.TREASURE, ItemPoolType.GREED_SHOP, ItemPoolType.CRANE_GAME],
  ],
  [CollectibleType.SUPER_BANDAGE, [ItemPoolType.TREASURE, ItemPoolType.BOSS]],
  [
    CollectibleType.GAMEKID,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.CRANE_GAME,
    ],
  ],
  [
    CollectibleType.SACK_OF_PENNIES,
    [ItemPoolType.TREASURE, ItemPoolType.GREED_TREASURE],
  ],
  [
    CollectibleType.ROBO_BABY,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.CRANE_GAME,
      ItemPoolType.BABY_SHOP,
    ],
  ],
  [
    CollectibleType.LITTLE_CHAD,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.ULTRA_SECRET,
      ItemPoolType.BABY_SHOP,
    ],
  ],
  [
    CollectibleType.BOOK_OF_SIN,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.DEVIL,
      ItemPoolType.LIBRARY,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.GREED_DEVIL,
    ],
  ],
  [
    CollectibleType.RELIC,
    [ItemPoolType.TREASURE, ItemPoolType.ANGEL, ItemPoolType.GREED_TREASURE],
  ],
  [
    CollectibleType.LITTLE_GISH,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.BABY_SHOP,
    ],
  ],
  [
    CollectibleType.LITTLE_STEVEN,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.BABY_SHOP,
    ],
  ],
  [
    CollectibleType.HALO,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.ANGEL,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.GREED_BOSS,
    ],
  ],
  [
    CollectibleType.MOMS_BOTTLE_OF_PILLS,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.SHOP,
      ItemPoolType.BEGGAR,
      ItemPoolType.DEMON_BEGGAR,
      ItemPoolType.MOMS_CHEST,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.CRANE_GAME,
      ItemPoolType.OLD_CHEST,
    ],
  ],
  [
    CollectibleType.COMMON_COLD,
    [ItemPoolType.TREASURE, ItemPoolType.GREED_TREASURE],
  ],
  [
    CollectibleType.PARASITE,
    [ItemPoolType.TREASURE, ItemPoolType.GREED_TREASURE],
  ],
  [
    CollectibleType.D6,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.GREED_SHOP,
      ItemPoolType.CRANE_GAME,
      ItemPoolType.ULTRA_SECRET,
    ],
  ],
  [
    CollectibleType.MR_MEGA,
    [ItemPoolType.TREASURE, ItemPoolType.GREED_TREASURE, ItemPoolType.BOMB_BUM],
  ],
  [
    CollectibleType.PINKING_SHEARS,
    [ItemPoolType.TREASURE, ItemPoolType.GREED_TREASURE],
  ],
  [
    CollectibleType.WAFER,
    [ItemPoolType.TREASURE, ItemPoolType.ANGEL, ItemPoolType.GREED_TREASURE],
  ],
  [
    CollectibleType.MONEY_EQUALS_POWER,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.DEVIL,
      ItemPoolType.GREED_DEVIL,
      ItemPoolType.ULTRA_SECRET,
    ],
  ],
  [
    CollectibleType.MOMS_CONTACTS,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.MOMS_CHEST,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.ULTRA_SECRET,
      ItemPoolType.OLD_CHEST,
    ],
  ],
  [
    CollectibleType.BEAN,
    [ItemPoolType.TREASURE, ItemPoolType.BEGGAR, ItemPoolType.GREED_TREASURE],
  ],
  [
    CollectibleType.GUARDIAN_ANGEL,
    [ItemPoolType.ANGEL, ItemPoolType.GREED_ANGEL, ItemPoolType.BABY_SHOP],
  ],
  [
    CollectibleType.DEMON_BABY,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.DEVIL,
      ItemPoolType.GREED_DEVIL,
      ItemPoolType.BABY_SHOP,
    ],
  ],
  [
    CollectibleType.MOMS_KNIFE,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.DEVIL,
      ItemPoolType.MOMS_CHEST,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.GREED_DEVIL,
      ItemPoolType.OLD_CHEST,
    ],
  ],
  [
    CollectibleType.OUIJA_BOARD,
    [ItemPoolType.TREASURE, ItemPoolType.DEVIL, ItemPoolType.GREED_TREASURE],
  ],
  [
    CollectibleType.NINE_VOLT,
    [
      ItemPoolType.SHOP,
      ItemPoolType.BATTERY_BUM,
      ItemPoolType.GREED_SHOP,
      ItemPoolType.CRANE_GAME,
    ],
  ],
  [
    CollectibleType.DEAD_BIRD,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.BABY_SHOP,
    ],
  ],
  [
    CollectibleType.BRIMSTONE,
    [ItemPoolType.DEVIL, ItemPoolType.GREED_DEVIL, ItemPoolType.ULTRA_SECRET],
  ],
  [CollectibleType.BLOOD_BAG, [ItemPoolType.ULTRA_SECRET]],
  [
    CollectibleType.ODD_MUSHROOM_THIN,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.SECRET,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.GREED_BOSS,
      ItemPoolType.GREED_SECRET,
    ],
  ],
  [
    CollectibleType.ODD_MUSHROOM_LARGE,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.SECRET,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.GREED_BOSS,
      ItemPoolType.GREED_SECRET,
    ],
  ],
  [
    CollectibleType.WHORE_OF_BABYLON,
    [
      ItemPoolType.DEVIL,
      ItemPoolType.DEMON_BEGGAR,
      ItemPoolType.GREED_DEVIL,
      ItemPoolType.ULTRA_SECRET,
    ],
  ],
  [
    CollectibleType.MONSTER_MANUAL,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.DEVIL,
      ItemPoolType.LIBRARY,
      ItemPoolType.GREED_DEVIL,
    ],
  ],
  [
    CollectibleType.DEAD_SEA_SCROLLS,
    [ItemPoolType.TREASURE, ItemPoolType.ANGEL, ItemPoolType.GREED_TREASURE],
  ],
  [
    CollectibleType.BOBBY_BOMB,
    [ItemPoolType.TREASURE, ItemPoolType.GREED_TREASURE, ItemPoolType.BOMB_BUM],
  ],
  [
    CollectibleType.RAZOR_BLADE,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.DEMON_BEGGAR,
      ItemPoolType.CURSE,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.GREED_CURSE,
    ],
  ],
  [
    CollectibleType.FORGET_ME_NOW,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.DEVIL,
      ItemPoolType.SECRET,
      ItemPoolType.DEMON_BEGGAR,
      ItemPoolType.GREED_SECRET,
    ],
  ],
  [
    CollectibleType.FOREVER_ALONE,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.KEY_MASTER,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.BABY_SHOP,
    ],
  ],
  [CollectibleType.BUCKET_OF_LARD, [ItemPoolType.TREASURE]],
  [
    CollectibleType.BOMB_BAG,
    [ItemPoolType.TREASURE, ItemPoolType.GREED_TREASURE],
  ],
  [
    CollectibleType.LUMP_OF_COAL,
    [
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.GREED_BOSS,
      ItemPoolType.GREED_DEVIL,
    ],
  ],
  [
    CollectibleType.GUPPYS_PAW,
    [
      ItemPoolType.DEVIL,
      ItemPoolType.RED_CHEST,
      ItemPoolType.CURSE,
      ItemPoolType.GREED_CURSE,
      ItemPoolType.GREED_DEVIL,
    ],
  ],
  [
    CollectibleType.GUPPYS_TAIL,
    [
      ItemPoolType.DEVIL,
      ItemPoolType.RED_CHEST,
      ItemPoolType.CURSE,
      ItemPoolType.GREED_CURSE,
      ItemPoolType.GREED_DEVIL,
    ],
  ],
  [CollectibleType.IV_BAG, [ItemPoolType.ULTRA_SECRET]],
  [
    CollectibleType.BEST_FRIEND,
    [ItemPoolType.TREASURE, ItemPoolType.CRANE_GAME],
  ],
  [
    CollectibleType.REMOTE_DETONATOR,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.SHOP,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.CRANE_GAME,
      ItemPoolType.ULTRA_SECRET,
      ItemPoolType.BOMB_BUM,
    ],
  ],
  [
    CollectibleType.STIGMATA,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.GREED_ANGEL,
      ItemPoolType.WOODEN_CHEST,
    ],
  ],
  [
    CollectibleType.MOMS_PURSE,
    [
      ItemPoolType.SHOP,
      ItemPoolType.MOMS_CHEST,
      ItemPoolType.GREED_SHOP,
      ItemPoolType.OLD_CHEST,
    ],
  ],
  [
    CollectibleType.BOBS_CURSE,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.RED_CHEST,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.BOMB_BUM,
      ItemPoolType.ROTTEN_BEGGAR,
    ],
  ],
  [CollectibleType.PAGEANT_BOY, [ItemPoolType.BOSS]],
  [
    CollectibleType.SCAPULAR,
    [ItemPoolType.TREASURE, ItemPoolType.ANGEL, ItemPoolType.GREED_TREASURE],
  ],
  [
    CollectibleType.SPEED_BALL,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.BOSS,
      ItemPoolType.DEMON_BEGGAR,
      ItemPoolType.GREED_BOSS,
    ],
  ],
  [
    CollectibleType.BUM_FRIEND,
    [ItemPoolType.TREASURE, ItemPoolType.BEGGAR, ItemPoolType.BABY_SHOP],
  ],
  [
    CollectibleType.GUPPYS_HEAD,
    [
      ItemPoolType.DEVIL,
      ItemPoolType.RED_CHEST,
      ItemPoolType.CURSE,
      ItemPoolType.GREED_CURSE,
      ItemPoolType.GREED_DEVIL,
    ],
  ],
  [
    CollectibleType.PRAYER_CARD,
    [ItemPoolType.TREASURE, ItemPoolType.ANGEL, ItemPoolType.GREED_TREASURE],
  ],
  [CollectibleType.NOTCHED_AXE, [ItemPoolType.SHOP, ItemPoolType.CRANE_GAME]],
  [
    CollectibleType.INFESTATION,
    [ItemPoolType.TREASURE, ItemPoolType.GREED_TREASURE],
  ],
  [
    CollectibleType.IPECAC,
    [ItemPoolType.TREASURE, ItemPoolType.GREED_TREASURE],
  ],
  [
    CollectibleType.TOUGH_LOVE,
    [ItemPoolType.TREASURE, ItemPoolType.GREED_TREASURE],
  ],
  [
    CollectibleType.MULLIGAN,
    [ItemPoolType.TREASURE, ItemPoolType.GREED_TREASURE],
  ],
  [
    CollectibleType.TECHNOLOGY_2,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.CRANE_GAME,
    ],
  ],
  [
    CollectibleType.MUTANT_SPIDER,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.CRANE_GAME,
    ],
  ],
  [
    CollectibleType.CHEMICAL_PEEL,
    [ItemPoolType.TREASURE, ItemPoolType.GREED_TREASURE],
  ],
  [
    CollectibleType.PEEPER,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.BABY_SHOP,
    ],
  ],
  [
    CollectibleType.HABIT,
    [ItemPoolType.SHOP, ItemPoolType.ANGEL, ItemPoolType.GREED_SHOP],
  ],
  [
    CollectibleType.BLOODY_LUST,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.DEVIL,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.GREED_DEVIL,
      ItemPoolType.ULTRA_SECRET,
    ],
  ],
  [
    CollectibleType.SPIRIT_OF_THE_NIGHT,
    [
      ItemPoolType.DEVIL,
      ItemPoolType.DEMON_BEGGAR,
      ItemPoolType.GREED_DEVIL,
      ItemPoolType.ULTRA_SECRET,
    ],
  ],
  [CollectibleType.CRACK_THE_SKY, [ItemPoolType.TREASURE]],
  [CollectibleType.ANKH, [ItemPoolType.TREASURE, ItemPoolType.GREED_TREASURE]],
  [
    CollectibleType.CELTIC_CROSS,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.ANGEL,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.GREED_ANGEL,
    ],
  ],
  [
    CollectibleType.GHOST_BABY,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.DEVIL,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.BABY_SHOP,
    ],
  ],
  [CollectibleType.CANDLE, [ItemPoolType.SHOP]],
  [CollectibleType.CAT_O_NINE_TAILS, [ItemPoolType.BOSS]],
  [
    CollectibleType.D20,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.GREED_SHOP,
      ItemPoolType.CRANE_GAME,
      ItemPoolType.ULTRA_SECRET,
    ],
  ],
  [
    CollectibleType.HARLEQUIN_BABY,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.ULTRA_SECRET,
      ItemPoolType.BABY_SHOP,
    ],
  ],
  [
    CollectibleType.EPIC_FETUS,
    [ItemPoolType.SECRET, ItemPoolType.GREED_SECRET],
  ],
  [
    CollectibleType.POLYPHEMUS,
    [ItemPoolType.TREASURE, ItemPoolType.GREED_TREASURE],
  ],
  [
    CollectibleType.DADDY_LONGLEGS,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.BABY_SHOP,
    ],
  ],
  [CollectibleType.SPIDER_BUTT, [ItemPoolType.TREASURE]],
  [
    CollectibleType.SACRIFICIAL_DAGGER,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.DEVIL,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.GREED_DEVIL,
      ItemPoolType.BABY_SHOP,
    ],
  ],
  [CollectibleType.MITRE, [ItemPoolType.TREASURE, ItemPoolType.ANGEL]],
  [
    CollectibleType.RAINBOW_BABY,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.BABY_SHOP,
    ],
  ],
  [
    CollectibleType.DADS_KEY,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.KEY_MASTER,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.OLD_CHEST,
    ],
  ],
  [
    CollectibleType.STEM_CELLS,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.BOSS,
      ItemPoolType.GREED_BOSS,
      ItemPoolType.ULTRA_SECRET,
    ],
  ],
  [
    CollectibleType.PORTABLE_SLOT,
    [ItemPoolType.SHOP, ItemPoolType.BEGGAR, ItemPoolType.ULTRA_SECRET],
  ],
  [
    CollectibleType.HOLY_WATER,
    [ItemPoolType.TREASURE, ItemPoolType.ANGEL, ItemPoolType.GREED_ANGEL],
  ],
  [CollectibleType.FATE, [ItemPoolType.GOLDEN_CHEST]],
  [CollectibleType.BLACK_BEAN, [ItemPoolType.TREASURE, ItemPoolType.BEGGAR]],
  [
    CollectibleType.SACRED_HEART,
    [ItemPoolType.ANGEL, ItemPoolType.GREED_ANGEL, ItemPoolType.ULTRA_SECRET],
  ],
  [
    CollectibleType.TOOTH_PICKS,
    [ItemPoolType.BOSS, ItemPoolType.GREED_BOSS, ItemPoolType.WOODEN_CHEST],
  ],
  [CollectibleType.HOLY_GRAIL, [ItemPoolType.ANGEL, ItemPoolType.GREED_ANGEL]],
  [CollectibleType.DEAD_DOVE, [ItemPoolType.ANGEL, ItemPoolType.GREED_ANGEL]],
  [
    CollectibleType.BLOOD_RIGHTS,
    [ItemPoolType.TREASURE, ItemPoolType.DEVIL, ItemPoolType.GREED_TREASURE],
  ],
  [
    CollectibleType.GUPPYS_HAIRBALL,
    [ItemPoolType.DEVIL, ItemPoolType.GREED_DEVIL],
  ],
  [
    CollectibleType.ABEL,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.BABY_SHOP,
    ],
  ],
  [
    CollectibleType.SMB_SUPER_FAN,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.CRANE_GAME,
    ],
  ],
  [
    CollectibleType.PYRO,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.SECRET,
      ItemPoolType.GREED_SECRET,
      ItemPoolType.BOMB_BUM,
    ],
  ],
  [
    CollectibleType.THREE_DOLLAR_BILL,
    [ItemPoolType.TREASURE, ItemPoolType.GREED_TREASURE],
  ],
  [
    CollectibleType.TELEPATHY_BOOK,
    [ItemPoolType.TREASURE, ItemPoolType.LIBRARY, ItemPoolType.GREED_TREASURE],
  ],
  [
    CollectibleType.MEAT,
    [ItemPoolType.BOSS, ItemPoolType.GREED_BOSS, ItemPoolType.ULTRA_SECRET],
  ],
  [
    CollectibleType.MAGIC_8_BALL,
    [
      ItemPoolType.BOSS,
      ItemPoolType.GOLDEN_CHEST,
      ItemPoolType.GREED_BOSS,
      ItemPoolType.CRANE_GAME,
    ],
  ],
  [
    CollectibleType.MOMS_COIN_PURSE,
    [
      ItemPoolType.SHOP,
      ItemPoolType.BOSS,
      ItemPoolType.BEGGAR,
      ItemPoolType.DEMON_BEGGAR,
      ItemPoolType.MOMS_CHEST,
      ItemPoolType.GREED_BOSS,
      ItemPoolType.OLD_CHEST,
    ],
  ],
  [
    CollectibleType.SQUEEZY,
    [
      ItemPoolType.BOSS,
      ItemPoolType.GOLDEN_CHEST,
      ItemPoolType.GREED_BOSS,
      ItemPoolType.CRANE_GAME,
    ],
  ],
  [
    CollectibleType.JESUS_JUICE,
    [ItemPoolType.BOSS, ItemPoolType.GREED_BOSS, ItemPoolType.GREED_ANGEL],
  ],
  [
    CollectibleType.BOX,
    [ItemPoolType.BOSS, ItemPoolType.BEGGAR, ItemPoolType.GREED_BOSS],
  ],
  [
    CollectibleType.MOMS_KEY,
    [
      ItemPoolType.SHOP,
      ItemPoolType.KEY_MASTER,
      ItemPoolType.MOMS_CHEST,
      ItemPoolType.GREED_BOSS,
      ItemPoolType.OLD_CHEST,
    ],
  ],
  [
    CollectibleType.MOMS_EYESHADOW,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.MOMS_CHEST,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.OLD_CHEST,
    ],
  ],
  [
    CollectibleType.IRON_BAR,
    [ItemPoolType.TREASURE, ItemPoolType.GREED_TREASURE],
  ],
  [CollectibleType.MIDAS_TOUCH, [ItemPoolType.TREASURE]],
  [CollectibleType.HUMBLEING_BUNDLE, [ItemPoolType.SHOP]],
  [
    CollectibleType.FANNY_PACK,
    [ItemPoolType.SHOP, ItemPoolType.BEGGAR, ItemPoolType.GREED_SHOP],
  ],
  [CollectibleType.SHARP_PLUG, [ItemPoolType.SHOP, ItemPoolType.BATTERY_BUM]],
  [
    CollectibleType.GUILLOTINE,
    [ItemPoolType.TREASURE, ItemPoolType.GREED_TREASURE],
  ],
  [
    CollectibleType.BALL_OF_BANDAGES,
    [ItemPoolType.GREED_BOSS, ItemPoolType.BABY_SHOP],
  ],
  [
    CollectibleType.CHAMPION_BELT,
    [
      ItemPoolType.SHOP,
      ItemPoolType.GREED_SHOP,
      ItemPoolType.CRANE_GAME,
      ItemPoolType.ULTRA_SECRET,
    ],
  ],
  [
    CollectibleType.BUTT_BOMBS,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.SHELL_GAME,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.BOMB_BUM,
    ],
  ],
  [
    CollectibleType.GNAWED_LEAF,
    [ItemPoolType.TREASURE, ItemPoolType.GREED_TREASURE],
  ],
  [CollectibleType.SPIDERBABY, [ItemPoolType.TREASURE]],
  [
    CollectibleType.GUPPYS_COLLAR,
    [
      ItemPoolType.DEVIL,
      ItemPoolType.RED_CHEST,
      ItemPoolType.CURSE,
      ItemPoolType.GREED_CURSE,
      ItemPoolType.GREED_DEVIL,
      ItemPoolType.CRANE_GAME,
    ],
  ],
  [
    CollectibleType.LOST_CONTACT,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.SECRET,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.GREED_SECRET,
    ],
  ],
  [
    CollectibleType.ANEMIC,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.ULTRA_SECRET,
    ],
  ],
  [CollectibleType.GOAT_HEAD, [ItemPoolType.DEVIL, ItemPoolType.CURSE]],
  [
    CollectibleType.CEREMONIAL_ROBES,
    [
      ItemPoolType.DEVIL,
      ItemPoolType.DEMON_BEGGAR,
      ItemPoolType.CURSE,
      ItemPoolType.GREED_CURSE,
      ItemPoolType.GREED_DEVIL,
    ],
  ],
  [
    CollectibleType.MOMS_WIG,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.MOMS_CHEST,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.OLD_CHEST,
    ],
  ],
  [CollectibleType.PLACENTA, [ItemPoolType.BOSS]],
  [CollectibleType.OLD_BANDAGE, [ItemPoolType.BOSS]],
  [
    CollectibleType.SAD_BOMBS,
    [ItemPoolType.TREASURE, ItemPoolType.GREED_TREASURE, ItemPoolType.BOMB_BUM],
  ],
  [
    CollectibleType.RUBBER_CEMENT,
    [ItemPoolType.TREASURE, ItemPoolType.GREED_TREASURE],
  ],
  [
    CollectibleType.ANTI_GRAVITY,
    [ItemPoolType.TREASURE, ItemPoolType.GREED_TREASURE],
  ],
  [
    CollectibleType.PYROMANIAC,
    [ItemPoolType.TREASURE, ItemPoolType.GREED_TREASURE],
  ],
  [
    CollectibleType.CRICKETS_BODY,
    [ItemPoolType.TREASURE, ItemPoolType.GREED_TREASURE],
  ],
  [
    CollectibleType.GIMPY,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.DEVIL,
      ItemPoolType.DEMON_BEGGAR,
      ItemPoolType.CURSE,
      ItemPoolType.GREED_CURSE,
      ItemPoolType.GREED_DEVIL,
    ],
  ],
  [
    CollectibleType.BLACK_LOTUS,
    [
      ItemPoolType.SECRET,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.GREED_SECRET,
    ],
  ],
  [
    CollectibleType.PIGGY_BANK,
    [ItemPoolType.TREASURE, ItemPoolType.SHOP, ItemPoolType.CRANE_GAME],
  ],
  [
    CollectibleType.MOMS_PERFUME,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.MOMS_CHEST,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.OLD_CHEST,
    ],
  ],
  [
    CollectibleType.MONSTROS_LUNG,
    [ItemPoolType.TREASURE, ItemPoolType.GREED_TREASURE],
  ],
  [
    CollectibleType.ABADDON,
    [
      ItemPoolType.DEVIL,
      ItemPoolType.DEMON_BEGGAR,
      ItemPoolType.GREED_DEVIL,
      ItemPoolType.ULTRA_SECRET,
    ],
  ],
  [
    CollectibleType.BALL_OF_TAR,
    [ItemPoolType.TREASURE, ItemPoolType.GREED_TREASURE],
  ],
  [CollectibleType.STOP_WATCH, [ItemPoolType.SHOP, ItemPoolType.CRANE_GAME]],
  [
    CollectibleType.TINY_PLANET,
    [ItemPoolType.TREASURE, ItemPoolType.GREED_TREASURE],
  ],
  [
    CollectibleType.INFESTATION_2,
    [ItemPoolType.TREASURE, ItemPoolType.GREED_TREASURE],
  ],
  [
    CollectibleType.E_COLI,
    [ItemPoolType.TREASURE, ItemPoolType.GREED_TREASURE],
  ],
  [
    CollectibleType.DEATHS_TOUCH,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.DEVIL,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.GREED_DEVIL,
    ],
  ],
  [
    CollectibleType.EXPERIMENTAL_TREATMENT,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.BOSS,
      ItemPoolType.DEMON_BEGGAR,
      ItemPoolType.GREED_BOSS,
    ],
  ],
  [
    CollectibleType.CONTRACT_FROM_BELOW,
    [ItemPoolType.DEVIL, ItemPoolType.DEMON_BEGGAR, ItemPoolType.CURSE],
  ],
  [
    CollectibleType.INFAMY,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.SECRET,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.GREED_SECRET,
    ],
  ],
  [
    CollectibleType.TRINITY_SHIELD,
    [ItemPoolType.ANGEL, ItemPoolType.GREED_ANGEL],
  ],
  [
    CollectibleType.TECH_5,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.CRANE_GAME,
    ],
  ],
  [
    CollectibleType.TWENTY_TWENTY,
    [ItemPoolType.TREASURE, ItemPoolType.GREED_TREASURE],
  ],
  [
    CollectibleType.BLUE_MAP,
    [ItemPoolType.SHOP, ItemPoolType.BEGGAR, ItemPoolType.GREED_SHOP],
  ],
  [
    CollectibleType.BFFS,
    [ItemPoolType.SHOP, ItemPoolType.GREED_SHOP, ItemPoolType.ULTRA_SECRET],
  ],
  [CollectibleType.HIVE_MIND, [ItemPoolType.SHOP, ItemPoolType.GREED_SHOP]],
  [CollectibleType.THERES_OPTIONS, [ItemPoolType.SHOP]],
  [CollectibleType.BOGO_BOMBS, [ItemPoolType.SHOP]],
  [
    CollectibleType.STARTER_DECK,
    [ItemPoolType.SHOP, ItemPoolType.GREED_SHOP, ItemPoolType.CRANE_GAME],
  ],
  [CollectibleType.LITTLE_BAGGY, [ItemPoolType.SHOP, ItemPoolType.GREED_SHOP]],
  [
    CollectibleType.MAGIC_SCAB,
    [ItemPoolType.BOSS, ItemPoolType.GREED_BOSS, ItemPoolType.ULTRA_SECRET],
  ],
  [
    CollectibleType.BLOOD_CLOT,
    [
      ItemPoolType.BOSS,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.GREED_BOSS,
      ItemPoolType.ULTRA_SECRET,
    ],
  ],
  [
    CollectibleType.SCREW,
    [
      ItemPoolType.BOSS,
      ItemPoolType.GOLDEN_CHEST,
      ItemPoolType.GREED_BOSS,
      ItemPoolType.CRANE_GAME,
    ],
  ],
  [
    CollectibleType.HOT_BOMBS,
    [ItemPoolType.TREASURE, ItemPoolType.GREED_TREASURE, ItemPoolType.BOMB_BUM],
  ],
  [
    CollectibleType.FIRE_MIND,
    [ItemPoolType.TREASURE, ItemPoolType.GREED_TREASURE],
  ],
  [
    CollectibleType.MISSING_NO,
    [
      ItemPoolType.SECRET,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.GREED_SECRET,
    ],
  ],
  [
    CollectibleType.DARK_MATTER,
    [ItemPoolType.DEVIL, ItemPoolType.DEMON_BEGGAR, ItemPoolType.GREED_DEVIL],
  ],
  [
    CollectibleType.BLACK_CANDLE,
    [
      ItemPoolType.SHOP,
      ItemPoolType.CURSE,
      ItemPoolType.GREED_SHOP,
      ItemPoolType.GREED_CURSE,
    ],
  ],
  [
    CollectibleType.PROPTOSIS,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.ULTRA_SECRET,
    ],
  ],
  [
    CollectibleType.MISSING_PAGE_2,
    [
      ItemPoolType.DEVIL,
      ItemPoolType.SECRET,
      ItemPoolType.DEMON_BEGGAR,
      ItemPoolType.GREED_SECRET,
    ],
  ],
  [
    CollectibleType.CLEAR_RUNE,
    [ItemPoolType.SECRET, ItemPoolType.GREED_SECRET, ItemPoolType.CRANE_GAME],
  ],
  [
    CollectibleType.SMART_FLY,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.KEY_MASTER,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.BABY_SHOP,
    ],
  ],
  [
    CollectibleType.DRY_BABY,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.BABY_SHOP,
    ],
  ],
  [
    CollectibleType.JUICY_SACK,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.BABY_SHOP,
    ],
  ],
  [
    CollectibleType.ROBO_BABY_2,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.CRANE_GAME,
      ItemPoolType.BABY_SHOP,
    ],
  ],
  [
    CollectibleType.ROTTEN_BABY,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.DEVIL,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.GREED_DEVIL,
      ItemPoolType.BABY_SHOP,
      ItemPoolType.ROTTEN_BEGGAR,
    ],
  ],
  [
    CollectibleType.HEADLESS_BABY,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.DEVIL,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.GREED_DEVIL,
      ItemPoolType.BABY_SHOP,
    ],
  ],
  [
    CollectibleType.LEECH,
    [ItemPoolType.TREASURE, ItemPoolType.GREED_DEVIL, ItemPoolType.BABY_SHOP],
  ],
  [
    CollectibleType.MYSTERY_SACK,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.SECRET,
      ItemPoolType.BEGGAR,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.GREED_SECRET,
    ],
  ],
  [
    CollectibleType.BBF,
    [ItemPoolType.TREASURE, ItemPoolType.KEY_MASTER, ItemPoolType.BABY_SHOP],
  ],
  [
    CollectibleType.BOBS_BRAIN,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.BABY_SHOP,
      ItemPoolType.ROTTEN_BEGGAR,
    ],
  ],
  [
    CollectibleType.BEST_BUD,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.BABY_SHOP,
    ],
  ],
  [
    CollectibleType.LIL_BRIMSTONE,
    [ItemPoolType.TREASURE, ItemPoolType.DEVIL, ItemPoolType.BABY_SHOP],
  ],
  [
    CollectibleType.ISAACS_HEART,
    [ItemPoolType.TREASURE, ItemPoolType.ULTRA_SECRET],
  ],
  [
    CollectibleType.LIL_HAUNT,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.BABY_SHOP,
    ],
  ],
  [
    CollectibleType.DARK_BUM,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.DEVIL,
      ItemPoolType.DEMON_BEGGAR,
      ItemPoolType.BABY_SHOP,
    ],
  ],
  [
    CollectibleType.BIG_FAN,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.KEY_MASTER,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.BABY_SHOP,
    ],
  ],
  [
    CollectibleType.SISSY_LONGLEGS,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.BABY_SHOP,
    ],
  ],
  [
    CollectibleType.PUNCHING_BAG,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.BABY_SHOP,
    ],
  ],
  [CollectibleType.HOW_TO_JUMP, [ItemPoolType.TREASURE, ItemPoolType.LIBRARY]],
  [
    CollectibleType.D100,
    [ItemPoolType.TREASURE, ItemPoolType.GREED_SHOP, ItemPoolType.CRANE_GAME],
  ],
  [
    CollectibleType.D4,
    [ItemPoolType.TREASURE, ItemPoolType.GREED_SHOP, ItemPoolType.CRANE_GAME],
  ],
  [
    CollectibleType.D10,
    [ItemPoolType.TREASURE, ItemPoolType.GREED_SHOP, ItemPoolType.CRANE_GAME],
  ],
  [
    CollectibleType.BLANK_CARD,
    [
      ItemPoolType.SHOP,
      ItemPoolType.SECRET,
      ItemPoolType.GREED_SHOP,
      ItemPoolType.GREED_SECRET,
    ],
  ],
  [
    CollectibleType.BOOK_OF_SECRETS,
    [ItemPoolType.TREASURE, ItemPoolType.SECRET, ItemPoolType.LIBRARY],
  ],
  [
    CollectibleType.BOX_OF_SPIDERS,
    [ItemPoolType.TREASURE, ItemPoolType.GREED_TREASURE],
  ],
  [
    CollectibleType.RED_CANDLE,
    [ItemPoolType.SHOP, ItemPoolType.GREED_SHOP, ItemPoolType.ULTRA_SECRET],
  ],
  [CollectibleType.JAR, [ItemPoolType.SHOP]],
  [CollectibleType.FLUSH, [ItemPoolType.TREASURE, ItemPoolType.GREED_TREASURE]],
  [
    CollectibleType.SATANIC_BIBLE,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.DEVIL,
      ItemPoolType.LIBRARY,
      ItemPoolType.GREED_DEVIL,
    ],
  ],
  [CollectibleType.BUTTER_BEAN, [ItemPoolType.TREASURE, ItemPoolType.BEGGAR]],
  [CollectibleType.MAGIC_FINGERS, [ItemPoolType.TREASURE, ItemPoolType.SHOP]],
  [CollectibleType.CONVERTER, [ItemPoolType.SHOP]],
  [
    CollectibleType.BLUE_BOX,
    [ItemPoolType.SHOP, ItemPoolType.RED_CHEST, ItemPoolType.GREED_SHOP],
  ],
  [CollectibleType.UNICORN_STUMP, [ItemPoolType.TREASURE]],
  [
    CollectibleType.TAURUS,
    [ItemPoolType.TREASURE, ItemPoolType.GREED_TREASURE],
  ],
  [CollectibleType.ARIES, [ItemPoolType.TREASURE, ItemPoolType.GREED_TREASURE]],
  [
    CollectibleType.CANCER,
    [ItemPoolType.TREASURE, ItemPoolType.GREED_TREASURE],
  ],
  [CollectibleType.LEO, [ItemPoolType.TREASURE, ItemPoolType.GREED_TREASURE]],
  [CollectibleType.VIRGO, [ItemPoolType.TREASURE, ItemPoolType.GREED_TREASURE]],
  [CollectibleType.LIBRA, [ItemPoolType.TREASURE]],
  [
    CollectibleType.SCORPIO,
    [ItemPoolType.TREASURE, ItemPoolType.GREED_TREASURE],
  ],
  [
    CollectibleType.SAGITTARIUS,
    [ItemPoolType.TREASURE, ItemPoolType.GREED_TREASURE],
  ],
  [
    CollectibleType.CAPRICORN,
    [ItemPoolType.TREASURE, ItemPoolType.GREED_TREASURE],
  ],
  [
    CollectibleType.AQUARIUS,
    [ItemPoolType.TREASURE, ItemPoolType.GREED_TREASURE],
  ],
  [
    CollectibleType.PISCES,
    [ItemPoolType.TREASURE, ItemPoolType.GREED_TREASURE],
  ],
  [
    CollectibleType.EVES_MASCARA,
    [ItemPoolType.TREASURE, ItemPoolType.GREED_TREASURE],
  ],
  [
    CollectibleType.JUDAS_SHADOW,
    [ItemPoolType.DEVIL, ItemPoolType.GREED_DEVIL],
  ],
  [
    CollectibleType.MAGGYS_BOW,
    [ItemPoolType.TREASURE, ItemPoolType.GREED_TREASURE],
  ],
  [
    CollectibleType.HOLY_MANTLE,
    [ItemPoolType.TREASURE, ItemPoolType.ANGEL, ItemPoolType.GREED_ANGEL],
  ],
  [
    CollectibleType.THUNDER_THIGHS,
    [ItemPoolType.TREASURE, ItemPoolType.GREED_BOSS],
  ],
  [
    CollectibleType.STRANGE_ATTRACTOR,
    [ItemPoolType.TREASURE, ItemPoolType.GREED_TREASURE],
  ],
  [
    CollectibleType.CURSED_EYE,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.SECRET,
      ItemPoolType.RED_CHEST,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.GREED_SECRET,
    ],
  ],
  [
    CollectibleType.MYSTERIOUS_LIQUID,
    [ItemPoolType.TREASURE, ItemPoolType.GREED_TREASURE],
  ],
  [
    CollectibleType.GEMINI,
    [ItemPoolType.TREASURE, ItemPoolType.GREED_TREASURE],
  ],
  [
    CollectibleType.CAINS_OTHER_EYE,
    [ItemPoolType.TREASURE, ItemPoolType.GREED_TREASURE],
  ],
  [
    CollectibleType.BLUE_BABYS_ONLY_FRIEND,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.KEY_MASTER,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.BABY_SHOP,
    ],
  ],
  [
    CollectibleType.SAMSONS_CHAINS,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.SECRET,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.GREED_SECRET,
    ],
  ],
  [
    CollectibleType.MONGO_BABY,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.BABY_SHOP,
    ],
  ],
  [CollectibleType.ISAACS_TEARS, [ItemPoolType.TREASURE]],
  [CollectibleType.UNDEFINED, [ItemPoolType.TREASURE]],
  [
    CollectibleType.SCISSORS,
    [ItemPoolType.TREASURE, ItemPoolType.GREED_TREASURE],
  ],
  [CollectibleType.BREATH_OF_LIFE, [ItemPoolType.ANGEL]],
  [
    CollectibleType.LUDOVICO_TECHNIQUE,
    [ItemPoolType.TREASURE, ItemPoolType.GREED_TREASURE],
  ],
  [
    CollectibleType.SOY_MILK,
    [ItemPoolType.TREASURE, ItemPoolType.GREED_TREASURE],
  ],
  [CollectibleType.GODHEAD, [ItemPoolType.ANGEL, ItemPoolType.GREED_ANGEL]],
  [
    CollectibleType.LAZARUS_RAGS,
    [ItemPoolType.TREASURE, ItemPoolType.ANGEL, ItemPoolType.GREED_TREASURE],
  ],
  [
    CollectibleType.MIND,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.ANGEL,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.GREED_ANGEL,
    ],
  ],
  [
    CollectibleType.BODY,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.ANGEL,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.GREED_ANGEL,
      ItemPoolType.ULTRA_SECRET,
    ],
  ],
  [
    CollectibleType.SOUL,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.ANGEL,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.GREED_ANGEL,
    ],
  ],
  [
    CollectibleType.DEAD_ONION,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.ROTTEN_BEGGAR,
    ],
  ],
  [CollectibleType.BROKEN_WATCH, [ItemPoolType.SHOP, ItemPoolType.CRANE_GAME]],
  [CollectibleType.BOOMERANG, [ItemPoolType.SHOP, ItemPoolType.CRANE_GAME]],
  [CollectibleType.SAFETY_PIN, [ItemPoolType.BOSS, ItemPoolType.GREED_BOSS]],
  [
    CollectibleType.CAFFEINE_PILL,
    [ItemPoolType.BOSS, ItemPoolType.DEMON_BEGGAR, ItemPoolType.GREED_BOSS],
  ],
  [
    CollectibleType.TORN_PHOTO,
    [
      ItemPoolType.BOSS,
      ItemPoolType.GOLDEN_CHEST,
      ItemPoolType.GREED_BOSS,
      ItemPoolType.OLD_CHEST,
    ],
  ],
  [CollectibleType.BLUE_CAP, [ItemPoolType.BOSS, ItemPoolType.GREED_BOSS]],
  [
    CollectibleType.LATCH_KEY,
    [
      ItemPoolType.BOSS,
      ItemPoolType.GOLDEN_CHEST,
      ItemPoolType.KEY_MASTER,
      ItemPoolType.GREED_BOSS,
    ],
  ],
  [
    CollectibleType.MATCH_BOOK,
    [ItemPoolType.BOSS, ItemPoolType.GOLDEN_CHEST, ItemPoolType.GREED_BOSS],
  ],
  [
    CollectibleType.SYNTHOIL,
    [ItemPoolType.BOSS, ItemPoolType.DEMON_BEGGAR, ItemPoolType.GREED_BOSS],
  ],
  [CollectibleType.SNACK, [ItemPoolType.BOSS, ItemPoolType.GREED_BOSS]],
  [CollectibleType.DIPLOPIA, [ItemPoolType.SHOP]],
  [
    CollectibleType.PLACEBO,
    [
      ItemPoolType.SHOP,
      ItemPoolType.SECRET,
      ItemPoolType.GREED_SHOP,
      ItemPoolType.GREED_SECRET,
    ],
  ],
  [
    CollectibleType.WOODEN_NICKEL,
    [ItemPoolType.SHOP, ItemPoolType.GREED_TREASURE, ItemPoolType.WOODEN_CHEST],
  ],
  [CollectibleType.TOXIC_SHOCK, [ItemPoolType.TREASURE]],
  [
    CollectibleType.MEGA_BEAN,
    [ItemPoolType.TREASURE, ItemPoolType.GREED_TREASURE],
  ],
  [
    CollectibleType.GLASS_CANNON,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.CRANE_GAME,
    ],
  ],
  [
    CollectibleType.BOMBER_BOY,
    [ItemPoolType.TREASURE, ItemPoolType.GREED_TREASURE, ItemPoolType.BOMB_BUM],
  ],
  [
    CollectibleType.CRACK_JACKS,
    [ItemPoolType.BOSS, ItemPoolType.GOLDEN_CHEST, ItemPoolType.GREED_BOSS],
  ],
  [
    CollectibleType.MOMS_PEARLS,
    [
      ItemPoolType.BOSS,
      ItemPoolType.GOLDEN_CHEST,
      ItemPoolType.MOMS_CHEST,
      ItemPoolType.GREED_BOSS,
      ItemPoolType.OLD_CHEST,
    ],
  ],
  [
    CollectibleType.CAR_BATTERY,
    [ItemPoolType.SHOP, ItemPoolType.BATTERY_BUM, ItemPoolType.GREED_SHOP],
  ],
  [
    CollectibleType.BOX_OF_FRIENDS,
    [ItemPoolType.SHOP, ItemPoolType.GREED_TREASURE, ItemPoolType.CRANE_GAME],
  ],
  [CollectibleType.WIZ, [ItemPoolType.TREASURE, ItemPoolType.GREED_TREASURE]],
  [
    CollectibleType.EIGHT_INCH_NAILS,
    [ItemPoolType.TREASURE, ItemPoolType.GREED_TREASURE],
  ],
  [
    CollectibleType.INCUBUS,
    [ItemPoolType.DEVIL, ItemPoolType.GREED_DEVIL, ItemPoolType.BABY_SHOP],
  ],
  [
    CollectibleType.FATES_REWARD,
    [ItemPoolType.TREASURE, ItemPoolType.BABY_SHOP],
  ],
  [
    CollectibleType.LIL_CHEST,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.BEGGAR,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.CRANE_GAME,
      ItemPoolType.WOODEN_CHEST,
    ],
  ],
  [
    CollectibleType.SWORN_PROTECTOR,
    [ItemPoolType.ANGEL, ItemPoolType.GREED_ANGEL, ItemPoolType.BABY_SHOP],
  ],
  [
    CollectibleType.FRIEND_ZONE,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.KEY_MASTER,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.BABY_SHOP,
    ],
  ],
  [
    CollectibleType.LOST_FLY,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.KEY_MASTER,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.BABY_SHOP,
    ],
  ],
  [
    CollectibleType.SCATTER_BOMBS,
    [ItemPoolType.TREASURE, ItemPoolType.GREED_TREASURE, ItemPoolType.BOMB_BUM],
  ],
  [
    CollectibleType.STICKY_BOMBS,
    [ItemPoolType.TREASURE, ItemPoolType.GREED_TREASURE, ItemPoolType.BOMB_BUM],
  ],
  [
    CollectibleType.EPIPHORA,
    [ItemPoolType.TREASURE, ItemPoolType.GREED_TREASURE],
  ],
  [
    CollectibleType.CONTINUUM,
    [ItemPoolType.TREASURE, ItemPoolType.GREED_TREASURE],
  ],
  [
    CollectibleType.MR_DOLLY,
    [
      ItemPoolType.BOSS,
      ItemPoolType.GOLDEN_CHEST,
      ItemPoolType.GREED_BOSS,
      ItemPoolType.CRANE_GAME,
    ],
  ],
  [
    CollectibleType.CURSE_OF_THE_TOWER,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.RED_CHEST,
      ItemPoolType.CURSE,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.GREED_CURSE,
    ],
  ],
  [
    CollectibleType.CHARGED_BABY,
    [
      ItemPoolType.SHOP,
      ItemPoolType.BATTERY_BUM,
      ItemPoolType.GREED_SHOP,
      ItemPoolType.BABY_SHOP,
    ],
  ],
  [
    CollectibleType.DEAD_EYE,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.ULTRA_SECRET,
    ],
  ],
  [
    CollectibleType.HOLY_LIGHT,
    [ItemPoolType.TREASURE, ItemPoolType.ANGEL, ItemPoolType.GREED_TREASURE],
  ],
  [
    CollectibleType.HOST_HAT,
    [ItemPoolType.TREASURE, ItemPoolType.GREED_TREASURE],
  ],
  [CollectibleType.RESTOCK, [ItemPoolType.SHOP, ItemPoolType.BEGGAR]],
  [
    CollectibleType.BURSTING_SACK,
    [ItemPoolType.TREASURE, ItemPoolType.GREED_TREASURE],
  ],
  [
    CollectibleType.NUMBER_TWO,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.SHELL_GAME,
      ItemPoolType.GREED_TREASURE,
    ],
  ],
  [
    CollectibleType.PUPULA_DUPLEX,
    [ItemPoolType.TREASURE, ItemPoolType.GREED_TREASURE],
  ],
  [
    CollectibleType.PAY_TO_PLAY,
    [ItemPoolType.SHOP, ItemPoolType.GREED_TREASURE, ItemPoolType.GREED_SHOP],
  ],
  [CollectibleType.EDENS_BLESSING, [ItemPoolType.TREASURE]],
  [
    CollectibleType.FRIEND_BALL,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.CRANE_GAME,
    ],
  ],
  [
    CollectibleType.TEAR_DETONATOR,
    [ItemPoolType.SHOP, ItemPoolType.GREED_TREASURE, ItemPoolType.CRANE_GAME],
  ],
  [
    CollectibleType.LIL_GURDY,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.BABY_SHOP,
    ],
  ],
  [
    CollectibleType.BUMBO,
    [ItemPoolType.TREASURE, ItemPoolType.BEGGAR, ItemPoolType.BABY_SHOP],
  ],
  [
    CollectibleType.D12,
    [ItemPoolType.TREASURE, ItemPoolType.GREED_SHOP, ItemPoolType.CRANE_GAME],
  ],
  [CollectibleType.CENSER, [ItemPoolType.ANGEL, ItemPoolType.GREED_ANGEL]],
  [
    CollectibleType.KEY_BUM,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.SECRET,
      ItemPoolType.KEY_MASTER,
      ItemPoolType.BABY_SHOP,
    ],
  ],
  [
    CollectibleType.RUNE_BAG,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.SECRET,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.GREED_SECRET,
    ],
  ],
  [
    CollectibleType.SERAPHIM,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.ANGEL,
      ItemPoolType.GREED_ANGEL,
      ItemPoolType.BABY_SHOP,
    ],
  ],
  [
    CollectibleType.BETRAYAL,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.DEVIL,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.GREED_DEVIL,
    ],
  ],
  [
    CollectibleType.ZODIAC,
    [ItemPoolType.TREASURE, ItemPoolType.GREED_TREASURE],
  ],
  [
    CollectibleType.SERPENTS_KISS,
    [ItemPoolType.TREASURE, ItemPoolType.GREED_TREASURE],
  ],
  [
    CollectibleType.MARKED,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.ULTRA_SECRET,
    ],
  ],
  [
    CollectibleType.TECH_X,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.CRANE_GAME,
    ],
  ],
  [CollectibleType.VENTRICLE_RAZOR, [ItemPoolType.SHOP]],
  [
    CollectibleType.TRACTOR_BEAM,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.CRANE_GAME,
    ],
  ],
  [
    CollectibleType.GODS_FLESH,
    [ItemPoolType.TREASURE, ItemPoolType.GREED_TREASURE],
  ],
  [
    CollectibleType.MAW_OF_THE_VOID,
    [ItemPoolType.DEVIL, ItemPoolType.GREED_DEVIL, ItemPoolType.ULTRA_SECRET],
  ],
  [
    CollectibleType.SPEAR_OF_DESTINY,
    [ItemPoolType.ANGEL, ItemPoolType.GREED_ANGEL],
  ],
  [
    CollectibleType.EXPLOSIVO,
    [ItemPoolType.TREASURE, ItemPoolType.GREED_TREASURE],
  ],
  [
    CollectibleType.CHAOS,
    [
      ItemPoolType.SHOP,
      ItemPoolType.SECRET,
      ItemPoolType.GREED_SHOP,
      ItemPoolType.GREED_SECRET,
    ],
  ],
  [
    CollectibleType.SPIDER_MOD,
    [
      ItemPoolType.SHOP,
      ItemPoolType.GREED_SHOP,
      ItemPoolType.CRANE_GAME,
      ItemPoolType.BABY_SHOP,
    ],
  ],
  [
    CollectibleType.FARTING_BABY,
    [ItemPoolType.TREASURE, ItemPoolType.BABY_SHOP],
  ],
  [
    CollectibleType.GB_BUG,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.SECRET,
      ItemPoolType.GREED_SHOP,
      ItemPoolType.GREED_SECRET,
    ],
  ],
  [
    CollectibleType.D8,
    [ItemPoolType.TREASURE, ItemPoolType.GREED_SHOP, ItemPoolType.CRANE_GAME],
  ],
  [
    CollectibleType.PURITY,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.GREED_ANGEL,
    ],
  ],
  [
    CollectibleType.ATHAME,
    [
      ItemPoolType.DEVIL,
      ItemPoolType.CURSE,
      ItemPoolType.GREED_CURSE,
      ItemPoolType.GREED_DEVIL,
    ],
  ],
  [
    CollectibleType.EMPTY_VESSEL,
    [ItemPoolType.DEVIL, ItemPoolType.DEMON_BEGGAR, ItemPoolType.GREED_DEVIL],
  ],
  [
    CollectibleType.EVIL_EYE,
    [ItemPoolType.TREASURE, ItemPoolType.GREED_TREASURE],
  ],
  [
    CollectibleType.LUSTY_BLOOD,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.DEVIL,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.GREED_DEVIL,
      ItemPoolType.ULTRA_SECRET,
    ],
  ],
  [
    CollectibleType.CAMBION_CONCEPTION,
    [ItemPoolType.DEVIL, ItemPoolType.GREED_DEVIL, ItemPoolType.ULTRA_SECRET],
  ],
  [
    CollectibleType.IMMACULATE_CONCEPTION,
    [ItemPoolType.ANGEL, ItemPoolType.GREED_ANGEL],
  ],
  [CollectibleType.MORE_OPTIONS, [ItemPoolType.SHOP]],
  [
    CollectibleType.CROWN_OF_LIGHT,
    [ItemPoolType.ANGEL, ItemPoolType.GREED_ANGEL],
  ],
  [
    CollectibleType.DEEP_POCKETS,
    [ItemPoolType.SHOP, ItemPoolType.GREED_TREASURE, ItemPoolType.GREED_SHOP],
  ],
  [CollectibleType.SUCCUBUS, [ItemPoolType.DEVIL, ItemPoolType.BABY_SHOP]],
  [CollectibleType.FRUIT_CAKE, [ItemPoolType.TREASURE]],
  [
    CollectibleType.TELEPORT_2,
    [ItemPoolType.TREASURE, ItemPoolType.CRANE_GAME],
  ],
  [
    CollectibleType.BLACK_POWDER,
    [ItemPoolType.DEVIL, ItemPoolType.DEMON_BEGGAR, ItemPoolType.GREED_DEVIL],
  ],
  [
    CollectibleType.KIDNEY_BEAN,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.ULTRA_SECRET,
    ],
  ],
  [
    CollectibleType.GLOWING_HOUR_GLASS,
    [ItemPoolType.TREASURE, ItemPoolType.SHOP, ItemPoolType.CRANE_GAME],
  ],
  [
    CollectibleType.CIRCLE_OF_PROTECTION,
    [ItemPoolType.ANGEL, ItemPoolType.GREED_ANGEL],
  ],
  [
    CollectibleType.SACK_HEAD,
    [ItemPoolType.SHOP, ItemPoolType.SECRET, ItemPoolType.GREED_SECRET],
  ],
  [
    CollectibleType.NIGHT_LIGHT,
    [ItemPoolType.SHOP, ItemPoolType.GREED_TREASURE, ItemPoolType.CRANE_GAME],
  ],
  [
    CollectibleType.OBSESSED_FAN,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.KEY_MASTER,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.BABY_SHOP,
    ],
  ],
  [
    CollectibleType.MINE_CRAFTER,
    [ItemPoolType.TREASURE, ItemPoolType.CRANE_GAME],
  ],
  [
    CollectibleType.PJS,
    [ItemPoolType.BOSS, ItemPoolType.GOLDEN_CHEST, ItemPoolType.GREED_BOSS],
  ],
  [
    CollectibleType.PAPA_FLY,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.KEY_MASTER,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.BABY_SHOP,
    ],
  ],
  [
    CollectibleType.MULTIDIMENSIONAL_BABY,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.DEVIL,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.GREED_DEVIL,
    ],
  ],
  [
    CollectibleType.GLITTER_BOMBS,
    [ItemPoolType.TREASURE, ItemPoolType.GREED_TREASURE, ItemPoolType.BOMB_BUM],
  ],
  [CollectibleType.MY_SHADOW, [ItemPoolType.DEVIL, ItemPoolType.GREED_DEVIL]],
  [
    CollectibleType.JAR_OF_FLIES,
    [ItemPoolType.SHOP, ItemPoolType.GREED_TREASURE, ItemPoolType.GREED_SHOP],
  ],
  [
    CollectibleType.LIL_LOKI,
    [ItemPoolType.TREASURE, ItemPoolType.ULTRA_SECRET, ItemPoolType.BABY_SHOP],
  ],
  [CollectibleType.MILK, [ItemPoolType.TREASURE, ItemPoolType.GREED_TREASURE]],
  [CollectibleType.D7, [ItemPoolType.TREASURE, ItemPoolType.CRANE_GAME]],
  [
    CollectibleType.BINKY,
    [
      ItemPoolType.BOSS,
      ItemPoolType.GOLDEN_CHEST,
      ItemPoolType.GREED_BOSS,
      ItemPoolType.CRANE_GAME,
    ],
  ],
  [
    CollectibleType.MOMS_BOX,
    [
      ItemPoolType.SHOP,
      ItemPoolType.MOMS_CHEST,
      ItemPoolType.GREED_SHOP,
      ItemPoolType.CRANE_GAME,
      ItemPoolType.OLD_CHEST,
      ItemPoolType.WOODEN_CHEST,
    ],
  ],
  [
    CollectibleType.KIDNEY_STONE,
    [ItemPoolType.TREASURE, ItemPoolType.GREED_TREASURE],
  ],
  [CollectibleType.MEGA_BLAST, [ItemPoolType.DEVIL, ItemPoolType.GREED_DEVIL]],
  [
    CollectibleType.DARK_PRINCES_CROWN,
    [
      ItemPoolType.DEVIL,
      ItemPoolType.CURSE,
      ItemPoolType.GREED_CURSE,
      ItemPoolType.GREED_DEVIL,
    ],
  ],
  [
    CollectibleType.APPLE,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.ULTRA_SECRET,
    ],
  ],
  [
    CollectibleType.LEAD_PENCIL,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.GOLDEN_CHEST,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.CRANE_GAME,
    ],
  ],
  [
    CollectibleType.DOG_TOOTH,
    [ItemPoolType.TREASURE, ItemPoolType.GREED_TREASURE],
  ],
  [
    CollectibleType.DEAD_TOOTH,
    [ItemPoolType.TREASURE, ItemPoolType.GREED_TREASURE],
  ],
  [
    CollectibleType.LINGER_BEAN,
    [ItemPoolType.TREASURE, ItemPoolType.BEGGAR, ItemPoolType.GREED_TREASURE],
  ],
  [
    CollectibleType.SHARD_OF_GLASS,
    [ItemPoolType.TREASURE, ItemPoolType.GREED_TREASURE],
  ],
  [
    CollectibleType.METAL_PLATE,
    [ItemPoolType.TREASURE, ItemPoolType.GREED_TREASURE],
  ],
  [
    CollectibleType.EYE_OF_GREED,
    [
      ItemPoolType.SECRET,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.GREED_SECRET,
    ],
  ],
  [
    CollectibleType.TAROT_CLOTH,
    [
      ItemPoolType.SHOP,
      ItemPoolType.CURSE,
      ItemPoolType.GREED_SHOP,
      ItemPoolType.GREED_CURSE,
      ItemPoolType.GREED_DEVIL,
      ItemPoolType.CRANE_GAME,
    ],
  ],
  [
    CollectibleType.VARICOSE_VEINS,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.ULTRA_SECRET,
    ],
  ],
  [
    CollectibleType.COMPOUND_FRACTURE,
    [ItemPoolType.TREASURE, ItemPoolType.GREED_TREASURE],
  ],
  [
    CollectibleType.POLYDACTYLY,
    [ItemPoolType.TREASURE, ItemPoolType.GREED_TREASURE],
  ],
  [
    CollectibleType.DADS_LOST_COIN,
    [
      ItemPoolType.BOSS,
      ItemPoolType.GOLDEN_CHEST,
      ItemPoolType.BEGGAR,
      ItemPoolType.GREED_BOSS,
      ItemPoolType.OLD_CHEST,
    ],
  ],
  [
    CollectibleType.MIDNIGHT_SNACK,
    [
      ItemPoolType.BOSS,
      ItemPoolType.GOLDEN_CHEST,
      ItemPoolType.BEGGAR,
      ItemPoolType.GREED_BOSS,
    ],
  ],
  [
    CollectibleType.CONE_HEAD,
    [ItemPoolType.TREASURE, ItemPoolType.GREED_TREASURE],
  ],
  [
    CollectibleType.BELLY_BUTTON,
    [ItemPoolType.TREASURE, ItemPoolType.GREED_TREASURE],
  ],
  [
    CollectibleType.SINUS_INFECTION,
    [ItemPoolType.TREASURE, ItemPoolType.GREED_TREASURE],
  ],
  [
    CollectibleType.GLAUCOMA,
    [ItemPoolType.TREASURE, ItemPoolType.GREED_TREASURE],
  ],
  [
    CollectibleType.PARASITOID,
    [ItemPoolType.TREASURE, ItemPoolType.GREED_TREASURE],
  ],
  [
    CollectibleType.EYE_OF_BELIAL,
    [ItemPoolType.DEVIL, ItemPoolType.GREED_DEVIL, ItemPoolType.ULTRA_SECRET],
  ],
  [
    CollectibleType.SULFURIC_ACID,
    [ItemPoolType.TREASURE, ItemPoolType.GREED_TREASURE],
  ],
  [
    CollectibleType.GLYPH_OF_BALANCE,
    [ItemPoolType.ANGEL, ItemPoolType.GREED_ANGEL],
  ],
  [
    CollectibleType.ANALOG_STICK,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.CRANE_GAME,
    ],
  ],
  [
    CollectibleType.CONTAGION,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.ULTRA_SECRET,
    ],
  ],
  [
    CollectibleType.FINGER,
    [ItemPoolType.TREASURE, ItemPoolType.GREED_TREASURE],
  ],
  [
    CollectibleType.SHADE,
    [
      ItemPoolType.DEVIL,
      ItemPoolType.CURSE,
      ItemPoolType.GREED_CURSE,
      ItemPoolType.GREED_DEVIL,
      ItemPoolType.BABY_SHOP,
    ],
  ],
  [
    CollectibleType.DEPRESSION,
    [ItemPoolType.TREASURE, ItemPoolType.GREED_TREASURE],
  ],
  [
    CollectibleType.HUSHY,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.BABY_SHOP,
    ],
  ],
  [
    CollectibleType.LIL_MONSTRO,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.BABY_SHOP,
    ],
  ],
  [
    CollectibleType.KING_BABY,
    [ItemPoolType.SHOP, ItemPoolType.GREED_SHOP, ItemPoolType.BABY_SHOP],
  ],
  [
    CollectibleType.BIG_CHUBBY,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.BABY_SHOP,
    ],
  ],
  [
    CollectibleType.PLAN_C,
    [
      ItemPoolType.SHOP,
      ItemPoolType.DEVIL,
      ItemPoolType.RED_CHEST,
      ItemPoolType.DEMON_BEGGAR,
      ItemPoolType.CURSE,
      ItemPoolType.GREED_SHOP,
      ItemPoolType.GREED_CURSE,
      ItemPoolType.ULTRA_SECRET,
    ],
  ],
  [
    CollectibleType.D1,
    [ItemPoolType.TREASURE, ItemPoolType.GREED_SHOP, ItemPoolType.CRANE_GAME],
  ],
  [
    CollectibleType.VOID,
    [ItemPoolType.DEVIL, ItemPoolType.ANGEL, ItemPoolType.GREED_SHOP],
  ],
  [
    CollectibleType.PAUSE,
    [ItemPoolType.TREASURE, ItemPoolType.GREED_SHOP, ItemPoolType.CRANE_GAME],
  ],
  [CollectibleType.SMELTER, [ItemPoolType.SHOP]],
  [CollectibleType.COMPOST, [ItemPoolType.SHOP, ItemPoolType.ROTTEN_BEGGAR]],
  [
    CollectibleType.DATAMINER,
    [ItemPoolType.TREASURE, ItemPoolType.GREED_SHOP, ItemPoolType.ULTRA_SECRET],
  ],
  [CollectibleType.CLICKER, [ItemPoolType.TREASURE, ItemPoolType.GREED_SHOP]],
  [
    CollectibleType.MAMA_MEGA,
    [ItemPoolType.SHOP, ItemPoolType.GREED_SHOP, ItemPoolType.BOMB_BUM],
  ],
  [
    CollectibleType.CROOKED_PENNY,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.SHOP,
      ItemPoolType.BEGGAR,
      ItemPoolType.GREED_SHOP,
    ],
  ],
  [CollectibleType.DULL_RAZOR, [ItemPoolType.SHOP, ItemPoolType.GREED_SHOP]],
  [
    CollectibleType.POTATO_PEELER,
    [ItemPoolType.SHOP, ItemPoolType.DEMON_BEGGAR, ItemPoolType.GREED_SHOP],
  ],
  [
    CollectibleType.METRONOME,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.GREED_SHOP,
      ItemPoolType.CRANE_GAME,
      ItemPoolType.WOODEN_CHEST,
    ],
  ],
  [
    CollectibleType.D_INFINITY,
    [ItemPoolType.SECRET, ItemPoolType.GREED_SHOP, ItemPoolType.GREED_SECRET],
  ],
  [CollectibleType.EDENS_SOUL, [ItemPoolType.ANGEL, ItemPoolType.GREED_ANGEL]],
  [CollectibleType.ACID_BABY, [ItemPoolType.TREASURE, ItemPoolType.BABY_SHOP]],
  [
    CollectibleType.YO_LISTEN,
    [ItemPoolType.TREASURE, ItemPoolType.KEY_MASTER, ItemPoolType.BABY_SHOP],
  ],
  [
    CollectibleType.ADRENALINE,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.DEMON_BEGGAR,
      ItemPoolType.GREED_TREASURE,
    ],
  ],
  [
    CollectibleType.JACOBS_LADDER,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.BATTERY_BUM,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.CRANE_GAME,
    ],
  ],
  [
    CollectibleType.GHOST_PEPPER,
    [ItemPoolType.TREASURE, ItemPoolType.GREED_TREASURE],
  ],
  [
    CollectibleType.EUTHANASIA,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.DEMON_BEGGAR,
      ItemPoolType.CURSE,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.GREED_CURSE,
    ],
  ],
  [
    CollectibleType.CAMO_UNDIES,
    [ItemPoolType.TREASURE, ItemPoolType.GREED_TREASURE],
  ],
  [CollectibleType.DUALITY, [ItemPoolType.DEVIL, ItemPoolType.ANGEL]],
  [CollectibleType.EUCHARIST, [ItemPoolType.ANGEL, ItemPoolType.GREED_ANGEL]],
  [
    CollectibleType.SACK_OF_SACKS,
    [ItemPoolType.SECRET, ItemPoolType.GREED_SHOP, ItemPoolType.GREED_SECRET],
  ],
  [
    CollectibleType.GREEDS_GULLET,
    [ItemPoolType.SECRET, ItemPoolType.GREED_SECRET],
  ],
  [
    CollectibleType.LARGE_ZIT,
    [ItemPoolType.TREASURE, ItemPoolType.GREED_TREASURE],
  ],
  [
    CollectibleType.LITTLE_HORN,
    [
      ItemPoolType.DEVIL,
      ItemPoolType.DEMON_BEGGAR,
      ItemPoolType.CURSE,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.GREED_CURSE,
      ItemPoolType.GREED_DEVIL,
    ],
  ],
  [
    CollectibleType.BROWN_NUGGET,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.SHELL_GAME,
      ItemPoolType.GREED_TREASURE,
    ],
  ],
  [
    CollectibleType.POKE_GO,
    [ItemPoolType.SHOP, ItemPoolType.GREED_SHOP, ItemPoolType.CRANE_GAME],
  ],
  [
    CollectibleType.BACKSTABBER,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.ULTRA_SECRET,
    ],
  ],
  [
    CollectibleType.SHARP_STRAW,
    [ItemPoolType.TREASURE, ItemPoolType.GREED_TREASURE],
  ],
  [
    CollectibleType.MOMS_RAZOR,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.MOMS_CHEST,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.OLD_CHEST,
    ],
  ],
  [
    CollectibleType.BLOODSHOT_EYE,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.BABY_SHOP,
    ],
  ],
  [CollectibleType.DELIRIOUS, [ItemPoolType.ANGEL]],
  [
    CollectibleType.ANGRY_FLY,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.ULTRA_SECRET,
      ItemPoolType.BABY_SHOP,
    ],
  ],
  [
    CollectibleType.BLACK_HOLE,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.GREED_SHOP,
    ],
  ],
  [CollectibleType.BOZO, [ItemPoolType.TREASURE, ItemPoolType.GREED_TREASURE]],
  [
    CollectibleType.BROKEN_MODEM,
    [ItemPoolType.SHOP, ItemPoolType.GREED_TREASURE],
  ],
  [
    CollectibleType.MYSTERY_GIFT,
    [
      ItemPoolType.SHOP,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.GREED_SHOP,
      ItemPoolType.CRANE_GAME,
    ],
  ],
  [
    CollectibleType.SPRINKLER,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.GREED_SHOP,
      ItemPoolType.CRANE_GAME,
    ],
  ],
  [
    CollectibleType.FAST_BOMBS,
    [ItemPoolType.TREASURE, ItemPoolType.GREED_TREASURE, ItemPoolType.BOMB_BUM],
  ],
  [
    CollectibleType.BUDDY_IN_A_BOX,
    [
      ItemPoolType.SHOP,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.GREED_SHOP,
      ItemPoolType.CRANE_GAME,
      ItemPoolType.BABY_SHOP,
    ],
  ],
  [
    CollectibleType.LIL_DELIRIUM,
    [
      ItemPoolType.DEVIL,
      ItemPoolType.ANGEL,
      ItemPoolType.GREED_DEVIL,
      ItemPoolType.BABY_SHOP,
    ],
  ],
  [
    CollectibleType.JUMPER_CABLES,
    [ItemPoolType.SHOP, ItemPoolType.BATTERY_BUM, ItemPoolType.GREED_TREASURE],
  ],
  [CollectibleType.COUPON, [ItemPoolType.SHOP]],
  [
    CollectibleType.TELEKINESIS,
    [ItemPoolType.TREASURE, ItemPoolType.GREED_TREASURE],
  ],
  [CollectibleType.MOVING_BOX, [ItemPoolType.SHOP]],
  [
    CollectibleType.TECHNOLOGY_ZERO,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.CRANE_GAME,
    ],
  ],
  [
    CollectibleType.LEPROSY,
    [ItemPoolType.TREASURE, ItemPoolType.GREED_TREASURE],
  ],
  [
    CollectibleType.SEVEN_SEALS,
    [
      ItemPoolType.DEVIL,
      ItemPoolType.ANGEL,
      ItemPoolType.GREED_DEVIL,
      ItemPoolType.GREED_ANGEL,
    ],
  ],
  [
    CollectibleType.MR_ME,
    [
      ItemPoolType.SHOP,
      ItemPoolType.KEY_MASTER,
      ItemPoolType.GREED_SHOP,
      ItemPoolType.CRANE_GAME,
      ItemPoolType.WOODEN_CHEST,
    ],
  ],
  [
    CollectibleType.ANGELIC_PRISM,
    [ItemPoolType.ANGEL, ItemPoolType.GREED_ANGEL],
  ],
  [CollectibleType.POP, [ItemPoolType.TREASURE, ItemPoolType.GREED_TREASURE]],
  [CollectibleType.DEATHS_LIST, [ItemPoolType.DEVIL]],
  [
    CollectibleType.HAEMOLACRIA,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.ULTRA_SECRET,
    ],
  ],
  [
    CollectibleType.LACHRYPHAGY,
    [ItemPoolType.TREASURE, ItemPoolType.GREED_TREASURE],
  ],
  [CollectibleType.TRISAGION, [ItemPoolType.ANGEL, ItemPoolType.GREED_ANGEL]],
  [
    CollectibleType.SCHOOLBAG,
    [ItemPoolType.SHOP, ItemPoolType.GOLDEN_CHEST, ItemPoolType.GREED_SHOP],
  ],
  [CollectibleType.BLANKET, [ItemPoolType.SHOP, ItemPoolType.GREED_SHOP]],
  [
    CollectibleType.SACRIFICIAL_ALTAR,
    [
      ItemPoolType.DEVIL,
      ItemPoolType.CURSE,
      ItemPoolType.GREED_CURSE,
      ItemPoolType.GREED_DEVIL,
    ],
  ],
  [
    CollectibleType.LIL_SPEWER,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.BABY_SHOP,
    ],
  ],
  [
    CollectibleType.MARBLES,
    [ItemPoolType.BOSS, ItemPoolType.GREED_BOSS, ItemPoolType.CRANE_GAME],
  ],
  [
    CollectibleType.MYSTERY_EGG,
    [ItemPoolType.TREASURE, ItemPoolType.GREED_TREASURE],
  ],
  [
    CollectibleType.FLAT_STONE,
    [ItemPoolType.TREASURE, ItemPoolType.GREED_TREASURE],
  ],
  [
    CollectibleType.MARROW,
    [ItemPoolType.BOSS, ItemPoolType.GREED_BOSS, ItemPoolType.ULTRA_SECRET],
  ],
  [
    CollectibleType.SLIPPED_RIB,
    [ItemPoolType.TREASURE, ItemPoolType.GREED_TREASURE],
  ],
  [
    CollectibleType.HALLOWED_GROUND,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.ANGEL,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.GREED_ANGEL,
    ],
  ],
  [
    CollectibleType.POINTY_RIB,
    [ItemPoolType.TREASURE, ItemPoolType.GREED_TREASURE],
  ],
  [
    CollectibleType.BOOK_OF_THE_DEAD,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.DEVIL,
      ItemPoolType.LIBRARY,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.GREED_DEVIL,
    ],
  ],
  [
    CollectibleType.DADS_RING,
    [ItemPoolType.SECRET, ItemPoolType.GREED_SECRET, ItemPoolType.OLD_CHEST],
  ],
  [
    CollectibleType.DIVORCE_PAPERS,
    [ItemPoolType.BOSS, ItemPoolType.GREED_BOSS, ItemPoolType.OLD_CHEST],
  ],
  [
    CollectibleType.JAW_BONE,
    [ItemPoolType.TREASURE, ItemPoolType.GREED_TREASURE],
  ],
  [
    CollectibleType.BRITTLE_BONES,
    [ItemPoolType.TREASURE, ItemPoolType.GREED_TREASURE],
  ],
  [
    CollectibleType.MUCORMYCOSIS,
    [ItemPoolType.TREASURE, ItemPoolType.GREED_TREASURE],
  ],
  [
    CollectibleType.TWO_SPOOKY,
    [ItemPoolType.DEVIL, ItemPoolType.GREED_DEVIL, ItemPoolType.ULTRA_SECRET],
  ],
  [
    CollectibleType.GOLDEN_RAZOR,
    [ItemPoolType.TREASURE, ItemPoolType.GREED_TREASURE],
  ],
  [
    CollectibleType.SULFUR,
    [ItemPoolType.DEVIL, ItemPoolType.GREED_DEVIL, ItemPoolType.ULTRA_SECRET],
  ],
  [
    CollectibleType.FORTUNE_COOKIE,
    [ItemPoolType.TREASURE, ItemPoolType.GREED_TREASURE],
  ],
  [
    CollectibleType.EYE_SORE,
    [ItemPoolType.TREASURE, ItemPoolType.GREED_TREASURE],
  ],
  [
    CollectibleType.ONE_HUNDRED_TWENTY_VOLT,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.BATTERY_BUM,
      ItemPoolType.GREED_TREASURE,
    ],
  ],
  [
    CollectibleType.IT_HURTS,
    [ItemPoolType.TREASURE, ItemPoolType.GREED_TREASURE],
  ],
  [
    CollectibleType.ALMOND_MILK,
    [ItemPoolType.TREASURE, ItemPoolType.GREED_TREASURE],
  ],
  [
    CollectibleType.ROCK_BOTTOM,
    [ItemPoolType.SECRET, ItemPoolType.GREED_SECRET],
  ],
  [
    CollectibleType.NANCY_BOMBS,
    [ItemPoolType.TREASURE, ItemPoolType.GREED_TREASURE, ItemPoolType.BOMB_BUM],
  ],
  [CollectibleType.BAR_OF_SOAP, [ItemPoolType.BOSS, ItemPoolType.GREED_BOSS]],
  [
    CollectibleType.BLOOD_PUPPY,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.RED_CHEST,
      ItemPoolType.CURSE,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.GREED_CURSE,
      ItemPoolType.ULTRA_SECRET,
    ],
  ],
  [CollectibleType.DREAM_CATCHER, [ItemPoolType.SHOP, ItemPoolType.GREED_SHOP]],
  [
    CollectibleType.PASCHAL_CANDLE,
    [ItemPoolType.ANGEL, ItemPoolType.GREED_ANGEL],
  ],
  [
    CollectibleType.DIVINE_INTERVENTION,
    [ItemPoolType.ANGEL, ItemPoolType.GREED_ANGEL],
  ],
  [
    CollectibleType.BLOOD_OATH,
    [
      ItemPoolType.DEVIL,
      ItemPoolType.CURSE,
      ItemPoolType.GREED_CURSE,
      ItemPoolType.GREED_DEVIL,
    ],
  ],
  [
    CollectibleType.PLAYDOUGH_COOKIE,
    [ItemPoolType.TREASURE, ItemPoolType.GREED_TREASURE],
  ],
  [
    CollectibleType.ORPHAN_SOCKS,
    [ItemPoolType.SECRET, ItemPoolType.GOLDEN_CHEST, ItemPoolType.GREED_SECRET],
  ],
  [
    CollectibleType.EYE_OF_THE_OCCULT,
    [ItemPoolType.DEVIL, ItemPoolType.GREED_DEVIL, ItemPoolType.ULTRA_SECRET],
  ],
  [
    CollectibleType.IMMACULATE_HEART,
    [ItemPoolType.ANGEL, ItemPoolType.GREED_ANGEL, ItemPoolType.ULTRA_SECRET],
  ],
  [CollectibleType.MONSTRANCE, [ItemPoolType.ANGEL, ItemPoolType.GREED_ANGEL]],
  [
    CollectibleType.INTRUDER,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.BABY_SHOP,
    ],
  ],
  [
    CollectibleType.DIRTY_MIND,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.SHELL_GAME,
      ItemPoolType.GREED_TREASURE,
    ],
  ],
  [CollectibleType.DAMOCLES, [ItemPoolType.DEVIL, ItemPoolType.GREED_DEVIL]],
  [
    CollectibleType.FREE_LEMONADE,
    [ItemPoolType.TREASURE, ItemPoolType.GREED_TREASURE],
  ],
  [
    CollectibleType.SPIRIT_SWORD,
    [ItemPoolType.ANGEL, ItemPoolType.GREED_ANGEL],
  ],
  [
    CollectibleType.RED_KEY,
    [
      ItemPoolType.SECRET,
      ItemPoolType.RED_CHEST,
      ItemPoolType.CURSE,
      ItemPoolType.KEY_MASTER,
      ItemPoolType.MOMS_CHEST,
      ItemPoolType.ULTRA_SECRET,
    ],
  ],
  [
    CollectibleType.PSY_FLY,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.KEY_MASTER,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.BABY_SHOP,
    ],
  ],
  [CollectibleType.WAVY_CAP, [ItemPoolType.SECRET, ItemPoolType.GREED_SECRET]],
  [
    CollectibleType.ROCKET_IN_A_JAR,
    [ItemPoolType.TREASURE, ItemPoolType.GREED_TREASURE, ItemPoolType.BOMB_BUM],
  ],
  [
    CollectibleType.BOOK_OF_VIRTUES,
    [ItemPoolType.ANGEL, ItemPoolType.LIBRARY, ItemPoolType.GREED_ANGEL],
  ],
  [CollectibleType.ALABASTER_BOX, [ItemPoolType.SHOP, ItemPoolType.GREED_SHOP]],
  [CollectibleType.STAIRWAY, [ItemPoolType.ANGEL, ItemPoolType.GREED_ANGEL]],
  [CollectibleType.SOL, [ItemPoolType.PLANETARIUM]],
  [CollectibleType.LUNA, [ItemPoolType.PLANETARIUM]],
  [CollectibleType.MERCURIUS, [ItemPoolType.PLANETARIUM]],
  [CollectibleType.VENUS, [ItemPoolType.PLANETARIUM]],
  [CollectibleType.TERRA, [ItemPoolType.PLANETARIUM]],
  [CollectibleType.MARS, [ItemPoolType.PLANETARIUM]],
  [CollectibleType.JUPITER, [ItemPoolType.PLANETARIUM]],
  [CollectibleType.SATURNUS, [ItemPoolType.PLANETARIUM]],
  [CollectibleType.URANUS, [ItemPoolType.PLANETARIUM]],
  [CollectibleType.NEPTUNUS, [ItemPoolType.PLANETARIUM]],
  [CollectibleType.PLUTO, [ItemPoolType.PLANETARIUM]],
  [CollectibleType.VOODOO_HEAD, [ItemPoolType.SHOP, ItemPoolType.CRANE_GAME]],
  [CollectibleType.EYE_DROPS, [ItemPoolType.BOSS, ItemPoolType.GREED_BOSS]],
  [
    CollectibleType.ACT_OF_CONTRITION,
    [ItemPoolType.ANGEL, ItemPoolType.GREED_ANGEL],
  ],
  [CollectibleType.MEMBER_CARD, [ItemPoolType.SHOP]],
  [
    CollectibleType.BATTERY_PACK,
    [ItemPoolType.SHOP, ItemPoolType.BATTERY_BUM, ItemPoolType.GREED_SHOP],
  ],
  [
    CollectibleType.MOMS_BRACELET,
    [
      ItemPoolType.SHOP,
      ItemPoolType.GREED_SHOP,
      ItemPoolType.CRANE_GAME,
      ItemPoolType.OLD_CHEST,
    ],
  ],
  [
    CollectibleType.SCOOPER,
    [ItemPoolType.TREASURE, ItemPoolType.GREED_TREASURE],
  ],
  [
    CollectibleType.OCULAR_RIFT,
    [ItemPoolType.DEVIL, ItemPoolType.GREED_DEVIL, ItemPoolType.ULTRA_SECRET],
  ],
  [
    CollectibleType.BOILED_BABY,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.ULTRA_SECRET,
      ItemPoolType.BABY_SHOP,
    ],
  ],
  [
    CollectibleType.FREEZER_BABY,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.BABY_SHOP,
    ],
  ],
  [
    CollectibleType.ETERNAL_D6,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.SECRET,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.GREED_SECRET,
      ItemPoolType.CRANE_GAME,
    ],
  ],
  [
    CollectibleType.BIRD_CAGE,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.BABY_SHOP,
    ],
  ],
  [
    CollectibleType.LARYNX,
    [ItemPoolType.TREASURE, ItemPoolType.GREED_TREASURE],
  ],
  [
    CollectibleType.LOST_SOUL,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.SECRET,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.GREED_SECRET,
      ItemPoolType.BABY_SHOP,
    ],
  ],
  [
    CollectibleType.BLOOD_BOMBS,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.ULTRA_SECRET,
      ItemPoolType.BOMB_BUM,
    ],
  ],
  [
    CollectibleType.LIL_DUMPY,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.BABY_SHOP,
    ],
  ],
  [
    CollectibleType.BIRDS_EYE,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.ULTRA_SECRET,
    ],
  ],
  [
    CollectibleType.LODESTONE,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.CRANE_GAME,
    ],
  ],
  [
    CollectibleType.ROTTEN_TOMATO,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.ULTRA_SECRET,
      ItemPoolType.ROTTEN_BEGGAR,
    ],
  ],
  [CollectibleType.BIRTHRIGHT, [ItemPoolType.SHOP, ItemPoolType.GREED_SHOP]],
  [
    CollectibleType.RED_STEW,
    [ItemPoolType.SHOP, ItemPoolType.GREED_SHOP, ItemPoolType.ULTRA_SECRET],
  ],
  [CollectibleType.GENESIS, [ItemPoolType.ANGEL, ItemPoolType.GREED_ANGEL]],
  [CollectibleType.SHARP_KEY, [ItemPoolType.SHOP, ItemPoolType.GREED_SHOP]],
  [
    CollectibleType.BOOSTER_PACK,
    [
      ItemPoolType.SHOP,
      ItemPoolType.BOSS,
      ItemPoolType.GREED_BOSS,
      ItemPoolType.GREED_SHOP,
      ItemPoolType.CRANE_GAME,
    ],
  ],
  [
    CollectibleType.MEGA_MUSH,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.SECRET,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.GREED_SECRET,
    ],
  ],
  [
    CollectibleType.DEATH_CERTIFICATE,
    [ItemPoolType.SECRET, ItemPoolType.GREED_SECRET],
  ],
  [
    CollectibleType.BOT_FLY,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.KEY_MASTER,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.CRANE_GAME,
      ItemPoolType.BABY_SHOP,
    ],
  ],
  [
    CollectibleType.MEAT_CLEAVER,
    [ItemPoolType.TREASURE, ItemPoolType.GREED_TREASURE],
  ],
  [
    CollectibleType.EVIL_CHARM,
    [ItemPoolType.SECRET, ItemPoolType.GREED_SECRET],
  ],
  [
    CollectibleType.PURGATORY,
    [
      ItemPoolType.DEVIL,
      ItemPoolType.ANGEL,
      ItemPoolType.GREED_DEVIL,
      ItemPoolType.GREED_ANGEL,
    ],
  ],
  [
    CollectibleType.STITCHES,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.BABY_SHOP,
    ],
  ],
  [
    CollectibleType.R_KEY,
    [ItemPoolType.SECRET, ItemPoolType.GREED_SHOP, ItemPoolType.GREED_SECRET],
  ],
  [
    CollectibleType.KNOCKOUT_DROPS,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.ULTRA_SECRET,
    ],
  ],
  [
    CollectibleType.ERASER,
    [ItemPoolType.SHOP, ItemPoolType.GREED_SHOP, ItemPoolType.CRANE_GAME],
  ],
  [
    CollectibleType.YUCK_HEART,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.ROTTEN_BEGGAR,
    ],
  ],
  [
    CollectibleType.URN_OF_SOULS,
    [ItemPoolType.ANGEL, ItemPoolType.GREED_ANGEL],
  ],
  [
    CollectibleType.AKELDAMA,
    [ItemPoolType.TREASURE, ItemPoolType.GREED_TREASURE],
  ],
  [
    CollectibleType.MAGIC_SKIN,
    [
      ItemPoolType.SHOP,
      ItemPoolType.RED_CHEST,
      ItemPoolType.CURSE,
      ItemPoolType.GREED_CURSE,
    ],
  ],
  [CollectibleType.REVELATION, [ItemPoolType.ANGEL, ItemPoolType.GREED_ANGEL]],
  [
    CollectibleType.CONSOLATION_PRIZE,
    [
      ItemPoolType.BOSS,
      ItemPoolType.GOLDEN_CHEST,
      ItemPoolType.GREED_BOSS,
      ItemPoolType.CRANE_GAME,
    ],
  ],
  [
    CollectibleType.TINYTOMA,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.BABY_SHOP,
    ],
  ],
  [
    CollectibleType.BRIMSTONE_BOMBS,
    [ItemPoolType.DEVIL, ItemPoolType.GREED_DEVIL, ItemPoolType.BOMB_BUM],
  ],
  [
    CollectibleType.FOUR_FIVE_VOLT,
    [ItemPoolType.SHOP, ItemPoolType.BATTERY_BUM, ItemPoolType.GREED_SHOP],
  ],
  [
    CollectibleType.FRUITY_PLUM,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.KEY_MASTER,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.CRANE_GAME,
      ItemPoolType.BABY_SHOP,
    ],
  ],
  [
    CollectibleType.PLUM_FLUTE,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.ULTRA_SECRET,
    ],
  ],
  [
    CollectibleType.STAR_OF_BETHLEHEM,
    [ItemPoolType.ANGEL, ItemPoolType.GREED_ANGEL],
  ],
  [
    CollectibleType.CUBE_BABY,
    [ItemPoolType.TREASURE, ItemPoolType.GREED_TREASURE],
  ],
  [CollectibleType.VADE_RETRO, [ItemPoolType.ANGEL, ItemPoolType.GREED_ANGEL]],
  [
    CollectibleType.FALSE_PHD,
    [
      ItemPoolType.DEVIL,
      ItemPoolType.RED_CHEST,
      ItemPoolType.CURSE,
      ItemPoolType.GREED_CURSE,
      ItemPoolType.GREED_DEVIL,
      ItemPoolType.ULTRA_SECRET,
    ],
  ],
  [
    CollectibleType.SPIN_TO_WIN,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.CRANE_GAME,
    ],
  ],
  [
    CollectibleType.VASCULITIS,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.ULTRA_SECRET,
    ],
  ],
  [
    CollectibleType.GIANT_CELL,
    [ItemPoolType.TREASURE, ItemPoolType.GREED_TREASURE],
  ],
  [CollectibleType.TROPICAMIDE, [ItemPoolType.BOSS, ItemPoolType.GREED_BOSS]],
  [CollectibleType.CARD_READING, [ItemPoolType.SHOP]],
  [
    CollectibleType.QUINTS,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.BABY_SHOP,
    ],
  ],
  [
    CollectibleType.TOOTH_AND_NAIL,
    [ItemPoolType.TREASURE, ItemPoolType.GREED_TREASURE],
  ],
  [
    CollectibleType.BINGE_EATER,
    [ItemPoolType.SECRET, ItemPoolType.GREED_SECRET],
  ],
  [
    CollectibleType.GUPPYS_EYE,
    [ItemPoolType.DEVIL, ItemPoolType.RED_CHEST, ItemPoolType.GREED_DEVIL],
  ],
  [
    CollectibleType.STRAWMAN,
    [ItemPoolType.SECRET, ItemPoolType.GREED_SHOP, ItemPoolType.GREED_SECRET],
  ],
  [CollectibleType.SAUSAGE, [ItemPoolType.SECRET, ItemPoolType.GREED_SECRET]],
  [CollectibleType.OPTIONS, [ItemPoolType.SHOP]],
  [
    CollectibleType.CANDY_HEART,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.ULTRA_SECRET,
    ],
  ],
  [
    CollectibleType.POUND_OF_FLESH,
    [ItemPoolType.DEVIL, ItemPoolType.DEMON_BEGGAR],
  ],
  [
    CollectibleType.SPIRIT_SHACKLES,
    [ItemPoolType.SECRET, ItemPoolType.GREED_SHOP, ItemPoolType.GREED_SECRET],
  ],
  [
    CollectibleType.CRACKED_ORB,
    [ItemPoolType.TREASURE, ItemPoolType.SECRET, ItemPoolType.GREED_TREASURE],
  ],
  [
    CollectibleType.EMPTY_HEART,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.DEMON_BEGGAR,
      ItemPoolType.GREED_TREASURE,
    ],
  ],
  [
    CollectibleType.ASTRAL_PROJECTION,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.SECRET,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.GREED_SECRET,
    ],
  ],
  [
    CollectibleType.C_SECTION,
    [ItemPoolType.TREASURE, ItemPoolType.GREED_TREASURE],
  ],
  [
    CollectibleType.LIL_ABADDON,
    [ItemPoolType.DEVIL, ItemPoolType.GREED_DEVIL, ItemPoolType.BABY_SHOP],
  ],
  [
    CollectibleType.MONTEZUMAS_REVENGE,
    [ItemPoolType.TREASURE, ItemPoolType.GREED_TREASURE],
  ],
  [
    CollectibleType.LIL_PORTAL,
    [ItemPoolType.TREASURE, ItemPoolType.GREED_TREASURE],
  ],
  [
    CollectibleType.WORM_FRIEND,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.ULTRA_SECRET,
      ItemPoolType.BABY_SHOP,
    ],
  ],
  [
    CollectibleType.BONE_SPURS,
    [ItemPoolType.TREASURE, ItemPoolType.GREED_TREASURE],
  ],
  [
    CollectibleType.HUNGRY_SOUL,
    [ItemPoolType.DEVIL, ItemPoolType.GREED_DEVIL, ItemPoolType.ULTRA_SECRET],
  ],
  [
    CollectibleType.JAR_OF_WISPS,
    [ItemPoolType.ANGEL, ItemPoolType.GREED_ANGEL],
  ],
  [CollectibleType.SOUL_LOCKET, [ItemPoolType.ANGEL, ItemPoolType.GREED_ANGEL]],
  [
    CollectibleType.FRIEND_FINDER,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.CRANE_GAME,
    ],
  ],
  [
    CollectibleType.INNER_CHILD,
    [ItemPoolType.SECRET, ItemPoolType.GREED_SHOP, ItemPoolType.GREED_SECRET],
  ],
  [
    CollectibleType.GLITCHED_CROWN,
    [ItemPoolType.SECRET, ItemPoolType.GREED_SHOP, ItemPoolType.GREED_SECRET],
  ],
  [
    CollectibleType.JELLY_BELLY,
    [ItemPoolType.TREASURE, ItemPoolType.GREED_TREASURE],
  ],
  [
    CollectibleType.SACRED_ORB,
    [
      ItemPoolType.ANGEL,
      ItemPoolType.SECRET,
      ItemPoolType.GREED_SHOP,
      ItemPoolType.GREED_ANGEL,
      ItemPoolType.GREED_SECRET,
    ],
  ],
  [
    CollectibleType.SANGUINE_BOND,
    [
      ItemPoolType.DEVIL,
      ItemPoolType.CURSE,
      ItemPoolType.GREED_SHOP,
      ItemPoolType.GREED_CURSE,
      ItemPoolType.GREED_DEVIL,
      ItemPoolType.ULTRA_SECRET,
    ],
  ],
  [
    CollectibleType.SWARM,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.KEY_MASTER,
      ItemPoolType.GREED_TREASURE,
    ],
  ],
  [
    CollectibleType.HEARTBREAK,
    [
      ItemPoolType.DEVIL,
      ItemPoolType.CURSE,
      ItemPoolType.GREED_CURSE,
      ItemPoolType.GREED_DEVIL,
      ItemPoolType.ULTRA_SECRET,
    ],
  ],
  [
    CollectibleType.BLOODY_GUST,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.DEVIL,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.GREED_DEVIL,
      ItemPoolType.ULTRA_SECRET,
    ],
  ],
  [CollectibleType.SALVATION, [ItemPoolType.ANGEL, ItemPoolType.GREED_ANGEL]],
  [CollectibleType.VANISHING_TWIN, [ItemPoolType.SECRET, ItemPoolType.CURSE]],
  [
    CollectibleType.TWISTED_PAIR,
    [ItemPoolType.DEVIL, ItemPoolType.GREED_DEVIL, ItemPoolType.BABY_SHOP],
  ],
  [
    CollectibleType.AZAZELS_RAGE,
    [ItemPoolType.DEVIL, ItemPoolType.GREED_DEVIL],
  ],
  [
    CollectibleType.ECHO_CHAMBER,
    [
      ItemPoolType.SECRET,
      ItemPoolType.GREED_SHOP,
      ItemPoolType.GREED_SECRET,
      ItemPoolType.ULTRA_SECRET,
    ],
  ],
  [
    CollectibleType.ISAACS_TOMB,
    [ItemPoolType.SECRET, ItemPoolType.GREED_SHOP, ItemPoolType.GREED_SECRET],
  ],
  [
    CollectibleType.VENGEFUL_SPIRIT,
    [
      ItemPoolType.DEVIL,
      ItemPoolType.CURSE,
      ItemPoolType.GREED_CURSE,
      ItemPoolType.GREED_DEVIL,
      ItemPoolType.ULTRA_SECRET,
    ],
  ],
  [
    CollectibleType.ESAU_JR,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.SECRET,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.GREED_SHOP,
      ItemPoolType.GREED_SECRET,
      ItemPoolType.ULTRA_SECRET,
    ],
  ],
  [
    CollectibleType.BERSERK,
    [ItemPoolType.DEVIL, ItemPoolType.GREED_DEVIL, ItemPoolType.ULTRA_SECRET],
  ],
  [
    CollectibleType.DARK_ARTS,
    [ItemPoolType.DEVIL, ItemPoolType.GREED_DEVIL, ItemPoolType.ULTRA_SECRET],
  ],
  [
    CollectibleType.ABYSS,
    [ItemPoolType.DEVIL, ItemPoolType.GREED_DEVIL, ItemPoolType.ULTRA_SECRET],
  ],
  [
    CollectibleType.SUPPER,
    [ItemPoolType.BOSS, ItemPoolType.BEGGAR, ItemPoolType.GREED_BOSS],
  ],
  [
    CollectibleType.STAPLER,
    [ItemPoolType.BOSS, ItemPoolType.GOLDEN_CHEST, ItemPoolType.GREED_BOSS],
  ],
  [
    CollectibleType.SUPLEX,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.CRANE_GAME,
    ],
  ],
  [
    CollectibleType.BAG_OF_CRAFTING,
    [ItemPoolType.TREASURE, ItemPoolType.GREED_TREASURE],
  ],
  [
    CollectibleType.FLIP,
    [
      ItemPoolType.SECRET,
      ItemPoolType.CURSE,
      ItemPoolType.GREED_SHOP,
      ItemPoolType.GREED_CURSE,
      ItemPoolType.GREED_SECRET,
      ItemPoolType.ULTRA_SECRET,
    ],
  ],
  [
    CollectibleType.LEMEGETON,
    [ItemPoolType.DEVIL, ItemPoolType.LIBRARY, ItemPoolType.GREED_DEVIL],
  ],
  [
    CollectibleType.SUMPTORIUM,
    [ItemPoolType.TREASURE, ItemPoolType.GREED_TREASURE],
  ],
  [
    CollectibleType.KEEPERS_SACK,
    [
      ItemPoolType.SHOP,
      ItemPoolType.SECRET,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.GREED_SECRET,
    ],
  ],
  [
    CollectibleType.KEEPERS_KIN,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.SECRET,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.GREED_SECRET,
    ],
  ],
  [
    CollectibleType.KEEPERS_BOX,
    [
      ItemPoolType.SHOP,
      ItemPoolType.SECRET,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.GREED_SECRET,
      ItemPoolType.WOODEN_CHEST,
    ],
  ],
  [
    CollectibleType.EVERYTHING_JAR,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.CRANE_GAME,
    ],
  ],
  [
    CollectibleType.TMTRAINER,
    [
      ItemPoolType.SECRET,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.GREED_SHOP,
      ItemPoolType.GREED_SECRET,
    ],
  ],
  [
    CollectibleType.ANIMA_SOLA,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.GREED_SHOP,
    ],
  ],
  [
    CollectibleType.SPINDOWN_DICE,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.SECRET,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.GREED_SHOP,
      ItemPoolType.GREED_SECRET,
      ItemPoolType.CRANE_GAME,
    ],
  ],
  [
    CollectibleType.HYPERCOAGULATION,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.ULTRA_SECRET,
    ],
  ],
  [CollectibleType.IBS, [ItemPoolType.TREASURE, ItemPoolType.GREED_TREASURE]],
  [
    CollectibleType.HEMOPTYSIS,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.ULTRA_SECRET,
    ],
  ],
  [
    CollectibleType.GHOST_BOMBS,
    [ItemPoolType.TREASURE, ItemPoolType.GREED_TREASURE, ItemPoolType.BOMB_BUM],
  ],
  [
    CollectibleType.GELLO,
    [
      ItemPoolType.TREASURE,
      ItemPoolType.DEVIL,
      ItemPoolType.GREED_TREASURE,
      ItemPoolType.GREED_DEVIL,
      ItemPoolType.ULTRA_SECRET,
    ],
  ],
  [
    CollectibleType.DECAP_ATTACK,
    [ItemPoolType.TREASURE, ItemPoolType.GREED_TREASURE],
  ],
  [
    CollectibleType.GLASS_EYE,
    [
      ItemPoolType.BOSS,
      ItemPoolType.GOLDEN_CHEST,
      ItemPoolType.GREED_BOSS,
      ItemPoolType.CRANE_GAME,
    ],
  ],
  [CollectibleType.STYE, [ItemPoolType.BOSS, ItemPoolType.GREED_BOSS]],
  [
    CollectibleType.MOMS_RING,
    [
      ItemPoolType.GOLDEN_CHEST,
      ItemPoolType.MOMS_CHEST,
      ItemPoolType.GREED_SHOP,
    ],
  ],
]);

/** Get a non-modded collectible's ItemPools. */
export function _getNonModdedCollectibleTypeItemPools(
  collectibleType: CollectibleType,
): readonly ItemPoolType[] {
  const itemPool = itemPools.get(collectibleType);
  if (itemPool === undefined) {
    error(`No itemPoolAttributes found for ${collectibleType}.`);
  }

  return itemPool;
}
