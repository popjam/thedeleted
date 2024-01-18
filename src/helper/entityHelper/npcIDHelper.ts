import type { EntityID } from "isaacscript-common";
import { getConstituentsFromEntityID, spawnNPC } from "isaacscript-common";
import { getNonModdedNPCName } from "../../maps/data/name/npcNameMap";
import { getNonModdedBossNPCIDSet } from "../../sets/data/npc/BossNPCSet";
import { getNonModdedFlyingNPCIDSet } from "../../sets/data/npc/FlyingNPCSet";
import { getNameSubTypeFromModdedEntityID } from "../../maps/data/moddedEntityIDToNameSubType";
import { getModdedEntityNameAndSubTypeFromNameSubType } from "./entityIDHelper";
import { _isModdedNPCIDFlying } from "../../sets/data/modded/ModdedFlyingNPCSet";
import { _getNonModdedNPCSize } from "../../maps/data/npc/NPCSizeMap";
import { _getNonModdedNPCIDMaxHitPoints } from "../../maps/data/npc/NPCMaxHitPointsMap";
import { getNonModdedEntityIDSetFromCategory } from "../../features/data/gameSets/gameEntitySets";
import { EntityCategory } from "../../enums/general/EntityCategory";
import type { NPCID } from "isaac-typescript-definitions";
import { getModdedEntityDataFromEntityID } from "../compatibility/XML/moddedXMLParserHelper";

/** Determines if an NPCID is modded by checking it against the set of all NPCs in the base game. */
export function isNPCIDModded(npcID: NPCID): boolean {
  const nonModdedNPCSet = getNonModdedEntityIDSetFromCategory(
    EntityCategory.NPC,
  );
  if (nonModdedNPCSet === undefined) {
    return false;
  }
  return !nonModdedNPCSet.has(npcID as EntityID);
}

/**
 * Determines if an NPC is flying from its NPCID. Note that if the NPC is modded, if the mod is not
 * tracked, this will return undefined.
 *
 * TODO: Fix.
 */
export function isNPCIDFlying(npcID: NPCID): boolean | undefined {
  const modded = isNPCIDModded(npcID);
  if (!modded) {
    return getNonModdedFlyingNPCIDSet().has(npcID);
  }

  return _isModdedNPCIDFlying(npcID as EntityID);
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

  const data = getModdedEntityDataFromEntityID(npcID as EntityID);
  if (data === undefined) {
    return undefined;
  }

  const { boss } = data._attr;
  if (boss === undefined) {
    return false;
  }

  return boss === "1";
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

  const nameSubType = getNameSubTypeFromModdedEntityID(npcID as EntityID);
  if (nameSubType === undefined) {
    return undefined;
  }

  return getModdedEntityNameAndSubTypeFromNameSubType(nameSubType).name;
}

/**
 * Get the size of an NPCID. If modded, and the mod is not tracked, returns undefined. This is
 * equivalent to the 'collisionRadius' xml attribute.
 */
export function getNPCIDSize(npcID: NPCID): number | undefined {
  const modded = isNPCIDModded(npcID);
  if (!modded) {
    return _getNonModdedNPCSize(npcID);
  }

  const data = getModdedEntityDataFromEntityID(npcID as EntityID);
  if (data === undefined) {
    return undefined;
  }

  const { collisionRadius } = data._attr;
  if (collisionRadius === undefined) {
    return undefined;
  }

  return Number(collisionRadius);
}

/**
 * Get the MaxHitPoints of an NPCID. If modded, and the mod is not tracked, returns undefined.
 * MaxHitPoints is the NPCs total health. This is equivalent to the 'baseHP' xml attribute.
 */
export function getNPCIDMaxHitPoints(npcID: NPCID): number | undefined {
  const modded = isNPCIDModded(npcID);
  if (!modded) {
    return _getNonModdedNPCIDMaxHitPoints(npcID);
  }

  const data = getModdedEntityDataFromEntityID(npcID as EntityID);
  if (data === undefined) {
    return undefined;
  }

  const { baseHP } = data._attr;
  if (baseHP === undefined) {
    return undefined;
  }

  return Number(baseHP);
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
