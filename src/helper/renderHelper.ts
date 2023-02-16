import { game } from "isaacscript-common";
import { mod } from "../mod";

/** Continuously fires a function every render frame. */
export function renderConstantly(func: () => void): void {
  mod.runInNRenderFrames(() => {
    func();
    renderConstantly(func);
  }, 1);
}

/** Translates world to render coordinates, taking into account scroll offset. */
export function worldToRenderPosition(position: Vector): Vector {
  return Isaac.WorldToRenderPosition(position).add(
    game.GetRoom().GetRenderScrollOffset(),
  );
}
