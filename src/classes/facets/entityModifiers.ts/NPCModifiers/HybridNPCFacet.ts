import { NPCID } from "../../../../enums/general/ID/NPCID";
import { Facet, initGenericFacet } from "../../../Facet";

// eslint-disable-next-line isaacscript/require-v-registration
const v = {
  room: {
    /** A map of the Hybrid NPCs that are currently in the room. */
    hybridNPCs: new Set<{
      npc1: NPCID;
      npc2: NPCID;
    }>(),
  },
};

let FACET: Facet | undefined;
class HybridNPCFacet extends Facet {}

export function initHybridNPCFacet(): void {
  FACET = initGenericFacet(HybridNPCFacet, v);
}

/**
 * Spawns a 'Hybrid NPC', a monster that is a hybrid between two monsters, and inherits both
 * monsters properties.
 */
export function spawnHybridNPC(
  npc1: NPCID,
  npc2: NPCID,
  position: Vector,
): void {
  FACET?.subscribe();
}
