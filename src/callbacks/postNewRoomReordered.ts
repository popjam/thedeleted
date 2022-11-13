import { ModCallbackCustom, ModUpgraded } from "isaacscript-common";
import { triggerOnRoomActions } from "../classes/corruption/actions/OnRoomAction";
import { postNewRoomReorderedBackdrop } from "../features/general/backdropHelper";
import { temporaryItemsPostNewRoomReordered } from "../features/general/temporaryItems";
import { iLoveYouPostNewRoom as iLoveYouPostNewRoomReordered } from "../features/modes/ILOVEYOU/ILOVEYOU";

export function postNewRoomReorderedInit(mod: ModUpgraded): void {
  mod.AddCallbackCustom(ModCallbackCustom.POST_NEW_ROOM_REORDERED, main);
}

function main() {
  postNewRoomReorderedBackdrop();
  temporaryItemsPostNewRoomReordered();
  iLoveYouPostNewRoomReordered();
  triggerOnRoomActions();
}
