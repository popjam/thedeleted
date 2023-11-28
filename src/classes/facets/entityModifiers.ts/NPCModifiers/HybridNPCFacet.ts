import {
  Callback,
  CallbackCustom,
  GAME_FRAMES_PER_SECOND,
  ModCallbackCustom,
  getEntityFromPtrHash,
  getTSTLClassName,
  round,
} from "isaacscript-common";
import type { NPCID } from "../../../../enums/data/ID/NPCID";
import { Facet, initGenericFacet } from "../../../Facet";
import { ModCallback } from "isaac-typescript-definitions";
import { fprint } from "../../../../helper/printHelper";
import { getRandomMapElementWithPredicate } from "../../../../helper/mapHelper";
import { findSet } from "../../../../helper/setHelper";
import { hideNPC, unhideNPC } from "./HideNPCFacet";
import { randomInRangeWithDecimalPrecision } from "../../../../types/general/Range";
import type { Range } from "../../../../types/general/Range";
import { spawnNPCID } from "../../../../helper/entityHelper/npcIDHelper";

const DEFAULT_TRANSFORMATION_TIME_RANGE_SEC = [0.3, 1] as Range;
const DECIMAL_PRECISION = 3;
const STARTING_HP = 0;

export interface HybridNPC {
  /** The NPCs that are combined. */
  npcs: Map<NPCID, PtrHash>;

  /** The currently active NPC from the NPC array. */
  current: PtrHash;

  /** The current HP of the hybrid NPC. */
  hp: number;

  /** The current time in ms until transformation. */
  time: number;

  /** True if the HybridNPC is in dead state. */
  dead: boolean;
}

// eslint-disable-next-line isaacscript/require-v-registration
const v = {
  room: {
    /** A map of the Hybrid NPCs that are currently in the room. */
    hybridNPCs: new Set<HybridNPC>(),
  },
};

// TODO: Add grace period when transitioning.
let FACET: Facet | undefined;
class HybridNPCFacet extends Facet {
  @Callback(ModCallback.PRE_NPC_UPDATE)
  preNPCUpdate(npc: EntityNPC): boolean | undefined {
    const ptrHash = GetPtrHash(npc);

    // Find the HybridNPC that contains the current NPC.
    const hybridNPC = findSet<HybridNPC>(
      v.room.hybridNPCs,
      (h) => h.current === ptrHash,
    );

    if (hybridNPC === undefined) {
      return;
    }

    // If the time is up, then we want to transform to the NPC.
    if (hybridNPC.time <= 0) {
      transform(hybridNPC, npc);
      return undefined;
    }

    hybridNPC.time--;
    return undefined;
  }

  @Callback(ModCallback.POST_NPC_DEATH)
  postNPCDeath(npc: EntityNPC): void {
    const ptrHash = GetPtrHash(npc);

    // Find the HybridNPC that contains the current NPC.
    const hybridNPC = findSet<HybridNPC>(
      v.room.hybridNPCs,
      (h) => h.current === ptrHash,
    );

    if (hybridNPC === undefined) {
      return;
    }

    // We also want to remove the hidden counterparts.
    for (const npcPtrHash of hybridNPC.npcs.values()) {
      if (npcPtrHash === hybridNPC.current) {
        continue;
      }
      const npcToRemove = getEntityFromPtrHash(npcPtrHash);
      if (npcToRemove !== undefined) {
        unhideNPC(npcToRemove as EntityNPC);
        npcToRemove.Position = npc.Position;
        npcToRemove.Kill();
      }
    }
  }

  @CallbackCustom(ModCallbackCustom.POST_NEW_ROOM_REORDERED)
  postNewRoomReordered(): void {
    this.unsubscribeAll();
  }
}

export function initHybridNPCFacet(): void {
  FACET = initGenericFacet(HybridNPCFacet, v);
}

/**
 * Spawns a 'Hybrid NPC', a monster that is a hybrid between two or more monsters, and inherits both
 * monsters properties. Monsters supplied must be unique.
 *
 * @param position The position to spawn the Hybrid NPC at.
 * @param npcs The NPCs to spawn the Hybrid NPC with.
 */
export function spawnHybridNPC(position: Vector, ...npcs: NPCID[]): EntityNPC {
  // Must provide at least two NPCs.
  if (npcs.length < 2) {
    error("You must provide at least two NPCs to spawn a hybrid NPC.");
  }

  // Check if NPCs are unique.
  const npcSet = new Set(npcs);
  if (npcSet.size !== npcs.length) {
    error("You must provide unique NPCs to spawn a hybrid NPC.");
  }

  // Set up the HybridNPC object.
  const hybrid: HybridNPC = {
    npcs: new Map(),

    current: 0 as PtrHash,

    hp: STARTING_HP,

    time: getCountdown(DEFAULT_TRANSFORMATION_TIME_RANGE_SEC),

    dead: false,
  };
  let startingNPC: EntityNPC | undefined;

  // For each NPC,
  for (const npc of npcs) {
    const spawnedNPC = spawnNPCID(npc, position);
    hybrid.hp += spawnedNPC.MaxHitPoints;
    const ptrHash = GetPtrHash(spawnedNPC);
    hybrid.npcs.set(npc, ptrHash);
    if (npcs[0] === npc) {
      // Set the starting NPC to be active.
      hybrid.current = ptrHash;
      startingNPC = spawnedNPC;
    } else {
      // Hide the other NPCs.
      hideNPC(spawnedNPC);
    }
  }

  // Set max HP to the average of all the NPCs health.
  if (startingNPC !== undefined) {
    startingNPC.MaxHitPoints = round(hybrid.hp / npcs.length);
    startingNPC.HitPoints = startingNPC.MaxHitPoints;
  }

  v.room.hybridNPCs.add(hybrid);
  FACET?.subscribeIfNotAlready();

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return startingNPC!;
}

/** Returns true if the NPC is apart of a HybridNPC. */
export function isHybridNPC(entityNPC: EntityNPC): boolean {
  return (
    findSet<HybridNPC>(
      v.room.hybridNPCs,
      (h) => h.current === GetPtrHash(entityNPC),
    ) !== undefined
  );
}

/** When the timer reaches 0 for a HybridNPC, it 'transforms'. */
function transform(hybrid: HybridNPC, currentNPC: EntityNPC) {
  // Get the new NPC (that is currently hidden) that will take the Hybrid's form. This will be a
  // random NPC in the chain, but not the current NPC.
  hybrid.current = getRandomMapElementWithPredicate<PtrHash>(
    hybrid.npcs,
    (npc) => npc !== hybrid.current,
  );

  // Reset time.
  hybrid.time = getCountdown(DEFAULT_TRANSFORMATION_TIME_RANGE_SEC);

  // Find NPC that we transformed into.
  const newNPC = getEntityFromPtrHash(hybrid.current);
  if (newNPC === undefined) {
    return undefined;
  }

  // Update the new NPC's data to that of old NPC.
  newNPC.Position = currentNPC.Position;
  newNPC.Velocity = currentNPC.Velocity;
  newNPC.MaxHitPoints = currentNPC.MaxHitPoints;
  newNPC.HitPoints = currentNPC.HitPoints;
  newNPC.ClearEntityFlags(newNPC.GetEntityFlags());
  newNPC.AddEntityFlags(currentNPC.GetEntityFlags());

  hideNPC(currentNPC);
  unhideNPC(newNPC as EntityNPC);
}

/** Given a range in seconds, returns the appropriate number for the countdown. */
function getCountdown(range: Range): number {
  return (
    randomInRangeWithDecimalPrecision(range, DECIMAL_PRECISION) *
    GAME_FRAMES_PER_SECOND
  );
}
