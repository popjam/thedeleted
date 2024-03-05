import { ModCallbackCustom } from "isaacscript-common";
import type { ModUpgraded } from "isaacscript-common";
import { triggerOnDeathActions } from "../classes/corruption/actions/OnDeathAction";

export function preCustomReviveInit(mod: ModUpgraded): void {
  mod.AddCallbackCustom(
    ModCallbackCustom.PRE_CUSTOM_REVIVE,
    triggerOnDeathActions,
  );
}
