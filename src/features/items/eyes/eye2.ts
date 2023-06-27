import {
  ActiveSlot,
  CollectibleType,
  UseFlag,
} from "isaac-typescript-definitions";
import { CollectibleTypeCustom } from "../../../enums/general/CollectibleTypeCustom";
import { replaceActiveItem } from "../../../helper/collectibleHelper";
import { fprint } from "../../../helper/printHelper";
import { eyeBlink, shouldEyeDegrade } from "./eyeGeneral";

export function eye2PostUseItem(
  collectibleType: CollectibleType,
  rng: RNG,
  player: EntityPlayer,
  useFlags: BitFlags<UseFlag>,
  activeSlot: int,
  customVarData: int,
):
  | boolean
  | { Discharge: boolean; Remove: boolean; ShowAnim: boolean }
  | undefined {
  return eye2Use(player, activeSlot);
}

function eye2Use(
  player: EntityPlayer,
  activeSlot: ActiveSlot,
):
  | boolean
  | { Discharge: boolean; Remove: boolean; ShowAnim: boolean }
  | undefined {
  fprint("Using MYDOOM eye which is in stage 2...");
  if (shouldEyeDegrade()) {
    fprint("MYDOOM eye has degraded! (stage 2 -> stage 1)");
    replaceActiveItem(
      player,
      activeSlot,
      CollectibleTypeCustom.MYDOOM_EYE_STAGE_1,
    );
    return {
      Discharge: false,
      Remove: false,
      ShowAnim: false,
    };
  }

  eyeBlink();

  return { Discharge: false, Remove: false, ShowAnim: false };
}
