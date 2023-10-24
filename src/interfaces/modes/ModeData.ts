import type { CacheFlag, CollectibleType } from "isaac-typescript-definitions";
import type { PlayerHealth } from "isaacscript-common";
import type { InvertedItemActionSetBuilderReference } from "../../enums/corruption/actionSets/ActionSetBuilders";
import type { CharacterType } from "../../enums/general/CharacterType";

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

  /**
   * Items the player starts with. Note that these are visible on the item tracker, to add invisible
   * items reapply temporary effects every room in the specific mode file.
   */
  startingItems?: CollectibleType[];

  /** Starting coins to set coin count to (0 - 99). */
  startingCoins: number;

  /** Starting keys to set key count to (0 - 99). */
  startingKeys: number;

  /** Starting bombs to set bomb count to (0 - 99). */
  startingBombs: number;

  /** Starting health. */
  startingHealth: PlayerHealth;

  /**
   * The main color associated with the mode. Note: Some modes have multiple 'main' colors, so just
   * do not set the main Color and set it instead in the mode file.
   */
  mainColor?: Color;

  /** The location of the characters' custom anm2 file. */
  anm2File?: string;

  /**
   * Any stat included in this map will make the character start with alternate stats to base isaac.
   */
  characterStats?: Map<CacheFlag, number>;

  /** The mode's ItemActionSetBuilder generation method. */
  itemActionSetBuilderReference?: InvertedItemActionSetBuilderReference;

  /**
   * If the character starts inverted. If at least one player has this set to true during a run, the
   * corrupted backdrop will not be displayed to prevent annoyance as the majority of the run would
   * be in the inverted state.
   */
  startInverted?: boolean;
}
