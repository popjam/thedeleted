import { CollectibleType, SoundEffect } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  getPlayerIndex,
  ModCallbackCustom,
  PlayerIndex,
} from "isaacscript-common";
import { fprint } from "../../helper/printHelper";
import { CustomModFeature } from "../CustomModFeature";

export interface TooManyItemsInstance {
  player: PlayerIndex;
  limit: number;
}

export interface TooManyItemsInput {
  player: PlayerIndex;
  limit: number;
}

const POST_REMOVAL_SFX = SoundEffect.BOSS_2_INTRO_ERROR_BUZZ;

/**
 * This feature sets a limit on the number of Collectibles a player can pick up. If a player picks
 * up an item while over or at the limit, the item will be added to the player but then quickly
 * removed. Does not remove items over the limit if you subscribe while limit is higher than
 * collectible count.
 *
 * If there are multiple subscribers, it will favor the lowest count.
 * TODO: Prevent infinite loops.
 */
export class TooManyItemsFeature extends CustomModFeature<TooManyItemsInstance> {
  override v = {
    run: {
      subscribers: new Map<number, TooManyItemsInstance>([]),
      ids: 0,
    },
  };

  /**
   * Once this feature is enabled, every item spawned will be of one CollectibleType.
   *
   * If there are multiple subscribers, it will favor the most recent addition.
   */
  override subscribe(player: EntityPlayer, limit: number): number {
    return this.subscribeWithInput({
      player: getPlayerIndex(player),
      limit,
    });
  }

  override subscribeWithInput(input: TooManyItemsInput): number {
    fprint("Subscribing to TooManyItemsFeature!");

    return this.addInstance({
      player: input.player,
      limit: input.limit,
    });
  }

  override unsubscribe(id: number): void {
    fprint("Unsubscribing from TooManyItemsFeature!");

    this.removeInstance(id);
  }

  @CallbackCustom(ModCallbackCustom.POST_PLAYER_COLLECTIBLE_ADDED)
  postPlayerCollectibleAdded(
    player: EntityPlayer,
    collectibleType: CollectibleType,
  ): void {
    const playerIndex = getPlayerIndex(player);
    const playerCollectiblesCount = player.GetCollectibleCount();
    // TODO: Account for pocket item / actives.
    const playerLimits = [...this.v.run.subscribers.values()]
      .filter((value: TooManyItemsInstance) => value.player === playerIndex)
      .map((value) => value.limit);
    const minLimit = Math.min(...playerLimits);
    if (playerCollectiblesCount > minLimit) {
      player.RemoveCollectible(collectibleType);
      // ItemDisplayLibrary.queueItemDisplay(player, collectibleType);

      // sfxManager.Play(POST_REMOVAL_SFX);
      // TODO: Add floating item animation.
    }
  }
}
