import { CacheFlag } from "isaac-typescript-definitions";
import { CharacterType } from "../../enums/general/CharacterType";
import { CollectibleTypeCustom } from "../../enums/general/CollectibleTypeCustom";
import { DeletedColor } from "../../enums/general/DeletedColor";
import { ModeData } from "../../interfaces/modes/ModeData";

/** Information about ILOVEYOU. */
// eslint-disable-next-line isaacscript/require-const-assertions
export const ILOVEYOUData: ModeData = {
  description: "This is ILOVEYOU's description",
  birthright: "This is ILOVEYOU's birthright description",
  characterType: CharacterType.NORMAL,
  startingPocket: CollectibleTypeCustom.BITFLIP_PINK,
  startingBombs: 1,
  startingKeys: 0,
  startingCoins: 0,
  startingHealth: {
    maxHearts: 6,
    hearts: 6,
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
  characterStats: new Map<CacheFlag, number>([
    [CacheFlag.DAMAGE, 3.4],
    [CacheFlag.SPEED, 0.9],
  ]),
};
