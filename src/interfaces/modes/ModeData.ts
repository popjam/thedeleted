import { CollectibleType } from "isaac-typescript-definitions";
import { CharacterType } from "../../enums/general/CharacterType";
import { PlayerSettings } from "../PlayerSettings";

/** Information about the mode, including player settings. */
export interface ModeData {
  /** A short description of the mode. */
  description: string;
  /** The description of the mode's Birthright. */
  birthright: string;
  /** If the mode is for Deleted or Tainted Deleted. */
  characterType: CharacterType;
  /** The pocket item the player starts with. */
  startingPocket?: CollectibleType;
  /** Player settings to override. */
  settings?: PlayerSettings;
  /** Starting coins to set coin count to (0 - 99). */
  startingCoins: number;
  /** Starting keys to set key count to (0 - 99). */
  startingKeys: number;
  /** Starting bombs to set bomb count to (0 - 99). */
  startingBombs: number;
}
