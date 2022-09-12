import {
  DefaultMap,
  getPlayerIndex,
  getPlayers,
  getRandomArrayElement,
  PlayerIndex,
  saveDataManager,
} from "isaacscript-common";
import { DEFAULT_CORRUPTION_DNA } from "../../../constants/corruptionConstants";
import { CorruptionDNA } from "../../../interfaces/corruption/CorruptionDNA";
import { getCorruptionDNASetting } from "../../settings/corruptionSettings";

/**
 * Tracks player inversion status. Non-Deleted's always start off un-inverted, while some Deleted
 * modes start inverted. If any one player is inverted, the game will be in an 'inverted' state.
 * Depending on the mode, the inverted state does different things. If there are more than one
 * players inverted, the game will randomly swap between inversion effects of the modes.
 * Non-deleted's can turn inverted through items or soul stones. Deleted's that are supposed to be
 * inverted-only (e.g SPYWIPER) can turn normal if they somehow get an item such as bitflip.
 */

const v = {
  run: {
    /** Describes if the player is in corrupted form. */
    inversionStatus: new DefaultMap<PlayerIndex, boolean>(false),
  },
};

export function inversionInit(): void {
  saveDataManager("inversion", v);
}

/** Returns the specified players' inversion status. */
export function isPlayerInverted(player: EntityPlayer): boolean {
  return v.run.inversionStatus.getAndSetDefault(getPlayerIndex(player));
}

/** Set the specified players' inversion status. */
export function setPlayerInversion(
  player: EntityPlayer,
  inversion: boolean,
): void {
  v.run.inversionStatus.set(getPlayerIndex(player), inversion);
}

/** Returns array of inverted players. */
export function getInvertedPlayers(): EntityPlayer[] {
  const invertedPlayers: EntityPlayer[] = [];
  for (const player of getPlayers()) {
    if (isPlayerInverted(player)) {
      invertedPlayers.push(player);
    }
  }
  return invertedPlayers;
}

/**
 * Returns a CorruptionDNA based on the inversion settings of the players. If multiple players are
 * inverted, picks a random CorruptionDNA from the set of inverted players. If no players are
 * inverted (so the game is not inverted) defaults to the standard CorruptionDNA.
 */
export function getGameCorruptionDNA(): CorruptionDNA {
  if (isGameInverted()) {
    const invertedPlayers = getInvertedPlayers();
    const chosenRandomPlayer = getRandomArrayElement(invertedPlayers);
    return getCorruptionDNASetting(chosenRandomPlayer);
  }
  return DEFAULT_CORRUPTION_DNA;
}

/** Returns true if the Game is in an inverted state. */
export function isGameInverted(): boolean {
  return getInvertedPlayers().length > 0;
}
