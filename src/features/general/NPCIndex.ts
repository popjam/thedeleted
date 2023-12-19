import type { NPCID } from "isaac-typescript-definitions";
import { EntityFlag } from "isaac-typescript-definitions";
import { fprint } from "../../helper/printHelper";
import { mod } from "../../mod";
import {
  DefaultMap,
  arrayToString,
  getEntityID,
  getNPCs,
} from "isaacscript-common";
import type { NPCIndex } from "../../types/general/NPCIndex";

// Mapping of NPC ptrHash to their NPCIndex. This can be outside the save-data object as ptrHashes
// are not persistent between game save/continue.
const npcPtrHashToIndex: Map<PtrHash, NPCIndex> = new Map<PtrHash, NPCIndex>();

// Mapping of NPCIndex to their ptrHash. This can be outside the save-data object as ptrHashes are
// not persistent between game save/continue.
const npcIndexToPtrHash: Map<NPCIndex, PtrHash> = new Map<NPCIndex, PtrHash>();

const v = {
  run: {
    // The current NPC index number.
    npcIndexNumber: 0 as NPCIndex,

    // Persistent NPCs that should not be removed from the NPCIndex upon game exit. This is a map of
    // NPCID to Array<[NPCIndex, isFriendly]>. Upon game exit, any NPCs which are persistent will
    // automatically be made friendly, so they get re-spawned when continuing. Upon game continue,
    // will match NPCID and reassign the NPCIndex, removing the friendly flag if necessary.
    persistentNPCs: new DefaultMap<NPCID, Array<[NPCIndex, boolean]>>(() => []),
  },
};

export function NPCIndexHelperInit(): void {
  mod.saveDataManager("NPCIndex", v);
}

function getNewNPCIndex(): NPCIndex {
  const npcIndex = v.run.npcIndexNumber + 1;
  v.run.npcIndexNumber = npcIndex as NPCIndex;
  return npcIndex as NPCIndex;
}

export function printPersistentNPCs(): void {
  // eslint-disable-next-line @typescript-eslint/prefer-destructuring
  const persistentNPCs = v.run.persistentNPCs;
  if (persistentNPCs.size === 0) {
    fprint("Persistent NPCs: None.");
    return;
  }

  const persistentNPCKeys = [...persistentNPCs.keys()];
  for (const persistentNPCKey of persistentNPCKeys) {
    const persistentNPCData = persistentNPCs.getAndSetDefault(persistentNPCKey);
    const persistentNPCDataStrings = persistentNPCData.map(
      ([npcIndex, isFriendly]) =>
        `NPCIndex: ${npcIndex}, isFriendly: ${isFriendly}`,
    );
    fprint(
      `Persistent NPC ${persistentNPCKey} with data: ${arrayToString(
        persistentNPCDataStrings,
      )}.`,
    );
  }
}

// POST_NPC_INIT_LATE. Will return true if NPC was reinitialized, false if not.
function reinitializePersistentNPC(npc: EntityNPC, ptrHash: PtrHash): boolean {
  // If NPC is friendly, and it is in the persistentNPCs map, then we assume it is a persistent NPC.
  const npcID = getEntityID(npc) as NPCID;
  const persistentNPC = v.run.persistentNPCs.getAndSetDefault(npcID);
  if (persistentNPC.length === 0) {
    fprint(
      `Failed to update friendly NPC ${GetPtrHash(
        npc,
      )} with NPCID ${npcID} NPCIndex since there are no tracked persistent NPCs.`,
    );
    return false;
  }

  // Pop out the last NPCIndex and isFriendly from the persistentNPCs array.
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const [npcIndex, wasFriendly] = persistentNPC.pop()!;

  // If NPC was not friendly, remove the friendly flags.
  if (!wasFriendly) {
    npc.ClearEntityFlags(EntityFlag.FRIENDLY);
    npc.ClearEntityFlags(EntityFlag.CHARM);
  }

  // Add the NPCIndex to the NPCIndex maps.
  npcPtrHashToIndex.set(ptrHash, npcIndex);
  npcIndexToPtrHash.set(npcIndex, ptrHash);

  // Re-add persistent flag if it was removed.
  npc.AddEntityFlags(EntityFlag.PERSISTENT);

  fprint(
    `Re-added NPC ${GetPtrHash(
      npc,
    )} and NPCID ${npcID} to NPCIndex with index ${npcIndex}. Was friendly: ${wasFriendly}.`,
  );
  return true;
}

function savePersistentNPC(npc: EntityNPC) {
  const npcIndex = npcPtrHashToIndex.get(GetPtrHash(npc));
  if (npcIndex === undefined) {
    fprint(
      `Failed to track persistent NPC ${GetPtrHash(
        npc,
      )} since it was not found in the NPCIndex.`,
    );
    return;
  }

  const isFriendly = npc.HasEntityFlags(EntityFlag.FRIENDLY);
  if (!isFriendly) {
    npc.AddEntityFlags(EntityFlag.FRIENDLY);
  }

  const npcID = getEntityID(npc) as NPCID;

  fprint(
    `PreGameExitSaved: Tracking NPC ${GetPtrHash(
      npc,
    )} with index ${npcIndex} and NPCID ${npcID} as persistent.`,
  );

  const persistentNPCData = v.run.persistentNPCs.getAndSetDefault(npcID);
  persistentNPCData.push([npcIndex, isFriendly]);
  v.run.persistentNPCs.set(npcID, persistentNPCData);
  printPersistentNPCs();
}

function initializeNPC(npc: EntityNPC, ptrHash: PtrHash) {
  /** Check for persistent NPC post-game continue. They will be friendly. */
  const isFriendly = npc.HasEntityFlags(EntityFlag.FRIENDLY);
  if (isFriendly) {
    const wasReinitialized = reinitializePersistentNPC(npc, ptrHash);
    if (wasReinitialized) {
      return;
    }
  }

  // If PtrHash already exists, don't add it again (a friendly NPC can have NPCInitLate called on it
  // multiple times by going to a new floor).
  if (npcPtrHashToIndex.has(ptrHash)) {
    return;
  }

  const npcIndex = getNewNPCIndex();
  npcPtrHashToIndex.set(ptrHash, npcIndex);
  npcIndexToPtrHash.set(npcIndex, ptrHash);
  fprint(
    `Added NPC ${GetPtrHash(npc)} to NPCIndex with index ${
      v.run.npcIndexNumber
    } and initSeed of ${npc.InitSeed}.`,
  );
}

/**
 * Get the unique NPCIndex for the specified NPC. For persistent NPCs (e.g friendly NPCs), this will
 * persist between floors and game continue. If the NPC does not yet have an NPCIndex, it will be
 * created (e.g this function is called before the NPC has been initialized).
 */
export function getNPCIndex(npc: EntityNPC): NPCIndex {
  const ptrHash = GetPtrHash(npc);
  const npcIndex = npcPtrHashToIndex.get(ptrHash);
  if (npcIndex === undefined) {
    initializeNPC(npc, ptrHash);
    const newNPCIndex = npcPtrHashToIndex.get(ptrHash);
    if (newNPCIndex === undefined) {
      error(
        `Failed to generate new NPCIndex for NPC ${GetPtrHash(
          npc,
        )} with ptrHash ${ptrHash}.`,
      );
    }
    return newNPCIndex;
  }
  return npcIndex;
}

// POST_NPC_INIT_LATE - called on every NPC after the game has started, also deals with persistent
// NPCs.
export function postNPCInitLateNPCIndex(npc: EntityNPC): void {
  const ptrHash = GetPtrHash(npc);

  // We run this one game frame later, as the persistent NPC maps are not yet initialized.
  initializeNPC(npc, ptrHash);
}

// PRE_GAME_EXIT, shouldSave = true. This callback is used to scan for persistent NPCs and save them
// to the tracker. We do this as persistent NPCs do retain their ptrHash upon game exit. We must
// also make them friendly as non-friendly persistent NPCs will not be re-spawned upon game
// continue.
export function preGameExitSavedNPCIndex(): void {
  const npcs = getNPCs();
  for (const npc of npcs) {
    if (!npc.HasEntityFlags(EntityFlag.PERSISTENT)) {
      continue;
    }

    savePersistentNPC(npc);
  }

  mod.saveDataManagerSave();
  fprint("PreGameExitSaved: Cleared NPCIndex maps.");
}

export function npcIndexPostPlayerRemoveLate(_player: EntityPlayer): void {
  // Clear the NPCIndex maps.
  fprint("NPCIndexPostPlayerRemoveLate: Cleared NPCIndex maps.");
  npcPtrHashToIndex.clear();
  npcIndexToPtrHash.clear();
}
