import { ActiveSlot, ModCallback } from "isaac-typescript-definitions";
import {
  Callback,
  getPlayerIndex,
  mapSetPlayer,
  PlayerIndex,
} from "isaacscript-common";
import { InvertedActiveActionSet } from "../../classes/corruption/actionSets/Inverted/InvertedActiveActionSet";
import { fprint } from "../../helper/printHelper";
import {
  isCustomActiveACopy,
  ZAZZINATOR_ACTIVE_SET,
} from "../../sets/zazzSets";
import { CustomModFeature } from "../CustomModFeature";

export interface CustomActiveInstance {
  thing: string;
}

export interface CustomActiveInput {
  thing: string;
}

export class CustomActiveFeature extends CustomModFeature<CustomActiveInstance> {
  override v = {
    run: {
      subscribers: new Map<number, CustomActiveInstance>([]),
      ids: 0,

      /**
       * Slot 'A', on the top left. Note that this does not correspond with 'ActiveSlot.PRIMARY', as
       * the 'primary' slot is always the forefront. When slot A and slot B are both occupied, slot
       * A will have a 'copied' version of the item.
       */
      copiedSlot: new Map<PlayerIndex, InvertedActiveActionSet>(),
      /** Slot 1. */
      nonCopiedSlot: new Map<PlayerIndex, InvertedActiveActionSet>(),
      /** Slot 2 (permanent pocket). */
      pocketSlot: new Map<PlayerIndex, InvertedActiveActionSet>(),
    },
  };

  override subscribe(
    player: EntityPlayer,
    pocket: boolean,
    actionSet: InvertedActiveActionSet,
  ): number {
    if (pocket) {
      mapSetPlayer(this.v.run.pocketSlot, player, actionSet);
    } else {
      mapSetPlayer(this.v.run.nonCopiedSlot, player, actionSet);
    }

    fprint(`Subscribing to CustomActiveFeature with id: ${this.v.run.ids}`);
    if (!this.initialized) {
      return this.addInstance({ thing: "" });
    }

    return -1;
  }

  override subscribeWithInput(input: CustomActiveInput): number {
    error("CustomActiveFeature.subscribe() is not implemented");
  }

  override unsubscribe(id: number): void {
    fprint(`Unsubscribing from CustomActiveFeature with id: ${id}`);

    this.removeInstance(id);
  }

  isPrimarySlotCopy(player: EntityPlayer): boolean {
    const primarySlot = player.GetActiveItem(ActiveSlot.PRIMARY);
    return isCustomActiveACopy(primarySlot);
  }

  /**
   * If slot is a pocket slot, will return the Custom Active (if exists). However, if the slot is
   * not a pocket slot, needs to determine what Custom Active is in that slot using additional logic
   * as.
   */
  getCustomActiveAtSlot(
    player: EntityPlayer,
    slot: ActiveSlot,
  ): InvertedActiveActionSet | undefined {
    const playerIndex = getPlayerIndex(player);
    if (ActiveSlot.POCKET === slot) {
      return this.v.run.pocketSlot.get(playerIndex);
    }
    const secondarySlot = player.GetActiveItem(ActiveSlot.SECONDARY);
    const primarySlot = player.GetActiveItem(ActiveSlot.PRIMARY);
    const copiedSlot = this.v.run.copiedSlot.get(playerIndex);
    const nonCopiedSlot = this.v.run.nonCopiedSlot.get(playerIndex);
    if (
      ZAZZINATOR_ACTIVE_SET.has(secondarySlot) &&
      ZAZZINATOR_ACTIVE_SET.has(primarySlot)
    ) {
      if (copiedSlot === undefined || nonCopiedSlot === undefined) {
        return undefined;
      }
      if (
        copiedSlot.getChargeType() === nonCopiedSlot.getChargeType() &&
        copiedSlot.getCharges() === nonCopiedSlot.getCharges()
      ) {
        const isPrimaryCopy = isCustomActiveACopy(primarySlot);
        return isPrimaryCopy ? copiedSlot : nonCopiedSlot;
      }
      if (slot === ActiveSlot.PRIMARY) {
        return isCustomActiveACopy(primarySlot) ? copiedSlot : nonCopiedSlot;
      }
      return isCustomActiveACopy(secondarySlot) ? copiedSlot : nonCopiedSlot;
    }
    return nonCopiedSlot;
  }

  @Callback(ModCallback.POST_UPDATE)
  postUpdate(): void {
    fprint(`Subscriber count for CustomActiveFeature: ${this.v.run.ids}`);
    // const primarySlotPlayerOne = this.getCustomActiveAtSlot( Isaac.GetPlayer(),
    // ActiveSlot.PRIMARY, ); if (primarySlotPlayerOne !== undefined) { const iconToRender =
    // primarySlotPlayerOne.getIcon(); if (isColor(iconToRender)) { return; }
    // renderCustomCollectibleSprite( PRIMARY_ACTIVE_SLOT_HUD_RENDER_POSITION, iconToRender,
    // getRunRNG().GetSeed(), ); }
  }
}
