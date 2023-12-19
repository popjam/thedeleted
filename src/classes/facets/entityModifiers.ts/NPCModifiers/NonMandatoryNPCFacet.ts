import { ModCallback } from "isaac-typescript-definitions";
import {
  Callback,
  CallbackCustom,
  ModCallbackCustom,
  game,
  getNPCs,
  getTSTLClassName,
} from "isaacscript-common";
import {
  getNPCFamily,
  getNPCLineage,
  isEntityNPC,
} from "../../../../helper/entityHelper/npcHelper";
import { fprint } from "../../../../helper/printHelper";
import { clearRoom } from "../../../../helper/roomHelper";
import { Facet, initGenericFacet } from "../../../Facet";
import type { NPCIndex } from "../../../../types/general/NPCIndex";
import { getNPCIndex } from "../../../../features/general/NPCIndex";

// eslint-disable-next-line isaacscript/require-v-registration
const v = {
  level: {
    nonMandatoryNPC: new Set<NPCIndex>(),
  },
};

let FACET: Facet | undefined;
class NonMandatoryNPCFacet extends Facet {
  // TODO: Does this still always run?
  @Callback(ModCallback.POST_UPDATE)
  postNPCUpdate() {
    if (game.GetRoom().IsClear()) {
      return;
    }

    // Room is not clear, check if any mandatory NPCs are still alive.
    const thereAreMandatoryNPCs = getNPCs().some((npc) => {
      if (v.level.nonMandatoryNPC.has(getNPCIndex(npc))) {
        return false;
      }

      // We found a mandatory NPC.
      return true;
    });

    if (thereAreMandatoryNPCs) {
      return;
    }

    // There are no mandatory NPCs, so we can open the doors and clear room.
    clearRoom();
  }

  @Callback(ModCallback.POST_ENTITY_REMOVE)
  postEntityRemove(entity: Entity) {
    if (!isEntityNPC(entity)) {
      return;
    }

    if (!v.level.nonMandatoryNPC.has(getNPCIndex(entity))) {
      return;
    }

    v.level.nonMandatoryNPC.delete(getNPCIndex(entity));

    // Unsubscribe if there are no more non-mandatory NPCs.
    if (v.level.nonMandatoryNPC.size === 0) {
      this.unsubscribeAll();
    }
  }
}

/**
 * Non-Mandatory NPCs are NPCs within the room that do not keep the doors shut when only they exist
 * in the room with the player. As such, they are not required to be killed by the player. If a
 * normal and non-Mandatory NPC both exist in the room, the doors will still be shut.
 */
export function initNonMandatoryNPCFacet(): void {
  FACET = initGenericFacet(NonMandatoryNPCFacet, v);
}

/**
 * Makes a player not require to kill the NPC to trigger the room clear. If all NPCs in the room are
 * non-Mandatory, the room will clear automatically.
 */
export function makeNPCNonMandatory(npc: EntityNPC, individual = false): void {
  const npcFamily = individual ? new Set<EntityNPC>([npc]) : getNPCFamily(npc);
  for (const member of npcFamily) {
    if (v.level.nonMandatoryNPC.has(getNPCIndex(member))) {
      continue;
    }
    v.level.nonMandatoryNPC.add(getNPCIndex(member));
  }

  FACET?.subscribeIfNotAlready();
}

/** Makes all NPCs non-mandatory, hence clearing the room. */
export function makeAllNPCsInRoomNonMandatory(): void {
  for (const npc of getNPCs()) {
    makeNPCNonMandatory(npc);
  }
}

/**
 * Removes the NPC NonMandatory effect given by the NonMandatoryNPCFacet. Note that this does not
 * make an already non-mandatory NPC mandatory.
 */
export function removeNPCNonMandatoryEffect(
  npc: EntityNPC,
  individual = false,
): void {
  const npcFamily = individual ? new Set<EntityNPC>([npc]) : getNPCFamily(npc);
  for (const member of npcFamily) {
    if (!v.level.nonMandatoryNPC.has(getNPCIndex(member))) {
      continue;
    }
    v.level.nonMandatoryNPC.delete(getNPCIndex(member));
  }

  if (v.level.nonMandatoryNPC.size === 0) {
    FACET?.unsubscribeAll();
  }
}

/** Returns true if an NPC is non-Mandatory (not required to kill to clear the room). */
export function isNPCNonMandatory(npc: EntityNPC): boolean {
  return v.level.nonMandatoryNPC.has(getNPCIndex(npc));
}

export function getNonMandatoryNPCFacetSubscriberCount(): number {
  return FACET?.getSubscriberCount() ?? -1;
}
