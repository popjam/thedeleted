import { SoundEffect } from "isaac-typescript-definitions";
import { ModCallbackCustom, ModUpgraded, sfxManager } from "isaacscript-common";

export function postGridEntityCollisionInit(mod: ModUpgraded): void {
  mod.AddCallbackCustom(ModCallbackCustom.POST_GRID_ENTITY_COLLISION, main);
}

// Inactive.
function main(gridEntity: GridEntity, entity: Entity) {
  sfxManager.Play(SoundEffect.BATTERY_CHARGE);
}
