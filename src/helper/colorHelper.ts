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
export function reddenColor(color: Color, a = 1): Color {
  /** Reduce 'G' value by 0.1, but not less than 0. */
  color.G = color.G - 0.2 < 0 ? 0 : color.G - 0.1;
  /** Reduce 'B' value by 0.1, but not less than 0. */
  color.B = color.B - 0.2 < 0 ? 0 : color.B - 0.1;
  /** Increase Red offset by a small amount. */
  color.RO = color.RO + 0.01 * a > 1 ? 1 : color.RO + 0.01 * a;
  return color;
}

/** Makes a Color slightly bluer. */
export function bluenColor(color: Color, a = 1): Color {
  /** Reduce 'R' value by 0.1, but not less than 0. */
  color.R = color.R - 0.2 < 0 ? 0 : color.R - 0.1;
  /** Reduce 'G' value by 0.1, but not less than 0. */
  color.G = color.G - 0.2 < 0 ? 0 : color.G - 0.1;
  /** Increase Blue offset by a small amount. */
  color.BO = color.BO + 0.01 * a > 1 ? 1 : color.BO + 0.01 * a;
  return color;
}

/** Very simple color mixing. Mix any amount of Colors. */
export function mixColors(...colors: Color[]): Color {
  const mixedColor = Color(0, 0, 0, 0);
  colors.forEach((color) => {
    mixedColor.R += color.R;
    mixedColor.G += color.G;
    mixedColor.B += color.B;
    mixedColor.A += color.A;
  });
  mixedColor.R /= colors.length;
  mixedColor.G /= colors.length;
  mixedColor.B /= colors.length;
  mixedColor.A /= colors.length;
  return mixedColor;
}

/** Converts a Color object into a Colorize array. */
export function colorToColorize(
  color: Color,
): [number, number, number, number] {
  return [color.R, color.G, color.B, color.A];
}
