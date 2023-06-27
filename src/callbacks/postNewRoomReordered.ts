import { ModCallbackCustom, ModUpgraded } from "isaacscript-common";
import { triggerOnRoomActions } from "../classes/corruption/actions/OnRoomAction";
import { backdropHelperPostNewRoomReordered } from "../features/general/backdropHelper";
import { floorColorHelperPostNewRoomReordered } from "../features/general/floorColorHelper";
import { lastRoomVisitedPostNewRoomReordered } from "../features/general/lastRoomVisited";
import { temporaryItemsPostNewRoomReordered } from "../features/general/temporaryItems";
import { iLoveYouPostNewRoom as iLoveYouPostNewRoomReordered } from "../features/modes/ILOVEYOU/ILOVEYOU";

export function postNewRoomReorderedInit(mod: ModUpgraded): void {
  mod.AddCallbackCustom(ModCallbackCustom.POST_NEW_ROOM_REORDERED, main);
}

function main() {
  lastRoomVisitedPostNewRoomReordered();
  backdropHelperPostNewRoomReordered();
  floorColorHelperPostNewRoomReordered();
  temporaryItemsPostNewRoomReordered();
  iLoveYouPostNewRoomReordered();
  triggerOnRoomActions();
}
