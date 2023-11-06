import { LevelStage } from "isaac-typescript-definitions";

const LEVEL_STAGE_TO_NAME_MAP: ReadonlyMap<LevelStage, string> = new Map([
  [LevelStage.BASEMENT_1, "Basement I and variants"],
  [LevelStage.BASEMENT_2, "Basement II and variants"],
  [LevelStage.CAVES_1, "Caves I and variants"],
  [LevelStage.CAVES_2, "Caves II and variants"],
  [LevelStage.DEPTHS_1, "Depths I and variants"],
  [LevelStage.DEPTHS_2, "Depths II and variants"],
  [LevelStage.WOMB_1, "Womb I and variants"],
  [LevelStage.WOMB_2, "Womb II and variants"],
  [LevelStage.BLUE_WOMB, "Blue Womb"],
  [LevelStage.SHEOL_CATHEDRAL, "Sheol or Cathedral"],
  [LevelStage.DARK_ROOM_CHEST, "the Dark Room or the Chest"],
  [LevelStage.VOID, "The Void"],
  [LevelStage.HOME, "Home"],
]);

/**
 * Retrieves a printable named version of the specified levelStage enum value.
 *
 * @example RoomType.THE_VOID = "The Void"].
 */
export function getStageNameFromLevelStage(levelStage: LevelStage): string {
  const name = LEVEL_STAGE_TO_NAME_MAP.get(levelStage);
  if (name === undefined) {
    error(`LevelStageNameMap: Cannot find Name of LevelStage: ${levelStage}`);
  }
  return name;
}
