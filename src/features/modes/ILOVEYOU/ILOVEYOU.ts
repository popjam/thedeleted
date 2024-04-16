import type { DamageFlag } from "isaac-typescript-definitions";
import { CollectibleType } from "isaac-typescript-definitions";
import { getPlayerIndex } from "isaacscript-common";
import { Mode } from "../../../enums/modes/Mode";
import { fprint } from "../../../helper/printHelper";
import { getModeData } from "../../../maps/modes/modeMap";
import { mod } from "../../../mod";
import { addPermanentStatusEffectToNPC } from "../../../classes/facets/entityModifiers.ts/NPCModifiers/PermanentNPCStatusEffectFacet";
import { NPCFlag } from "../../../enums/general/NPCFlag";
import { spawnEffectID } from "../../../helper/entityHelper/effectHelper";
import { EffectID } from "../../../enums/data/ID/EffectID";

const v = {};
const MODE = Mode.ILOVEYOU;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const MODE_DATA = getModeData(MODE);
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const PERSISTENT_COLLECTIBLE_EFFECT = CollectibleType.MOMS_EYESHADOW;

export function iLoveYouInit(): void {
  mod.saveDataManager("iLoveYou", v);
}

/** Initiate the player to the HAPPY99 mode. */
export function iLoveYouModeSetup(player: EntityPlayer): void {
  fprint(`ILOVEYOU: Mode init for player: ${getPlayerIndex(player)}`);
}

/** When the player swaps out from ILOVEYOU mode. */
export function iLoveYouModeFin(_player: EntityPlayer): void {
  // TODO.
}

/** Kiss effect. When ILOVEYOU is touched by an NPC, will charm NPC and let off a 'heart'. */
export function iloveyouPlayerTakeDMG(
  player: EntityPlayer,
  _amount: float,
  _damageFlags: BitFlags<DamageFlag>,
  source: EntityRef,
  _countdownFrames: int,
): boolean | undefined {
  const sourceEntity = source.Entity;
  if (sourceEntity !== undefined) {
    const npc = sourceEntity.ToNPC();
    if (npc !== undefined) {
      addPermanentStatusEffectToNPC(npc, NPCFlag.CHARMED);
      releaseHeart(player, npc);
    }
  }

  return undefined;
}

function releaseHeart(player: EntityPlayer, _sourceNPC: EntityNPC) {
  spawnEffectID(EffectID.POOF_01_SMALL, player.Position);
}
