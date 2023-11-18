import { ModCallback } from "isaac-typescript-definitions";
import {
  Callback,
  CallbackCustom,
  getNPCs,
  getTSTLClassName,
  ModCallbackCustom,
} from "isaacscript-common";
import {
  getNPCLineage,
  getNPCFamily,
} from "../../../../helper/entityHelper/npcHelper";
import { Facet, initGenericFacet, uninitFacet } from "../../../Facet";
import { fprint } from "../../../../helper/printHelper";

// eslint-disable-next-line isaacscript/require-v-registration
const v = {
  room: {
    /** Map of Bolstered NPCs and their positions. */
    bolsteredNPCs: new Map<PtrHash, Vector>(),
  },
};

let FACET: Facet | undefined;
class BolsterNPCFacet extends Facet {
  @Callback(ModCallback.POST_NPC_UPDATE)
  postNPCUpdate(npc: EntityNPC): void {
    if (!v.room.bolsteredNPCs.has(GetPtrHash(npc))) {
      return;
    }

    const bolsterLocation = v.room.bolsteredNPCs.get(GetPtrHash(npc));
    if (bolsterLocation === undefined) {
      return;
    }

    npc.Position = bolsterLocation;
  }

  @Callback(ModCallback.POST_NPC_DEATH)
  postNPCDeath(npc: EntityNPC): void {
    if (!v.room.bolsteredNPCs.has(GetPtrHash(npc))) {
      return;
    }

    v.room.bolsteredNPCs.delete(GetPtrHash(npc));
  }

  @CallbackCustom(ModCallbackCustom.POST_NEW_ROOM_REORDERED)
  postNewRoomReordered(): void {
    this.unsubscribeAll();
  }
}

export function initBolsterNPCFacet(): void {
  FACET = initGenericFacet(BolsterNPCFacet, v);
}

/** Prevents an NPC from moving. It can still be damaged and attack the player. */
export function bolsterNPC(npc: EntityNPC, individual = false): void {
  if (individual) {
    v.room.bolsteredNPCs.set(GetPtrHash(npc), npc.Position);
  } else {
    const npcFamily = getNPCFamily(npc);
    for (const member of npcFamily) {
      if (v.room.bolsteredNPCs.has(GetPtrHash(member))) {
        continue;
      }
      v.room.bolsteredNPCs.set(GetPtrHash(member), member.Position);
    }
  }

  FACET?.subscribeIfNotAlready();
}

/** Returns an NPC to normal after having been bolstered with "bolsterNPC()". */
export function unbolsterNPC(npc: EntityNPC, individual = false): void {
  if (individual) {
    v.room.bolsteredNPCs.delete(GetPtrHash(npc));
  } else {
    const npcFamily = getNPCFamily(npc);
    for (const member of npcFamily) {
      if (!v.room.bolsteredNPCs.has(GetPtrHash(member))) {
        continue;
      }
      v.room.bolsteredNPCs.delete(GetPtrHash(member));
    }
  }

  if (v.room.bolsteredNPCs.size === 0) {
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
  return v.room.bolsteredNPCs.has(GetPtrHash(npc));
}
