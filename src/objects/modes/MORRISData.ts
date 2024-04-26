import { CacheFlag, HeartSubType } from "isaac-typescript-definitions";
import { InvertedItemActionSetBuilderReference } from "../../enums/corruption/actionSets/ActionSetBuilders";
import { CharacterType } from "../../enums/general/CharacterType";
import { CollectibleTypeCustom } from "../../enums/general/CollectibleTypeCustom";
import { DeletedColor } from "../../enums/general/DeletedColor";
import type { ModeData } from "../../interfaces/modes/ModeData";

/** Information about MORRIS. */

export const MORRISData: ModeData = {
  description:
    "MORRIS starts with the D-14, a 6 room charge active that corrupts all items in the room.",
  birthright: "",
  characterType: CharacterType.NORMAL,
  startingPocket: CollectibleTypeCustom.D14,
  startingBombs: 1,
  startingKeys: 0,
  startingCoins: 0,
  startingHealth: {
    maxHearts: 2,
    hearts: 2,
    eternalHearts: 0,
    soulHearts: 2,
    boneHearts: 0,
    goldenHearts: 0,
    rottenHearts: 0,
    brokenHearts: 0,
    soulCharges: 0,
    bloodCharges: 0,
    soulHeartTypes: [HeartSubType.SOUL],
  },
  mainColor: DeletedColor.WORM_TURQUOISE,
  anm2File: "gfx/001.000_player_MORRIS.anm2",
  characterStats: new Map<CacheFlag, number>([
    [CacheFlag.DAMAGE, 3.4],
    [CacheFlag.SPEED, 0.9],
  ]),
  itemActionSetBuilderReference:
    InvertedItemActionSetBuilderReference.INVERTED_ITEM_ACTION_SET_MORRIS_DEFAULT,
};
