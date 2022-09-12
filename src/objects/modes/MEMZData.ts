import { CollectibleType } from "isaac-typescript-definitions";
import { CharacterType } from "../../enums/general/CharacterType";
import { ModeData } from "../../interfaces/modes/ModeData";

/** Information about HAPPY99. */
export const MEMZData: ModeData = {
  description: "This is MEMZ's description",
  birthright: "This is MEMZ's birthright description",
  characterType: CharacterType.NORMAL,
  startingPocket: CollectibleType.BREATH_OF_LIFE,
  startingBombs: 1,
  startingCoins: 1,
  startingKeys: 1,
} as const;
