import { CacheFlag, HeartSubType } from "isaac-typescript-definitions";
import { CharacterType } from "../../enums/general/CharacterType";
import { CollectibleTypeCustom } from "../../enums/general/CollectibleTypeCustom";
import { DeletedColor } from "../../enums/general/DeletedColor";
import { ModeData } from "../../interfaces/modes/ModeData";

/** Information about MORRIS. */
// eslint-disable-next-line isaacscript/require-capital-const-assertions
export const ZIPBOMBERData: ModeData = {
  description: "This is ZIP BOMBER's description",
  birthright: "This is ZIP BOMBER's birthright description",
  characterType: CharacterType.NORMAL,
  startingPocket: CollectibleTypeCustom.EXTRACT,
  startingBombs: 13,
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
  mainColor: DeletedColor.ANGRY_RED,
  characterStats: new Map<CacheFlag, number>([
    [CacheFlag.DAMAGE, 3.4],
    [CacheFlag.SPEED, 0.9],
  ]),
};