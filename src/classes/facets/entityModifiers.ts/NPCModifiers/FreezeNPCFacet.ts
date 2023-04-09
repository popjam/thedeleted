import { EntityFlag, ModCallback } from "isaac-typescript-definitions";
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
    /** A set of the Frozen NPCs that are currently in the room. */
    frozenNPCs: new Set<PtrHash>(),
  },
};

let FACET: Facet | undefined;
class FreezeNPCFacet extends Facet {
  @Callback(ModCallback.POST_RENDER)
  postRender(): void {
    for (const npc of getNPCs()) {
      if (!v.room.frozenNPCs.has(GetPtrHash(npc))) {
        continue;
      }

      npc.AddEntityFlags(EntityFlag.FREEZE);
      npc.AddEntityFlags(EntityFlag.NO_SPRITE_UPDATE);

      /** If enemy is dead, remove sprite update as it interferes with bosses dying properly. */
      if (npc.HitPoints < 1) {
        npc.ClearEntityFlags(EntityFlag.NO_SPRITE_UPDATE);
      }
    }
  }

  @CallbackCustom(ModCallbackCustom.POST_NEW_ROOM_REORDERED)
  postNewRoomReordered(): void {
    this.unsubscribeAll();
  }
}

export function initFreezeNPCFacet(): void {
  FACET = initGenericFacet(FreezeNPCFacet, v);
}

/**
 * Stop an NPC from moving and attacking. The NPC will still be vulnerable and deal contact damage.
 * You can unfreeze an NPC with the "unfreezeNPC()" function.
 *
 * @param npc The NPC to freeze.
 */
export function freezeNPC(npc: EntityNPC): void {
  const npcFamily = getNPCFamily(npc);
  npcFamily.forEach((member) => {
    if (v.room.frozenNPCs.has(GetPtrHash(member))) {
      return;
    }
    v.room.frozenNPCs.add(GetPtrHash(member));

    FACET?.subscribe();
  });
}

/** Unfreeze an NPC that has been frozen with the "freezeNPC()" function. */
export function unfreezeNPC(npc: EntityNPC): void {
  const npcFamily = getNPCFamily(npc);
  npcFamily.forEach((member) => {
    if (!v.room.frozenNPCs.has(GetPtrHash(member))) {
      return;
    }
    v.room.frozenNPCs.delete(GetPtrHash(member));
    member.ClearEntityFlags(EntityFlag.FREEZE);
    member.ClearEntityFlags(EntityFlag.NO_SPRITE_UPDATE);

    FACET?.unsubscribe();
  });
}

export function freezeAllNPCsInRoom(): void {
  for (const npc of getNPCs()) {
    freezeNPC(npc);
  }
}

export function unfreezeAllNPCsInRoom(): void {
  for (const npc of getNPCs()) {
    unfreezeNPC(npc);
  }
}
