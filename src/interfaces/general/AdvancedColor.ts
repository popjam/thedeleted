/**
 * Color objects do not provide methods to retrieve Colorize, Offset and Tint values. Furthermore
 * cloning colors removes these properties. This interface is used to store these values.
 */
export interface AdvancedColor {
  color: Color;
  colorize?: [number, number, number, number];
  tint?: [number, number, number, number];
}
