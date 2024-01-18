import { populateGameEntitySets } from "../gameEntitySetBuilder";

// POST_GAME_STARTED_REORDERED, isContinued: FALSE. Used to initialize game entity sets.
export function postGameStartedReorderedGameEntitySetBuilder(): void {
  populateGameEntitySets();
}
