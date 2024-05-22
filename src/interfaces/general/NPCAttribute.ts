import type { LevelStage, NPCID } from "isaac-typescript-definitions";
import type { Range } from "../../types/general/Range";
import type { COLORS } from "isaacscript-common";
import type { ModID } from "../../types/compatibility/ModName";

/**
 * Modifiers to describe a subset of all NPCs.
 *
 * @example Used to get a random NPC through getRandomNPC().
 */
export interface NPCAttribute {
  /**
   * If the NPC should be modded (true), not modded (false), or either (undefined). Alternatively,
   * specify a Mod it should be from.
   */
  modded?: boolean | ModID;

  /** General Color of the NPC. */
  color?: keyof typeof COLORS;

  /** Where the NPC is found. */
  stage?: LevelStage;

  /** Size of hitbox, will be between Range max and min (inclusive). */
  size?: Range;

  /** Mass of NPC will be between min and max of Range (inclusive). */
  mass?: Range;

  /** Whether the NPC flies. */
  flying?: boolean;

  /** Whether the NPC is a boss. */
  boss?: boolean;

  /**
   * NPC will have a max health between range minimum and maximum (inclusive).
   *
   * Provide min or max as 0 for "NPC has less health than X" or "NPC has more health than X"
   */
  health?: Range;

  /** NPC name starts with (capitalization doesn't matter). */
  startsWith?: string;

  /** NPC name ends with (capitalization doesn't matter). */
  endsWith?: string;

  /** Banned NPCIDs. */
  banned?: NPCID[];

  /** NPCIDs that ignore other tags. */
  forced?: NPCID[];
}
