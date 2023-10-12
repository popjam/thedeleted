/** Tracks data relevant to the Custom Active that the InvertedActiveActionSet relates to. */
export interface CustomActiveData {
  /** The current charge count of the custom active item. */
  i?: number;

  /**
   * The current charge count of the non-Inverted Active item that is on the flip side of this one.
   */
  n?: number;
}
