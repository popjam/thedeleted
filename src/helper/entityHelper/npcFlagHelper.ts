import {
  bolsterNPC,
  isNPCBolstered,
  unbolsterNPC,
} from "../../classes/facets/entityModifiers.ts/NPCModifiers/BolsterNPCFacet";
import { censorNPC } from "../../classes/facets/entityModifiers.ts/NPCModifiers/CensoredNPCFacet";
import {
  freezeNPC,
  isNPCFrozen,
  unfreezeNPC,
} from "../../classes/facets/entityModifiers.ts/NPCModifiers/FreezeNPCFacet";
import {
  isNPCNonMandatory,
  makeNPCNonMandatory,
  removeNPCNonMandatoryEffect,
} from "../../classes/facets/entityModifiers.ts/NPCModifiers/NonMandatoryNPCFacet";
import {
  isNPCUnstable,
  setEntityInstability,
} from "../../classes/facets/entityModifiers.ts/UnstableEntityFacet";
import { NPCFlag } from "../../enums/general/NPCFlag";
import { fprint } from "../printHelper";

/**
 * Add a custom NPCFlag to an NPC. If they already have the flag, nothing happens unless there is a
 * special effect that happens when multiple flags are added.
 *
 * @note For multi-segmented NPCs, this will add the flag to all segments.
 */
export function addNPCFlags(npc: EntityNPC, ...flags: NPCFlag[]): void {
  for (const flag of flags) {
    fprint(`Adding NPC flag ${NPCFlag[flag]} to npc: ${GetPtrHash(npc)}.`);
    switch (flag) {
      case NPCFlag.BOLSTERED: {
        bolsterNPC(npc);

        break;
      }

      case NPCFlag.FROZEN: {
        freezeNPC(npc);

        break;
      }

      case NPCFlag.NON_MANDATORY: {
        makeNPCNonMandatory(npc);

        break;
      }

      case NPCFlag.CENSORED: {
        censorNPC(npc);

        break;
      }

      case NPCFlag.UNSTABLE: {
        setEntityInstability(npc);

        break;
      }
      // No default
    }
  }
}

/**
 * Checks if NPC has custom NPC flag.
 *
 * @note For multi-segmented NPCs, this will return true if any segment has the flag.
 */
export function doesNPCHaveFlag(npc: EntityNPC, flag: NPCFlag): boolean {
  if (flag === NPCFlag.BOLSTERED) {
    return isNPCBolstered(npc);
  }
  if (flag === NPCFlag.FROZEN) {
    return isNPCFrozen(npc);
  }
  if (flag === NPCFlag.NON_MANDATORY) {
    return isNPCNonMandatory(npc);
  }
  if (flag === NPCFlag.CENSORED) {
    // TODO.
    return false;
  }
  if (flag === NPCFlag.UNSTABLE) {
    isNPCUnstable(npc);
  }
  return false;
}

/**
 * Remove a custom NPCFlag from an NPC. If they don't have the flag, nothing happens.
 *
 * @note For multi-segmented NPCs, this will remove the flag from all segments.
 */
export function removeNPCFlags(npc: EntityNPC, ...flags: NPCFlag[]): void {
  for (const flag of flags) {
    switch (flag) {
      case NPCFlag.BOLSTERED: {
        unbolsterNPC(npc);

        break;
      }

      case NPCFlag.FROZEN: {
        unfreezeNPC(npc);

        break;
      }

      case NPCFlag.NON_MANDATORY: {
        removeNPCNonMandatoryEffect(npc);

        break;
      }

      case NPCFlag.CENSORED: {
        // TODO.

        break;
      }

      case NPCFlag.UNSTABLE: {
        // TODO.

        break;
      }
    }
  }
}
