import {
  Callback,
  CallbackCustom,
  ModCallbackCustom,
  getTSTLClassName,
} from "isaacscript-common";
import { Facet, initGenericFacet } from "../../../Facet";
import { getNPCFamily } from "../../../../helper/entityHelper/npcHelper";
import {
  makeEntityInvisible,
  makeEntityVisible,
} from "../../../../helper/entityHelper";
import { freezeNPC, unfreezeNPC } from "./FreezeNPCFacet";
import type { DamageFlag } from "isaac-typescript-definitions";
import { EntityFlag, ModCallback } from "isaac-typescript-definitions";
import { fprint } from "../../../../helper/printHelper";

// eslint-disable-next-line isaacscript/require-v-registration
const v = {
  room: {
    /** Map of hidden NPCs, with [number of subscriptions, is already friendly]. */
    hiddenNPCs: new Map<PtrHash, [number, boolean]>(),
  },
};

let FACET: Facet | undefined;
class HiddenNPCFacet extends Facet {
  @Callback(ModCallback.PRE_NPC_COLLISION)
  postNPCUpdate(
    npc: EntityNPC,
    _collider: Entity,
    _low: boolean,
  ): boolean | undefined {
    const ptrHash = GetPtrHash(npc);
    const hiddenNPC = v.room.hiddenNPCs.get(ptrHash);
    if (hiddenNPC === undefined) {
      return;
    }

    return true;
  }

  @Callback(ModCallback.PRE_TEAR_COLLISION)
  preTearCollision(
    _tear: EntityTear,
    collider: Entity,
    _low: boolean,
  ): boolean | undefined {
    const isNPC = collider.ToNPC() !== undefined;
    if (!isNPC) {
      return;
    }

    const ptrHashNPC = GetPtrHash(collider);
    const hiddenNPC = v.room.hiddenNPCs.get(ptrHashNPC);
    if (hiddenNPC === undefined) {
      return;
    }

    return true;
  }

  @Callback(ModCallback.PRE_PROJECTILE_COLLISION)
  preProjectileCollision(
    _projectile: EntityProjectile,
    collider: Entity,
    _low: boolean,
  ): boolean | undefined {
    const isNPC = collider.ToNPC() !== undefined;
    if (!isNPC) {
      return;
    }

    const ptrHashNPC = GetPtrHash(collider);
    const hiddenNPC = v.room.hiddenNPCs.get(ptrHashNPC);
    if (hiddenNPC === undefined) {
      return;
    }

    return true;
  }

  @Callback(ModCallback.ENTITY_TAKE_DMG)
  entityTakeDamage(
    npc: Entity,
    _amount: float,
    _damageFlags: BitFlags<DamageFlag>,
    _source: EntityRef,
    _countdownFrames: int,
  ): boolean | undefined {
    const ptrHash = GetPtrHash(npc);
    const hiddenNPC = v.room.hiddenNPCs.get(ptrHash);
    if (hiddenNPC === undefined) {
      return;
    }

    return false;
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

/**
 * Hide an NPC. If the NPC is multi-segmented, all segments will be hidden. Hidden NPCs are
 * technically still in the room, but are invisible, do not collide with anything, are friendly and
 * frozen in place.
 *
 * @param npc The NPC to hide.
 * @param individual If true, only hide the NPC entity passed in. If false, hide all of the NPC
 *                   family.
 */
export function hideNPC(npc: EntityNPC, individual = false): void {
  const npcFamily = individual ? new Set<EntityNPC>([npc]) : getNPCFamily(npc);
  for (const member of npcFamily) {
    const hiddenNPCs = v.room.hiddenNPCs.get(GetPtrHash(member));
    const isAlreadyFriendly = member.HasEntityFlags(EntityFlag.FRIENDLY);
    if (hiddenNPCs === undefined) {
      hide(member);
      v.room.hiddenNPCs.set(GetPtrHash(member), [1, isAlreadyFriendly]);
    } else {
      hiddenNPCs[0]++;
      v.room.hiddenNPCs.set(GetPtrHash(member), hiddenNPCs);
    }
  }
  FACET?.subscribeIfNotAlready();
}

/**
 * Unhide an NPC that was hidden via the hide() function. This will cause them to resume their
 * normal behavior. It will not re-close the room if the room is now open.
 *
 * @param npc The NPC to unhide.
 * @param individual If true, only unhide the NPC entity passed in. If false, unhide all of the NPC
 *                   family (default = false).
 */
export function unhideNPC(npc: EntityNPC, individual = false): void {
  const npcFamily = individual ? new Set<EntityNPC>([npc]) : getNPCFamily(npc);
  for (const member of npcFamily) {
    const hiddenNPCs = v.room.hiddenNPCs.get(GetPtrHash(member));
    if (hiddenNPCs === undefined) {
      return;
    }
    if (hiddenNPCs[0] === 1) {
      unhide(member, hiddenNPCs[1]);
      v.room.hiddenNPCs.delete(GetPtrHash(member));
    } else {
      hiddenNPCs[0]--;
      v.room.hiddenNPCs.set(GetPtrHash(member), hiddenNPCs);
    }
  }

  if (v.room.hiddenNPCs.size === 0) {
    FACET?.unsubscribeAll();
  }
}

export function initHideNPCFacet(): void {
  FACET = initGenericFacet(HiddenNPCFacet, v);
}

function hide(npc: EntityNPC) {
  makeEntityInvisible(npc);
  freezeNPC(npc, true);
  npc.AddEntityFlags(EntityFlag.FRIENDLY);
}

function unhide(npc: EntityNPC, isAlreadyFriendly = false) {
  makeEntityVisible(npc);
  unfreezeNPC(npc, true);
  if (!isAlreadyFriendly) {
    npc.ClearEntityFlags(EntityFlag.FRIENDLY);
  }
}

export function getHideNPCFacet(): Facet | undefined {
  return FACET;
}
