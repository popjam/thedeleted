import { CollectibleType } from "isaac-typescript-definitions";
import { CharacterType } from "../../enums/CharacterType";
import { ModeData } from "../../interfaces/corruption/ModeData";

/** Information about HAPPY99. */
export const MEMZData: ModeData = {
  description: "This is MEMZ's description",
  birthright: "This is MEMZ's birthright description",
  characterType: CharacterType.NORMAL,
  startingPocket: CollectibleType.BREATH_OF_LIFE,
} as const;
