import { CacheFlag, HeartSubType } from "isaac-typescript-definitions";
import { InvertedItemActionSetBuilderReference } from "../../enums/corruption/actionSets/ActionSetBuilders";
import { CharacterType } from "../../enums/general/CharacterType";
import { CollectibleTypeCustom } from "../../enums/general/CollectibleTypeCustom";
import { DeletedColor } from "../../enums/general/DeletedColor";
import { ModeData } from "../../interfaces/modes/ModeData";

/** Information about HICURDISMOS. */
// eslint-disable-next-line isaacscript/require-capital-const-assertions
export const HICURDISMOSData: ModeData = {
  description: "This is HICURDISMOS's description",
  birthright: "This is HICURDISMOS's birthright description",
  characterType: CharacterType.NORMAL,
  startingPocket: CollectibleTypeCustom.BITFLIP_BLUE,
  startingBombs: 1,
  startingKeys: 0,
  startingCoins: 0,
  startingHealth: {
    maxHearts: 0,
    hearts: 0,
    eternalHearts: 0,
    soulHearts: 6,
    boneHearts: 0,
    goldenHearts: 0,
    rottenHearts: 0,
    brokenHearts: 0,
    soulCharges: 0,
    bloodCharges: 0,
    soulHeartTypes: [HeartSubType.SOUL, HeartSubType.SOUL, HeartSubType.SOUL],
  },
  mainColor: DeletedColor.WINDOWS_BLUE,
  anm2File: "gfx/001.000_player_HICURDISMOS.anm2",
  itemActionSetBuilderReference:
    InvertedItemActionSetBuilderReference.INVERTED_ITEM_ACTION_SET_HICURDISMOS_DEFAULT,
  characterStats: new Map<CacheFlag, number>([
    [CacheFlag.DAMAGE, 3.4],
    [CacheFlag.SPEED, 0.9],
  ]),
};
