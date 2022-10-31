import { CacheFlag, HeartSubType } from "isaac-typescript-definitions";
import { CharacterType } from "../../enums/general/CharacterType";
import { ModeData } from "../../interfaces/modes/ModeData";

/** Information about MORRIS. */
// eslint-disable-next-line isaacscript/require-const-assertions
export const SOPHOSData: ModeData = {
  description: "This is ILOVEYOU's description",
  birthright: "This is ILOVEYOU's birthright description",
  characterType: CharacterType.TAINTED,
  startingBombs: 1,
  startingKeys: 0,
  startingCoins: 0,
  startingHealth: {
    maxHearts: 2,
    hearts: 2,
    eternalHearts: 0,
    soulHearts: 0,
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
