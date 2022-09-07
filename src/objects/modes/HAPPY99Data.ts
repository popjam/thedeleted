import { CharacterType } from "../../enums/CharacterType";
import { CollectibleTypeCustom } from "../../enums/CollectibleTypeCustom";
import { ModeData } from "../../interfaces/corruption/ModeData";

/** Information about HAPPY99. */
export const HAPPY99Data: ModeData = {
  description: "This is HAPPY99's description",
  birthright: "This is HAPPY99's birthright description",
  characterType: CharacterType.NORMAL,
  startingPocket: CollectibleTypeCustom.BITFLIP,
  settings: {
    startingBombs: 10,
  },
} as const;
