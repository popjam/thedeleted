import { ModCallback } from "isaac-typescript-definitions";
import { Callback, getNPCs } from "isaacscript-common";
import {
  getNPCFamily,
  isEntityNPC,
} from "../../../../helper/entityHelper/npcHelper";
import { Facet, initGenericFacet } from "../../../Facet";

// eslint-disable-next-line isaacscript/require-v-registration
const v = {
  run: {
    /** Map of Bolstered NPCs and their positions. */
    bolsteredNPCs: new Map<PtrHash, Vector>(),
  },
};

let FACET: Facet | undefined;
class BolsterNPCFacet extends Facet {
  @Callback(ModCallback.POST_NPC_UPDATE)
  postNPCUpdate(npc: EntityNPC): void {
    const npcIndex = GetPtrHash(npc);
    if (!v.run.bolsteredNPCs.has(npcIndex)) {
      return;
    }

    const bolsterLocation = v.run.bolsteredNPCs.get(npcIndex);
    if (bolsterLocation === undefined) {
      return;
    }

    npc.Position = bolsterLocation;
  }

  @Callback(ModCallback.POST_ENTITY_REMOVE)
  postEntityRemove(entity: Entity): void {
    if (!isEntityNPC(entity)) {
      return;
    }

    const npcIndex = GetPtrHash(entity);
    if (!v.run.bolsteredNPCs.has(npcIndex)) {
      return;
    }

    v.run.bolsteredNPCs.delete(npcIndex);

    // Unsubscribe if there are no more bolstered NPCs.
    if (v.run.bolsteredNPCs.size === 0) {
      this.unsubscribeAll();
    }
  }
}

export function initBolsterNPCFacet(): void {
  FACET = initGenericFacet(BolsterNPCFacet, v);
}

/** Prevents an NPC from moving. It can still be damaged and attack the player. */
export function bolsterNPC(npc: EntityNPC, individual = false): void {
  if (individual) {
    v.run.bolsteredNPCs.set(GetPtrHash(npc), npc.Position);
  } else {
    const npcFamily = getNPCFamily(npc);
    for (const member of npcFamily) {
      const npcIndex = GetPtrHash(member);
      if (v.run.bolsteredNPCs.has(npcIndex)) {
        continue;
      }
      v.run.bolsteredNPCs.set(npcIndex, member.Position);
    }
  }

  FACET?.subscribeIfNotAlready();
}

/** Returns an NPC to normal after having been bolstered with "bolsterNPC()". */
export function unbolsterNPC(npc: EntityNPC, individual = false): void {
  if (individual) {
    v.run.bolsteredNPCs.delete(GetPtrHash(npc));
  } else {
    const npcFamily = getNPCFamily(npc);
    for (const member of npcFamily) {
      const npcIndex = GetPtrHash(member);
      if (!v.run.bolsteredNPCs.has(npcIndex)) {
        continue;
      }
      v.run.bolsteredNPCs.delete(npcIndex);
    }
  }

  if (v.run.bolsteredNPCs.size === 0) {
    FACET?.unsubscribeAll();
  }
}

/**
 * Stop all enemies in the room from moving in place, they can still attack and are vulnerable. If
 * you don't want them to attack, use "freezeAllNPCsInRoom()".
 */
export function bolsterAllNPCsInRoom(): void {
  for (const npc of getNPCs()) {
    bolsterNPC(npc, true);
  }
}

/** Return all enemies in room to normal after being bolstered. */
export function unbolsterAllNPCsInRoom(): void {
  for (const npc of getNPCs()) {
    unbolsterNPC(npc, true);
  }
}

/** Check if an NPC has been bolstered by the BolsterNPCFacet. */
export function isNPCBolstered(npc: EntityNPC): boolean {
  return v.run.bolsteredNPCs.has(GetPtrHash(npc));
}
