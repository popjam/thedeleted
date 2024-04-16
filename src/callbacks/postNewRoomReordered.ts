import type { ModUpgraded } from "isaacscript-common";
import { ModCallbackCustom } from "isaacscript-common";
import { triggerOnRoomActions } from "../classes/corruption/actions/OnRoomAction";
import { backdropHelperPostNewRoomReordered } from "../features/general/backdropHelper";
import { floorColorHelperPostNewRoomReordered } from "../features/general/floorColorHelper";
import { lastRoomVisitedPostNewRoomReordered } from "../features/general/lastRoomVisited";
import { temporaryItemsPostNewRoomReordered } from "../features/general/temporaryItems";

export function postNewRoomReorderedInit(mod: ModUpgraded): void {
  mod.AddCallbackCustom(ModCallbackCustom.POST_NEW_ROOM_REORDERED, main);
}

function main() {
  lastRoomVisitedPostNewRoomReordered();
  backdropHelperPostNewRoomReordered();
  floorColorHelperPostNewRoomReordered();
  temporaryItemsPostNewRoomReordered();
  triggerOnRoomActions();
}
