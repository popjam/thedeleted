import { CacheFlag, HeartSubType } from "isaac-typescript-definitions";
import { CharacterType } from "../../enums/general/CharacterType";
import { CollectibleTypeCustom } from "../../enums/general/CollectibleTypeCustom";
import { DeletedColor } from "../../enums/general/DeletedColor";
import { ModeData } from "../../interfaces/modes/ModeData";

/** Information about MYDOOM. */
// eslint-disable-next-line isaacscript/require-capital-const-assertions
export const MYDOOMData: ModeData = {
  description: "This is MYDOOM's description",
  birthright: "This is MYDOOM's birthright description",
  characterType: CharacterType.NORMAL,
  startingPocket: CollectibleTypeCustom.EXTRACT,
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
    soulHeartTypes: [HeartSubType.BLACK],
  },
  mainColor: DeletedColor.DEATH_BLACK,
  characterStats: new Map<CacheFlag, number>([
    [CacheFlag.DAMAGE, 3.4],
    [CacheFlag.SPEED, 0.9],
  ]),
};
