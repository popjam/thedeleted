import { CacheFlag } from "isaac-typescript-definitions";
import { InvertedItemActionSetBuilderReference } from "../../enums/corruption/actionSets/ActionSetBuilders";
import { CharacterType } from "../../enums/general/CharacterType";
import { CollectibleTypeCustom } from "../../enums/general/CollectibleTypeCustom";
import { DeletedColor } from "../../enums/general/DeletedColor";
import { ModeData } from "../../interfaces/modes/ModeData";

/** Information about ILOVEYOU. */
// eslint-disable-next-line isaacscript/require-capital-const-assertions
export const ILOVEYOUData: ModeData = {
  description: "This is ILOVEYOU's description",
  birthright: "This is ILOVEYOU's birthright description",
  characterType: CharacterType.NORMAL,
  startingPocket: CollectibleTypeCustom.BITFLIP_PINK,
  startingBombs: 1,
  startingKeys: 0,
  startingCoins: 0,
  startingHealth: {
    maxHearts: 4,
    hearts: 4,
    eternalHearts: 0,
    soulHearts: 0,
    boneHearts: 0,
    goldenHearts: 0,
    rottenHearts: 0,
    brokenHearts: 0,
    soulCharges: 0,
    bloodCharges: 0,
    soulHeartTypes: [],
  },
  mainColor: DeletedColor.LOVE_PINK,
  anm2File: "gfx/001.000_player_ILOVEYOU.anm2",
  characterStats: new Map<CacheFlag, number>([
    [CacheFlag.DAMAGE, 3.4],
    [CacheFlag.SPEED, 0.9],
  ]),
  itemActionSetBuilderReference:
    InvertedItemActionSetBuilderReference.INVERTED_ITEM_ACTION_SET_ILOVEYOU_DEFAULT,
};
