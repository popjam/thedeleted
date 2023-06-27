import { ModCallback } from "isaac-typescript-definitions";
import {
  Callback,
  CallbackCustom,
  ModCallbackCustom,
  game,
  getNPCs,
} from "isaacscript-common";
import { getNPCFamily } from "../../../../helper/npcHelper";
import { fprint } from "../../../../helper/printHelper";
import { clearRoom } from "../../../../helper/roomHelper";
import { Facet, initGenericFacet } from "../../../Facet";

// eslint-disable-next-line isaacscript/require-v-registration
const v = {
  room: {
    nonMandatoryNPC: new Set<PtrHash>(),
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
      if (v.room.nonMandatoryNPC.has(GetPtrHash(npc))) {
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

  @CallbackCustom(ModCallbackCustom.POST_NEW_ROOM_REORDERED)
  postNewRoomReordered() {
    this.unsubscribeAll();
    fprint(
      `Unsubscribed from NonMandatoryNPCFacet, subscriber count: ${this.getSubscriberCount()}`,
    );
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
export function makeNPCNonMandatory(npc: EntityNPC): void {
  const npcFamily = getNPCFamily(npc);
  npcFamily.forEach((member) => {
    if (v.room.nonMandatoryNPC.has(GetPtrHash(member))) {
      return;
    }
    v.room.nonMandatoryNPC.add(GetPtrHash(member));

    FACET?.subscribe();
  });
}

/** Makes all NPCs non-mandatory, hence clearing the room. */
export function makeAllNPCsInRoomNonMandatory(): void {
  getNPCs().forEach((npc) => {
    makeNPCNonMandatory(npc);
  });
}

export function getNonMandatoryNPCFacetSubscriberCount(): number {
  return FACET?.getSubscriberCount() ?? -1;
}
