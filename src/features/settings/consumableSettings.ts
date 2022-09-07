import { DefaultMap, getPlayerIndex, PlayerIndex } from "isaacscript-common";

const DEFAULT_STARTING_BOMBS = 0;
const DEFAULT_STARTING_COINS = 0;
const DEFAULT_STARTING_KEYS = 0;

const v = {
  run: {
    startingBombs: new DefaultMap<PlayerIndex, number>(DEFAULT_STARTING_BOMBS),
    startingKeys: new DefaultMap<PlayerIndex, number>(DEFAULT_STARTING_KEYS),
    startingCoins: new DefaultMap<PlayerIndex, number>(DEFAULT_STARTING_COINS),
  },
};

export function setStartingBombsSetting(
  player: EntityPlayer,
  startingBombAmount: number,
): void {
  v.run.startingBombs.set(getPlayerIndex(player), startingBombAmount);
}

export function getStartingBombsSetting(player: EntityPlayer): number {
  return v.run.startingBombs.getAndSetDefault(getPlayerIndex(player));
}
