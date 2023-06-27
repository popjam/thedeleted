import { getNPCs, getProjectiles } from "isaacscript-common";
import { MYDOOM_EYE_CHANCE_TO_DEGRADE } from "../../../constants/items/MYDOOMEyeConstants";
import { rollPercentage } from "../../../types/general/Percentage";

/** General function called from POST_USE_ITEM that is shared between all MYDOOM eye stages. */
export function shouldEyeDegrade(): boolean {
  if (rollPercentage(MYDOOM_EYE_CHANCE_TO_DEGRADE)) {
    return true;
  }

  return false;
}

/** The physical and visual effect from a blink of any stage of the MYDOOM eye. */
export function eyeBlink(): void {
  getProjectiles().forEach((projectile) => {
    projectile.Remove();
  });
  getNPCs().forEach((npc) => {
    if (npc.HitPoints <= 100) {
      npc.Remove();
    } else {
      npc.HitPoints -= 100;
    }
  });
}
