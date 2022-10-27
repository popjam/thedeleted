import { ModCallbackCustom, ModUpgraded } from "isaacscript-common";

export function postGridEntityCollisionInit(mod: ModUpgraded): void {
  mod.AddCallbackCustom(ModCallbackCustom.POST_GRID_ENTITY_COLLISION, main);
}

function main(gridEntity: GridEntity, entity: Entity) {
  print("collision!");
}
