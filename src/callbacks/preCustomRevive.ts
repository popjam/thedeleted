import { ModCallbackCustom } from "isaacscript-common";
import type { ModUpgraded } from "isaacscript-common";
import { triggerOnReviveActions } from "../classes/corruption/actions/OnReviveAction";

export function preCustomReviveInit(mod: ModUpgraded): void {
  mod.AddCallbackCustom(
    ModCallbackCustom.PRE_CUSTOM_REVIVE,
    triggerOnReviveActions,
  );
}
