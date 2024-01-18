import { NPCFlag } from "../../../enums/general/NPCFlag";

const NPC_FLAG_NAME_MAP: ReadonlyMap<NPCFlag, string> = new Map([
  [NPCFlag.BOLSTERED, "Bolstered"],
  [NPCFlag.FROZEN, "Paralyzed"],
  [NPCFlag.NON_MANDATORY, "Non-Mandatory"],
  [NPCFlag.CENSORED, "Censored"],
  [NPCFlag.UNSTABLE, "Unstable"],
  [NPCFlag.FEAR, "Fearful"],
  [NPCFlag.BURN, "Burned"],
  [NPCFlag.CHARMED, "Charmed"],
  [NPCFlag.CONFUSED, "Confused"],
  [NPCFlag.ICE_FREEZE, "Frozen"],
  [NPCFlag.MIDAS_FREEZE, "Midas Frozen"],
  [NPCFlag.SHRUNKEN, "Shrunken"],
  [NPCFlag.POISONED, "Poisoned"],
  [NPCFlag.PERSISTENT, "Persistent"],
  [NPCFlag.FRIENDLY, "Friendly"],
  [NPCFlag.SLOWING, "Slow"],
]);

/**
 * Get a NPCFlag string description.
 *
 * @example npcFlagToString(NPCFlag.BOLSTERED); // "Bolstered"
 * @example npcFlagToString(NPCFlag.MIDAS_FREEZE); // "Midas Frozen"
 */
export function npcFlagToString(flag: NPCFlag): string {
  const npcFlag = NPC_FLAG_NAME_MAP.get(flag);
  if (npcFlag === undefined) {
    error(`Failed to get NPC flag name for flag ${flag}.`);
  }
  return npcFlag;
}
