import { SoundEffect } from "isaac-typescript-definitions";
import type { PlayerIndex } from "isaacscript-common";
import {
  deepCopy,
  DefaultMap,
  defaultMapGetPlayer,
  getPlayerFromIndex,
  getPlayerIndex,
  mapSetHash,
  sfxManager,
} from "isaacscript-common";
import type { NonInvertedPickupActionSet } from "../../../classes/corruption/actionSets/NonInverted/NonInvertedPickupActionSet";
import type { Response } from "../../../classes/corruption/responses/Response";
import { fprint } from "../../../helper/printHelper";
import { mod } from "../../../mod";

const v = {
  run: {
    /**
     * A cache of corrupted bombs the player currently has. When a new corrupted bomb is added, it
     * will be added to the back of the list. When a bomb is used, it will be removed from the
     * front.
     */
    bombInventory: new DefaultMap<PlayerIndex, NonInvertedPickupActionSet[]>(
      () => [],
    ),
  },
  room: {
    liveBombs: new Map<PtrHash, PlayerIndex>(),
  },
};

export function bombInventoryInit(): void {
  mod.saveDataManager("bombInventory", v);
}

/**
 * Queue a corrupted bomb for the player, with the specified NonInvertedActionSet. If there are
 * already corrupted bombs queued, it will go to the end of the queue.
 *
 * Does Deep Copy.
 */
export function addCorruptedBombToPlayer(
  player: EntityPlayer,
  actionSet: NonInvertedPickupActionSet,
): void {
  const bombInventory = defaultMapGetPlayer(v.run.bombInventory, player);
  bombInventory.push(deepCopy(actionSet));
}

// POST_BOMB_INIT_LATE
export function postCorruptBombInitLate(bomb: EntityBomb): void {
  const player = bomb.SpawnerEntity?.ToPlayer();

  if (player === undefined) {
    return;
  }

  mapSetHash(v.room.liveBombs, bomb, getPlayerIndex(player));

  // Set the bomb colour.
  const bombInventory = v.run.bombInventory.getAndSetDefault(
    getPlayerIndex(player),
  );
  const corruptedBomb = bombInventory.at(-1);
  if (corruptedBomb === undefined) {
    return;
  }
  const color = corruptedBomb.getColor();
  if (color === undefined) {
    return;
  }
  bomb.SetColor(color, 0, 1);
}

// POST_BOMB_UPDATE
export function postCorruptBombUpdate(bomb: EntityBomb): void {}

// POST_BOMB_EXPLODED
export function bombInventoryPostBombExploded(bomb: EntityBomb): void {
  const playerIndex = v.room.liveBombs.get(GetPtrHash(bomb));
  if (playerIndex === undefined) {
    return;
  }
  const bombInventory = v.run.bombInventory.getAndSetDefault(playerIndex);

  const currentBombActionSet = bombInventory.shift();
  if (currentBombActionSet === undefined) {
    return;
  }

  // Silence the bomb sound.
  mod.runNextGameFrame(() => {
    sfxManager.Stop(SoundEffect.BOSS_1_EXPLOSIONS);
  });

  fprint("bombInventory: Firing corrupted bomb!");
  currentBombActionSet.getResponses().forEach((response: Response) => {
    response.trigger({
      player: getPlayerFromIndex(playerIndex),
      onBombExplodedAction: { bomb },
    });
  });
}
