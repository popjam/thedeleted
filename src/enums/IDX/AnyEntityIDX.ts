import { ThingIDX } from "./ThingIDX";

/** Parent Enum of GridEntityIDX and EntityIDX. */
export const AnyEntityIDX = {
  NORMAL_KEY: ThingIDX.NORMAL_KEY,
  SPIDER: ThingIDX.SPIDER,
  BLOCK: ThingIDX.BLOCK,
  MUSHROOM: ThingIDX.MUSHROOM,
} as const;
