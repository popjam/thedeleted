/** The types of save files, going from left to right. */
export enum SaveFileType {
  /** Normal save file behavior. */
  NORMAL = 1,

  /** Character save files reset upon death. */
  HARD = 2,

  /** Entire save file resets upon death. */
  IMPOSSIBLE = 3,
}
