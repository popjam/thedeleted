import { ModCallback } from "isaac-typescript-definitions";
import {
  Callback,
  CallbackCustom,
  getNPCs,
  ModCallbackCustom,
} from "isaacscript-common";
import { getNPCFamily } from "../../../../helper/npcHelper";
import { Facet, initGenericFacet } from "../../../Facet";

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
export function bolsterNPC(npc: EntityNPC): void {
  const npcFamily = getNPCFamily(npc);
  npcFamily.forEach((member) => {
    if (v.room.bolsteredNPCs.has(GetPtrHash(member))) {
      return;
    }
    v.room.bolsteredNPCs.set(GetPtrHash(member), npc.Position);

    FACET?.subscribe();
  });
}

/** Returns an NPC to normal after having been bolstered with "bolsterNPC()". */
export function unbolsterNPC(npc: EntityNPC): void {
  const npcFamily = getNPCFamily(npc);
  npcFamily.forEach((member) => {
    if (!v.room.bolsteredNPCs.has(GetPtrHash(member))) {
      return;
    }
    v.room.bolsteredNPCs.delete(GetPtrHash(member));

    FACET?.unsubscribe();
  });
}

/**
 * Stop all enemies in the room from moving in place, they can still attack and are vulnerable. If
 * you don't want them to attack, use "freezeAllNPCsInRoom()".
 */
export function bolsterAllNPCsInRoom(): void {
  for (const npc of getNPCs()) {
    bolsterNPC(npc);
  }
}

/** Return all enemies in room to normal after being bolstered. */
export function unbolsterAllNPCsInRoom(): void {
  for (const npc of getNPCs()) {
    unbolsterNPC(npc);
  }
}
