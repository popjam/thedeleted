import { ModCallback, EntityFlag } from "isaac-typescript-definitions";
import { Facet, initGenericFacet } from "../../../Facet";
import { NPCFlag } from "../../../../enums/general/NPCFlag";
import {
  COLORS,
  Callback,
  ColorDefault,
  DefaultMap,
  GAME_FRAMES_PER_SECOND,
  ReadonlySet,
} from "isaacscript-common";
import type { NPCIndex } from "../../../../types/general/NPCIndex";
import { getNPCIndex } from "../../../../features/general/NPCIndex";
import {
  getNPCFamily,
  isEntityNPC,
} from "../../../../helper/entityHelper/npcHelper";
import { fprint } from "../../../../helper/printHelper";
import { setEntityDefaultColor } from "../../../../helper/colorHelper";

const DEFAULT_STATUS_EFFECT_DURATION = 5 * GAME_FRAMES_PER_SECOND;
const PERMANENT_STATUS_EFFECT_DURATION = -1;
const MAXIMUM_STATUS_EFFECT_DURATION = 999_999_999;
const SLOW_STATUS_EFFECT_MULTIPLIER = 0.5;
const SLOW_COLOR = COLORS.Gray;

// eslint-disable-next-line isaacscript/require-v-registration
const v = {
  run: {
    /** Map of NPCs with permanent status effects. */
    npcsWithPermanentStatusEffects: new DefaultMap<NPCIndex, Set<NPCFlag>>(
      () => new Set(),
    ),
  },
};

/**
 * Usually NPC Status effects are temporary, and it is not possible to make them permanent. This
 * Facet aims to change that.
 */
let FACET: Facet | undefined;
class PermanentNPCStatusEffectFacet extends Facet {
  @Callback(ModCallback.POST_NPC_UPDATE)
  postNPCUpdate(npc: EntityNPC): void {
    const npcIndex = getNPCIndex(npc);
    if (!v.run.npcsWithPermanentStatusEffects.has(npcIndex)) {
      return;
    }

    const permanentStatusEffects =
      v.run.npcsWithPermanentStatusEffects.get(npcIndex);
    if (permanentStatusEffects === undefined) {
      return;
    }

    for (const statusEffect of permanentStatusEffects) {
      applyNPCStatusEffectFromNPCFlag(npc, statusEffect);
    }
  }

  @Callback(ModCallback.POST_ENTITY_REMOVE)
  postEntityRemove(entity: Entity): void {
    if (!isEntityNPC(entity)) {
      return;
    }

    const npcIndex = getNPCIndex(entity);
    if (!v.run.npcsWithPermanentStatusEffects.has(npcIndex)) {
      return;
    }

    v.run.npcsWithPermanentStatusEffects.delete(npcIndex);

    // Unsubscribe if there are no more NPCs with permanent status effects.
    if (v.run.npcsWithPermanentStatusEffects.size === 0) {
      this.unsubscribeAll();
    }
  }
}

export function initPermanentNPCStatusEffectFacet(): void {
  FACET = initGenericFacet(PermanentNPCStatusEffectFacet, v);
}

export function addPermanentStatusEffectToNPC(
  npc: EntityNPC,
  statusEffect:
    | NPCFlag.BURN
    | NPCFlag.FEAR
    | NPCFlag.CHARMED
    | NPCFlag.CONFUSED
    | NPCFlag.ICE_FREEZE
    | NPCFlag.MIDAS_FREEZE
    | NPCFlag.POISONED
    | NPCFlag.SHRUNKEN
    | NPCFlag.SLOWING,
  individual = false,
): void {
  if (individual) {
    const npcIndex = getNPCIndex(npc);
    const permanentStatusEffects =
      v.run.npcsWithPermanentStatusEffects.getAndSetDefault(npcIndex);
    permanentStatusEffects.add(statusEffect);
    fprint(
      `Added permanent status effect ${statusEffect} to NPC with NPCIndex of ${npcIndex}.`,
    );
  } else {
    const npcFamily = getNPCFamily(npc);
    for (const member of npcFamily) {
      const npcIndex = getNPCIndex(member);
      const permanentStatusEffects =
        v.run.npcsWithPermanentStatusEffects.getAndSetDefault(npcIndex);
      permanentStatusEffects.add(statusEffect);
      fprint(
        `Added permanent status effect ${statusEffect} to NPC with NPCIndex of ${npcIndex}.`,
      );
    }
  }

  FACET?.subscribeIfNotAlready();
}

function applyNPCStatusEffectFromNPCFlag(npc: EntityNPC, npcFlag: NPCFlag) {
  switch (npcFlag) {
    case NPCFlag.BURN: {
      npc.AddBurn(EntityRef(undefined), DEFAULT_STATUS_EFFECT_DURATION, 1);
      break;
    }

    case NPCFlag.FEAR: {
      npc.AddFear(EntityRef(undefined), 99_999_999_999);
      break;
    }

    case NPCFlag.CHARMED: {
      npc.AddCharmed(EntityRef(undefined), DEFAULT_STATUS_EFFECT_DURATION);
      break;
    }

    case NPCFlag.CONFUSED: {
      npc.AddConfusion(
        EntityRef(undefined),
        DEFAULT_STATUS_EFFECT_DURATION,
        false,
      );
      break;
    }

    case NPCFlag.ICE_FREEZE: {
      npc.AddFreeze(EntityRef(undefined), DEFAULT_STATUS_EFFECT_DURATION);
      break;
    }

    case NPCFlag.MIDAS_FREEZE: {
      npc.AddMidasFreeze(EntityRef(undefined), 99_999_999_999);
      break;
    }

    case NPCFlag.POISONED: {
      npc.AddPoison(EntityRef(undefined), DEFAULT_STATUS_EFFECT_DURATION, 1);
      break;
    }

    case NPCFlag.SHRUNKEN: {
      npc.AddShrink(EntityRef(undefined), DEFAULT_STATUS_EFFECT_DURATION);
      break;
    }

    case NPCFlag.SLOWING: {
      npc.AddSlowing(
        EntityRef(undefined),
        DEFAULT_STATUS_EFFECT_DURATION,
        SLOW_STATUS_EFFECT_MULTIPLIER,
        SLOW_COLOR,
      );
      break;
    }

    default: {
      break;
    }
  }
}
