import { populateGameSets } from "../gameSetBuilder";

// POST_GAME_STARTED_REORDERED, isContinued: FALSE. Used to initialize game entity sets.
export function postGameStartedReorderedGameEntitySetBuilder(): void {
  populateGameSets();
}
