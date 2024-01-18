import { GridEntityType } from "isaac-typescript-definitions";

const GRID_ENTITY_TYPE_NAME_MAP: ReadonlyMap<GridEntityType, string> = new Map([
  [GridEntityType.BLOCK, "Block"],
  [GridEntityType.ROCK, "Rock"],
  [GridEntityType.PIT, "Pit"],
  [GridEntityType.SPIKES, "Spikes"],
  [GridEntityType.SPIKES_ON_OFF, "On-Off Spikes"],
  [GridEntityType.SPIDER_WEB, "Spider Web"],
  [GridEntityType.LOCK, "Lock"],
  [GridEntityType.TNT, "TNT"],
  [GridEntityType.FIREPLACE, "Fireplace"],
  [GridEntityType.POOP, "Poop"],
  [GridEntityType.WALL, "Wall"],
  [GridEntityType.DOOR, "Door"],
  [GridEntityType.CRAWL_SPACE, "Crawl Space"],
  [GridEntityType.GRAVITY, "Gravity"],
  [GridEntityType.PRESSURE_PLATE, "Pressure Plate"],
  [GridEntityType.ROCK_ALT, "Alt Rock"],
  [GridEntityType.ROCK_BOMB, "Bomb Rock"],
  [GridEntityType.ROCK_TINTED, "Tinted Rock"],
  [GridEntityType.ROCK_ALT_2, "Alt Rock 2"],
  [GridEntityType.PILLAR, "Pillar"],
  [GridEntityType.DECORATION, "Decoration"],
  [GridEntityType.STATUE, "Statue"],
  [GridEntityType.ROCK_GOLD, "Gold Rock"],
  [GridEntityType.ROCK_SPIKED, "Spiked Rock"],
  [GridEntityType.ROCK_SUPER_SPECIAL, "Super Special Rock"],
  [GridEntityType.TELEPORTER, "Teleporter"],
  [GridEntityType.TRAPDOOR, "Trapdoor"],
]);

/** Get the name of a grid entity type. This may refer to multiple types of grid entities. */
export function gridEntityTypeToString(gridEntityType: GridEntityType): string {
  const gridEntityTypeName = GRID_ENTITY_TYPE_NAME_MAP.get(gridEntityType);
  if (gridEntityTypeName === undefined) {
    error(`Unknown grid entity type: ${gridEntityType}`);
  }

  return gridEntityTypeName;
}
