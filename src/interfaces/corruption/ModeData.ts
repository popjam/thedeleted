import { CollectibleType } from "isaac-typescript-definitions";
import { CharacterType } from "../../enums/CharacterType";
import { PlayerSettings } from "../PlayerSettings";

/** Information about the mode, including mode-related functions. */
export interface ModeData {
  description: string;
  birthright: string;
  characterType: CharacterType;
  startingPocket: CollectibleType;
  settings?: PlayerSettings;
}
