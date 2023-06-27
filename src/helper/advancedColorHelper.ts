import { copyColor, isColor } from "isaacscript-common";
import { AdvancedColor } from "../interfaces/general/AdvancedColor";

/**
 * Generate a Color from an AdvancedColor object. If deepCopy is true, will create a new Color,
 * otherwise will share the same Color object used in the AdvancedColor object. The reason behind
 * 'AdvancedColor' existing is that it allows saving the colorize and tint values, which are not
 * saved in the Color object.
 */
export function generateColorFromAdvancedColor(
  advancedColor: AdvancedColor,
  deepCopy = true,
): Color {
  const color = deepCopy ? copyColor(advancedColor.color) : advancedColor.color;
  if (advancedColor.colorize !== undefined) {
    color.SetColorize(...advancedColor.colorize);
  }

  if (advancedColor.tint !== undefined) {
    color.SetTint(...advancedColor.tint);
  }
  return color;
}

/**
 * If the input is an advancedColor, will convert it to a Color. Otherwise, returns the Color. Will
 * NOT create a new Color object no matter what it is. Use 'simplifyAndCopyColor()' to create a new
 * Color object.
 */
export function simplifyColor(color: AdvancedColor | Color): Color {
  if (isColor(color)) {
    return color;
  }
  return generateColorFromAdvancedColor(color, false);
}

/**
 * If the input is an advancedColor, will convert it to a Color. Otherwise, returns the Color. Will
 * create a new Color object no matter what it is.
 */
export function simplifyAndCopyColor(
  advancedColorOrColor: AdvancedColor | Color,
): Color {
  if (isColor(advancedColorOrColor)) {
    return copyColor(advancedColorOrColor);
  }
  return generateColorFromAdvancedColor(advancedColorOrColor);
}
