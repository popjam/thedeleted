/**
 * Tags to apply certain properties to ActionSets. These may modify the appearance of the pickup
 * holding the ActionSet, change on pickup behavior or other things.
 */
export interface ActionSetTag {
  /**
   * The color of the pickup the ActionSet is attached to. If undefined, the pickup will be its
   * default color.
   */
  color?: Color;
}
