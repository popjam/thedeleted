import {
  ActiveSlot,
  CollectibleType,
  UseFlag,
} from "isaac-typescript-definitions";
import { CollectibleTypeCustom } from "../../../enums/general/CollectibleTypeCustom";
import { replaceActiveItem } from "../../../helper/collectibleHelper";
import { fprint } from "../../../helper/printHelper";
import { eyeBlink, shouldEyeDegrade } from "./eyeGeneral";

export function eye3PostUseItem(
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
  return eye3Use(player, activeSlot);
}

function eye3Use(
  player: EntityPlayer,
  activeSlot: ActiveSlot,
):
  | boolean
  | { Discharge: boolean; Remove: boolean; ShowAnim: boolean }
  | undefined {
  fprint("Using MYDOOM eye which is in stage 3...");
  if (shouldEyeDegrade()) {
    fprint("MYDOOM eye has degraded! (stage 3 -> stage 2)");
    replaceActiveItem(
      player,
      activeSlot,
      CollectibleTypeCustom.MYDOOM_EYE_STAGE_2,
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
