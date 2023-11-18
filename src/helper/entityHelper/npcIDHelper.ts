import type { EntityID } from "isaacscript-common";
import { getConstituentsFromEntityID, spawnNPC } from "isaacscript-common";
import type { NPCID } from "../../enums/general/ID/NPCID";
import type { Range } from "../../types/general/Range";
import { getGameNonModdedNPCIDSet } from "../../sets/data/entities/GameNPCIDSets";
import { getNonModdedNPCName } from "../../maps/data/name/npcNameMap";
import { getNonModdedBossNPCIDSet } from "../../sets/data/npc/BossNPCSet";
import { getModFromModdedEntityID } from "../../maps/data/moddedEntityIDToModMap";
import { getNonModdedFlyingNPCIDSet } from "../../sets/data/npc/FlyingNPCSet";
import { getNPCIDNameSubTypesForMod } from "../../maps/data/npc/modded/ModToNameSubTypeMap";
import { getNameSubTypeFromEntityID } from "../../maps/data/moddedEntityIDToNameSubType";
import { getModdedEntityNameAndSubTypeFromNameSubType } from "./entityIDHelper";
import { fprint } from "../printHelper";
import { _isModdedNPCIDBoss } from "../../sets/data/modded/ModdedNPCBossSet";
import { _isModdedNPCIDFlying } from "../../sets/data/modded/ModdedFlyingNPCSet";
import { _getNonModdedNPCSize } from "../../maps/data/npc/NPCSizeMap";
import { _getModdedNPCSize } from "../../maps/data/npc/modded/ModdedNPCSizeMap";

/** Determines if an NPCID is modded by checking it against the set of all NPCs in the base game. */
export function isNPCIDModded(npcID: NPCID): boolean {
  return !getGameNonModdedNPCIDSet().has(npcID);
}

/**
 * Determines if an NPC is flying from its NPCID. Note that if the NPC is modded, if the mod is not
 * tracked, this will return undefined.
 */
export function isNPCIDFlying(npcID: NPCID): boolean | undefined {
  const modded = isNPCIDModded(npcID);
  if (!modded) {
    return getNonModdedFlyingNPCIDSet().has(npcID);
  }

  return _isModdedNPCIDFlying(npcID);
}

/**
 * Determines if an NPC is a boss from its NPCID. Note that if the NPC is modded, if the mod is not
 * tracked, this will return undefined.
 */
export function isNPCIDBoss(npcID: NPCID): boolean | undefined {
  const modded = isNPCIDModded(npcID);
  if (!modded) {
    return getNonModdedBossNPCIDSet().has(npcID);
  }

  return _isModdedNPCIDBoss(npcID);
}

/**
 * Get the name of an NPCID. If it is modded, and the mod is not tracked, this will return
 * undefined. For modded NPCs, this is the same as its 'name' xml attribute.
 */
export function getNPCIDName(npcID: NPCID): string | undefined {
  const modded = isNPCIDModded(npcID);
  if (!modded) {
    return getNonModdedNPCName(npcID);
  }

  const m = getModFromModdedEntityID(npcID as EntityID);
  if (m === undefined) {
    return undefined;
  }
  const nameSubType = getNameSubTypeFromEntityID(npcID as EntityID);
  if (nameSubType === undefined) {
    return undefined;
  }

  return getModdedEntityNameAndSubTypeFromNameSubType(nameSubType)[1];
}

/** Get the size of an NPCID. If modded, and the mod is not tracked, returns undefined. */
export function getNPCIDSize(npcID: NPCID): number | undefined {
  const modded = isNPCIDModded(npcID);
  if (!modded) {
    return _getNonModdedNPCSize(npcID);
  }

  const size = _getModdedNPCSize(npcID);
  if (size === undefined) {
    return undefined;
  }

  return size;
}

/** Spawn an NPC by using their NPCID. */
export function spawnNPCID(
  npcID: NPCID,
  positionOrGridIndex: Vector | int,
  velocity?: Vector,
  spawner?: Entity | undefined,
  seedOrRNG?: Seed | RNG | undefined,
): EntityNPC {
  const constituents = getConstituentsFromEntityID(npcID as EntityID);
  return spawnNPC(
    constituents[0],
    constituents[1],
    constituents[2],
    positionOrGridIndex,
    velocity,
    spawner,
    seedOrRNG,
  );
}
