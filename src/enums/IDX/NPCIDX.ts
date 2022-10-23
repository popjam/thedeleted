import { FiendFolioThingIDX, ThingIDX } from "./ThingIDX";

/** Parent of... Child of EntityIDX. */
export const NPCIDX = {
  SPIDER: ThingIDX.SPIDER,
} as const;

export const FiendFolioNPCIDX = {
  MINION: FiendFolioThingIDX.MINION,
  BLACK_MINION: FiendFolioThingIDX.BLACK_MINION,
} as const;
