import { GridID } from "../../../enums/data/ID/GridID";

const gridIDNameMap = new Map<GridID, string>([
  [GridID.NULL, "Null"],
  [GridID.DECORATION, "Decoration"],
  [GridID.ROCK, "Rock"],
  [GridID.EVENT_ROCK, "Event Rock"],
  [GridID.BLOCK, "Block"],
  [GridID.ROCK_TINTED, "Tinted Rock"],
  [GridID.ROCK_BOMB, "Bomb Rock"],
  [GridID.ROCK_ALT, "Alt Rock"],
  [GridID.PIT, "Pit"],
  [GridID.PIT_FISSURE_SPAWNER, "Fissure Spawner Pit"],
  [GridID.SPIKES, "Spikes"],
  [GridID.SPIKES_ON_OFF, "On-Off Spikes"],
  [GridID.SPIDER_WEB, "Spider Web"],
  [GridID.LOCK, "Lock"],
  [GridID.TNT, "Tnt"],
  [GridID.FIREPLACE, "Normal Fireplace"],
  [GridID.FIREPLACE_RED, "Red Fireplace"],
  [GridID.POOP, "Normal Poop"],
  [GridID.POOP_RED, "Red Poop"],
  [GridID.POOP_CORNY, "Corny Poop"],
  [GridID.POOP_GOLDEN, "Golden Poop"],
  [GridID.POOP_RAINBOW, "Rainbow Poop"],
  [GridID.POOP_BLACK, "Black Poop"],
  [GridID.POOP_WHITE, "White Poop"],
  [GridID.POOP_GIANT_TOP_LEFT, "Giant Poop"],
  [GridID.POOP_GIANT_TOP_RIGHT, "Giant Poop"],
  [GridID.POOP_GIANT_BOTTOM_LEFT, "Giant Poop"],
  [GridID.POOP_GIANT_BOTTOM_RIGHT, "Giant Poop"],
  [GridID.POOP_CHARMING, "Charming Poop"],
  [GridID.WALL, "Wall"],
  [GridID.DOOR, "Door"],
  [GridID.DOOR_LOCKED, "Locked Door"],
  [GridID.DOOR_LOCKED_DOUBLE, "Double Locked Door"],
  [GridID.DOOR_LOCKED_CRACKED, "Cracked Locked Door"],
  [GridID.DOOR_LOCKED_BARRED, "Barred Locked Door"],
  [GridID.DOOR_LOCKED_KEY_FAMILIAR, "Mega Satan Locked Door"],
  [GridID.DOOR_LOCKED_GREED, "Greed Locked Door"],
  [GridID.DOOR_HIDDEN, "Hidden Door"],
  [GridID.DOOR_UNLOCKED, "Unlocked Door"],
  [GridID.TRAPDOOR, "Trapdoor"],
  [GridID.VOID_PORTAL, "Void Portal"],
  [GridID.CRAWL_SPACE, "Crawl Space"],
  [GridID.CRAWL_SPACE_GREAT_GIDEON, "Gideon Great Crawl Space"],
  [GridID.CRAWL_SPACE_SECRET_SHOP, "Secret Shop Crawl Space"],
  [
    GridID.CRAWL_SPACE_PASSAGE_TO_BEGINNING_OF_FLOOR,
    "Floor Of Beginning To Passage Space Crawl",
  ],
  [GridID.CRAWL_SPACE_NULL, "Null Crawl Space"],
  [GridID.GRAVITY, "Gravity"],
  [GridID.PRESSURE_PLATE, "Pressure Plate"],
  [GridID.REWARD_PLATE, "Reward Plate"],
  [GridID.GREED_PLATE, "Greed Plate"],
  [GridID.RAIL_PLATE, "Rail Plate"],
  [GridID.KILL_ALL_ENEMIES_PLATE, "Plate That Kills All Enemies"],
  [GridID.SPAWN_ROCKS_PLATE, "Plate That Spawns Rocks"],
  [GridID.STATUE_DEVIL, "Devil Statue"],
  [GridID.STATUE_ANGEL, "Angel Statue"],
  [GridID.ROCK_SUPER_SPECIAL, "Super Special Rock"],
  [GridID.TELEPORTER, "Teleporter"],
  [GridID.PILLAR, "Pillar"],
  [GridID.ROCK_SPIKED, "Spiked Rock"],
  [GridID.ROCK_FOOL_CARD, "Fool Card Rock"],
  [GridID.ROCK_GOLD, "Gold Rock"],
]);

/**
 * Converts a GridID into a name value (which will be its name).
 *
 * @param gridID The GridID to convert.
 *
 * @example gridIDToString(GridID.ROCK) // "rock"
 */
export function gridIDToString(gridID: GridID): string {
  const name = gridIDNameMap.get(gridID);
  if (name === undefined) {
    error(`No name for GridID ${gridID}`);
  }

  return name;
}
