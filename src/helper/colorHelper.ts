import { ColorDefault } from "isaacscript-common";

/** Sets a Sprite to the DefaultColor (Color(1, 1, 1, 1)). */
export function setEntityDefaultColor(entity: Entity): void {
  const sprite = entity.GetSprite();

  sprite.Color = ColorDefault;
}

/** Converts a Color object into a KColor object. */
export function colorToKColor(color: Color): KColor {
  return KColor(color.R, color.G, color.B, color.A);
}

/** Makes a Color slightly redder. */
export function reddenColor(color: Color): Color {
  /** Reduce 'G' value by 0.1, but not less than 0. */
  color.G = color.G - 0.2 < 0 ? 0 : color.G - 0.1;
  /** Reduce 'B' value by 0.1, but not less than 0. */
  color.B = color.B - 0.2 < 0 ? 0 : color.B - 0.1;
  /** Increase Red offset by a small amount. */
  color.RO = color.RO + 0.01 > 1 ? 1 : color.RO + 0.01;
  return color;
}
