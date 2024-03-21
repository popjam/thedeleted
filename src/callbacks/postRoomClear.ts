import type { ModUpgraded } from "isaacscript-common";
import { ModCallbackCustom } from "isaacscript-common";
import { triggerOnRoomClearActions } from "../classes/corruption/actions/OnRoomClearAction";
import { fprint } from "../helper/printHelper";

export function postRoomClearInit(mod: ModUpgraded): void {
  mod.AddCallbackCustom(
    ModCallbackCustom.POST_ROOM_CLEAR_CHANGED,
    onRoomClearMain,
    true,
  );
}

function onRoomClearMain() {
  triggerOnRoomClearActions();
}
