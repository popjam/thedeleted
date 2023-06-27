import { CollectibleType } from "isaac-typescript-definitions";
import {
  _getCustomActiveActiveSlot1,
  _getCustomActiveActiveSlot2,
} from "../../../classes/facets/CustomActiveFacet";

/** Determines if the physical Zazz Active added to ActiveSlot.PRIMARY should be a copy or not. */
export function shouldZazzActiveBeACopy(player: EntityPlayer): boolean {
  const activeSlot1 = _getCustomActiveActiveSlot1(player);
  const activeSlot2 = _getCustomActiveActiveSlot2(player);
  const hasSchoolbag = player.HasCollectible(CollectibleType.SCHOOLBAG);

  if (activeSlot1 === undefined || !hasSchoolbag) {
    return false;
  }

  // From this point on, has schoolbag and activeSlot1 is defined.
  if (activeSlot2 === undefined) {
    return !(activeSlot1.copy ?? true);
  }

  // Both slots full.
  return !(activeSlot2.copy ?? true);
}
