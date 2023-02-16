/** The 'parent' of the Action. */
export enum ActionOrigin {
  /**
   * If the Action is from an inverted collectible. This makes it easier to remove the Action when
   * the inverted collectible is rerolled or removed.
   */
  INVERTED_COLLECTIBLE,
  TEMPORARY_ACTION,
  TEMPORARY_TRINKET,
  TEMPORARY_RULE,
}

/** The source of the Action, along with an ID. */
export type ActionOriginType = [ActionOrigin, number];
