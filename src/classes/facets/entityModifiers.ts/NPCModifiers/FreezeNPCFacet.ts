import type { DamageFlag } from "isaac-typescript-definitions";
import { EntityFlag, ModCallback } from "isaac-typescript-definitions";
import {
  Callback,
  CallbackCustom,
  getNPCs,
  getTSTLClassName,
  isNPC,
  ModCallbackCustom,
} from "isaacscript-common";
import {
  getNPCFamily,
  isEntityNPC,
} from "../../../../helper/entityHelper/npcHelper";
import { Facet, initGenericFacet } from "../../../Facet";
import { fprint } from "../../../../helper/printHelper";

// eslint-disable-next-line isaacscript/require-v-registration
const v = {
  room: {
    /** A set of the Frozen NPCs that are currently in the room. */
    frozenNPCs: new Map<PtrHash, number>(),
  },
};

let FACET: Facet | undefined;
class FreezeNPCFacet extends Facet {
  @Callback(ModCallback.POST_NPC_RENDER)
  postNPCRender(npc: EntityNPC): void {
    if (v.room.frozenNPCs.size === 0) {
      return;
    }

    if (!v.room.frozenNPCs.has(GetPtrHash(npc))) {
      return;
    }

    npc.AddEntityFlags(EntityFlag.FREEZE);
    npc.AddEntityFlags(EntityFlag.NO_SPRITE_UPDATE);

    /** If enemy is dead, remove sprite update as it interferes with bosses dying properly. */
    if (npc.HitPoints < 1) {
      npc.ClearEntityFlags(EntityFlag.NO_SPRITE_UPDATE);
    }
  }

  @CallbackCustom(ModCallbackCustom.POST_NEW_ROOM_REORDERED)
  postNewRoomReordered(): void {
    this.unsubscribeAll();
  }

  /**
   * Uninitialize the Facet upon the run ending, as it does not do it automatically. Save Data is
   * auto-reset.
   */
  @Callback(ModCallback.PRE_GAME_EXIT)
  preGameExit(shouldSave: boolean): void {
    if (shouldSave) {
      return;
    }
    if (this.initialized) {
      fprint(`Uninitialising ${getTSTLClassName(this)} due to PRE_GAME_EXIT.`);
      this.uninit();
    }
  }
}

export function initFreezeNPCFacet(): void {
  FACET = initGenericFacet(FreezeNPCFacet, v);
}

/**
 * Stop an NPC from moving and attacking. The NPC will still be vulnerable and deal contact damage.
 * You can unfreeze an NPC with the "unfreezeNPC()" function. If an NPC is frozen multiple times,
 * you must unfreeze it the same number of times to completely unfreeze it. This allows multiple
 * features to use this Facet independently without interfering with each other.
 *
 * @param npc The NPC family to freeze.
 * @param individual If true, only the NPC passed in will be frozen. If false, the entire NPC family
 *                   will be frozen.
 */
export function freezeNPC(npc: EntityNPC, individual = false): void {
  const npcFamily = individual ? new Set<EntityNPC>([npc]) : getNPCFamily(npc);
  for (const member of npcFamily) {
    const frozenNPC = v.room.frozenNPCs.get(GetPtrHash(member));
    if (frozenNPC === undefined) {
      v.room.frozenNPCs.set(GetPtrHash(member), 1);
    } else {
      v.room.frozenNPCs.set(GetPtrHash(member), frozenNPC + 1);
    }
  }

  FACET?.subscribeIfNotAlready();
}

/**
 * Unfreeze an NPC that has been frozen with the "freezeNPC()" function. If an NPC has been frozen
 * multiple times, you must unfreeze it the same number of times to completely unfreeze it.
 *
 * @param npc The NPC family to unfreeze.
 * @param individual If true, only the NPC passed in will be unfrozen. If false, the entire NPC
 *                   family will be unfrozen.
 */
export function unfreezeNPC(npc: EntityNPC, individual = false): void {
  const npcFamily = individual ? [npc] : getNPCFamily(npc);
  for (const member of npcFamily) {
    const frozenNPC = v.room.frozenNPCs.get(GetPtrHash(member));
    if (frozenNPC === undefined) {
      continue;
    } else if (frozenNPC === 1) {
      v.room.frozenNPCs.delete(GetPtrHash(member));
      member.ClearEntityFlags(EntityFlag.FREEZE);
      member.ClearEntityFlags(EntityFlag.NO_SPRITE_UPDATE);
    } else {
      v.room.frozenNPCs.set(GetPtrHash(member), frozenNPC - 1);
    }
  }

  if (v.room.frozenNPCs.size === 0) {
    FACET?.unsubscribeAll();
  }
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

/** Check if the NPC has been frozen by the FreezeNPCFacet. */
export function isNPCFrozen(npc: EntityNPC): boolean {
  return v.room.frozenNPCs.has(GetPtrHash(npc));
}
