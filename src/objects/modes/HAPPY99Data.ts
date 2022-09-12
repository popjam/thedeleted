import { CharacterType } from "../../enums/general/CharacterType";
import { CollectibleTypeCustom } from "../../enums/general/CollectibleTypeCustom";
import { ModeData } from "../../interfaces/modes/ModeData";

/** Information about HAPPY99. */
export const HAPPY99Data: ModeData = {
  description: "This is HAPPY99's description",
  birthright: "This is HAPPY99's birthright description",
  characterType: CharacterType.NORMAL,
  startingPocket: CollectibleTypeCustom.BITFLIP,
  startingBombs: 1,
  startingKeys: 0,
  startingCoins: 0,
} as const;
