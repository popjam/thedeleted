import { ModCallbackCustom, ModUpgraded } from "isaacscript-common";
import { iLoveYouPostNewRoom } from "../features/modes/ILOVEYOU/ILOVEYOU";
import { postNewRoomReorderedBackdrop } from "../helper/backdropHelper";

export function postNewRoomReorderedInit(mod: ModUpgraded): void {
  mod.AddCallbackCustom(ModCallbackCustom.POST_NEW_ROOM_REORDERED, main);
}

function main() {
  postNewRoomReorderedBackdrop();
  iLoveYouPostNewRoom();
}
