import { CacheFlag, HeartSubType } from "isaac-typescript-definitions";
import { CharacterType } from "../../enums/general/CharacterType";
import { CollectibleTypeCustom } from "../../enums/general/CollectibleTypeCustom";
import { DeletedColor } from "../../enums/general/DeletedColor";
import type { ModeData } from "../../interfaces/modes/ModeData";

/** Information about ZIP BOMBER. */
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
  anm2File: "gfx/001.000_player_ZIPBOMBER.anm2",
  characterStats: new Map<CacheFlag, number>([
    [CacheFlag.DAMAGE, 3.4],
    [CacheFlag.SPEED, 0.9],
  ]),
};
