import { ModCallback } from "isaac-typescript-definitions";
import type { ModUpgraded } from "isaacscript-common";
import { uiPCPostRender } from "../features/pc/uiPC";

export function postRenderInit(mod: ModUpgraded): void {
  mod.AddCallback(ModCallback.POST_RENDER, main);
}

function main() {
  uiPCPostRender();
}
