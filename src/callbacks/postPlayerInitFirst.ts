import { PlayerVariant } from "isaac-typescript-definitions";
import type { ModUpgraded } from "isaacscript-common";
import { ModCallbackCustom } from "isaacscript-common";
import { modePostPlayerInitFirst as modePostPlayerInitDeletedFirst } from "../features/modes/mode";
import { mainPCPostPlayerInitDeletedFirst } from "../features/pc/callbacks/pcPostPlayerInitFirst";
import {
  isPlayerNormalDeleted,
  isPlayerTaintedDeleted,
} from "../helper/deletedSpecific/deletedHelper";

export function postPlayerInitFirstInit(mod: ModUpgraded): void {
  mod.AddCallbackCustom(
    ModCallbackCustom.POST_PLAYER_INIT_FIRST,
    normalDeletedInit,
    PlayerVariant.PLAYER,
  );
  mod.AddCallbackCustom(
    ModCallbackCustom.POST_PLAYER_INIT_FIRST,
    taintedDeletedInit,
    PlayerVariant.PLAYER,
  );
}

function normalDeletedInit(player: EntityPlayer) {
  if (isPlayerNormalDeleted(player)) {
    mainPCPostPlayerInitDeletedFirst(player);
    modePostPlayerInitDeletedFirst(player);
  }
}

function taintedDeletedInit(player: EntityPlayer) {
  if (isPlayerTaintedDeleted(player)) {
    mainPCPostPlayerInitDeletedFirst(player);
    modePostPlayerInitDeletedFirst(player);
  }
}
