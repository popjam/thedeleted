import {
  ActiveSlot,
  CollectibleType,
  UseFlag,
} from "isaac-typescript-definitions";
import { fprint } from "../../../helper/printHelper";
import { eyeBlink, shouldEyeDegrade } from "./eyeGeneral";

export function eye1PostUseItem(
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
  return eye1Use(player, activeSlot);
}

function eye1Use(
  player: EntityPlayer,
  activeSlot: ActiveSlot,
):
  | boolean
  | { Discharge: boolean; Remove: boolean; ShowAnim: boolean }
  | undefined {
  fprint("Using MYDOOM eye which is in stage 1...");
  if (shouldEyeDegrade()) {
    fprint("MYDOOM eye has degraded! (destroyed)");
    return {
      Discharge: false,
      Remove: false,
      ShowAnim: false,
    };
  }

  eyeBlink();

  return { Discharge: false, Remove: false, ShowAnim: false };
}
