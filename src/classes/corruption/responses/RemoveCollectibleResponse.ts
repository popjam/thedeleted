import { CollectibleType } from "isaac-typescript-definitions";
import { ResponseType } from "../../../enums/corruption/responses/ResponseType";
import { playerRemovePermanentCollectibleEffect } from "../../../features/general/temporaryItems";
import { TriggerData } from "../../../interfaces/corruption/actions/TriggerData";
import { Response } from "./Response";

const DEFAULT_COLLECTIBLE = CollectibleType.POOP;
const DEFAULT_CE = false;

export class RemoveCollectibleResponse extends Response {
  override responseType: ResponseType = ResponseType.REMOVE_COLLECTIBLE;
  c?: CollectibleType;
  ce?: boolean;

  /**
   * Whether the Response should remove a physical collectible or a 'permanent' collectible effect.
   * Default is false.
   */
  isCollectibleEffect(): boolean {
    return this.ce ?? DEFAULT_CE;
  }

  /**
   * Whether the Response should remove a physical collectible or a 'permanent' collectible effect.
   * Default is false.
   */
  setCollectibleEffect(isCollectibleEffect: boolean): this {
    this.ce = isCollectibleEffect;
    return this;
  }

  /** The collectible to remove. */
  getCollectible(): CollectibleType {
    return this.c ?? DEFAULT_COLLECTIBLE;
  }

  /** The collectible to remove. */
  setCollectible(collectible: CollectibleType): this {
    this.c = collectible;
    return this;
  }

  getText(): string {
    return "";
  }

  fire(triggerData: TriggerData): void {
    const player = triggerData.player ?? Isaac.GetPlayer();
    const isCollectibleEffect = this.isCollectibleEffect();

    if (isCollectibleEffect) {
      playerRemovePermanentCollectibleEffect(player, this.getCollectible());
    } else {
      player.RemoveCollectible(this.getCollectible());
    }
  }
}
