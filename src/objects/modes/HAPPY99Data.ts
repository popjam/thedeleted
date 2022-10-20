import { CollectibleType, HeartSubType } from "isaac-typescript-definitions";
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
  startingItems: [CollectibleType.LUDOVICO_TECHNIQUE],
  startingBombs: 1,
  startingKeys: 0,
  startingCoins: 0,
  startingHealth: {
    maxHearts: 4,
    hearts: 4,
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
};
