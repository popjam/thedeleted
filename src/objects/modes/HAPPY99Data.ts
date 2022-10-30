import { CacheFlag, HeartSubType } from "isaac-typescript-definitions";
import { CharacterType } from "../../enums/general/CharacterType";
import { CollectibleTypeCustom } from "../../enums/general/CollectibleTypeCustom";
import { ModeData } from "../../interfaces/modes/ModeData";

/** Information about HAPPY99. */
// eslint-disable-next-line isaacscript/require-const-assertions
export const HAPPY99Data: ModeData = {
  description: "This is HAPPY99's description",
  birthright: "This is HAPPY99's birthright description",
  characterType: CharacterType.NORMAL,
  startingPocket: CollectibleTypeCustom.BITFLIP,
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
  characterStats: new Map<CacheFlag, number>([
    [CacheFlag.DAMAGE, 3.4],
    [CacheFlag.SPEED, 0.9],
  ]),
};
