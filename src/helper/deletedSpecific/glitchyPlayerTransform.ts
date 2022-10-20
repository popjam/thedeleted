import {
  DEFAULT_NORMAL_STARTING_SPRITESHEET_PATH,
  TRANSITIONAL_GLITCH_SPRITES_ARRAY,
} from "../../constants/fileConstants";

const v = {
  run: {
    transforming: false,
    finalSpritesheetPath: DEFAULT_NORMAL_STARTING_SPRITESHEET_PATH,
    transitionalSpritesheetPaths: TRANSITIONAL_GLITCH_SPRITES_ARRAY,
  },
};

/**
 * Transforms the player into the specified character spritesheet with a glitchy transition. Can
 * pass through an array of spritesheet paths which will override the default transitional sprites.
 */
export function glitchyReplacePlayerSpritesheet(
  player: EntityPlayer,
  finalCostumePath: string,
  transitionalSpritesheetPaths?: string[],
): void {
  if (transitionalSpritesheetPaths !== undefined) {
    v.run.transitionalSpritesheetPaths = transitionalSpritesheetPaths;
  }
}
