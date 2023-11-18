import type { NPCID } from "../../../enums/general/ID/NPCID";

/** Map linking every NPC to their Max HitPoints (HP they start with). */
const NPC_MAX_HITPOINTS_MAP: ReadonlyMap<NPCID, number> = new Map([]);
