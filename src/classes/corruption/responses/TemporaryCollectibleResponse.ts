import { CollectibleType } from "isaac-typescript-definitions";
import { deepCopy } from "isaacscript-common";
import { ResponseType } from "../../../enums/corruption/responses/ResponseType";
import { _addActionsToTracker } from "../../../features/corruption/effects/playerEffects";
import { addCollectibleOrEffect } from "../../../helper/collectibleHelper";
import type { TriggerData } from "../../../interfaces/corruption/actions/TriggerData";
import type { Action } from "../actions/Action";
import { OnRoomAction } from "../actions/OnRoomAction";
import { RemoveCollectibleResponse } from "./RemoveCollectibleResponse";
import { Response } from "./Response";

const DEFAULT_REMOVE_ON = new OnRoomAction();
const DEFAULT_REMOVAL_RESPONSE = new RemoveCollectibleResponse();
const DEFAULT_COLLECTIBLE = CollectibleType.POOP;
const VERB = "get";
const VERB_PARTICIPLE = "getting";

/**
 * Response which temporarily gives the player a collectible. The collectible may be in the form of
 * an actual collectible or a collectible effect (depending on whether the collectible effect
 * works).
 */
export class TemporaryCollectibleResponse extends Response {
  override responseType: ResponseType = ResponseType.TEMPORARY_COLLECTIBLE;
  ro?: Action;
  c?: CollectibleType;

  /** Remove On will be deep-copied. */
  construct(collectible: CollectibleType, removeOn: Action): this {
    return this.setCollectible(collectible).setRemoveOn(removeOn);
  }

  override getInvolvedCollectibles(): CollectibleType[] {
    return [this.getCollectible()];
  }

  getCollectible(): CollectibleType {
    return this.c ?? DEFAULT_COLLECTIBLE;
  }

  setCollectible(collectible: CollectibleType): this {
    this.c = collectible;
    return this;
  }

  /** When to remove the collectible. When the action fires, the collectible will be removed. */
  getRemoveOn(): Action {
    return this.ro ?? DEFAULT_REMOVE_ON;
  }

  /**
   * When to remove the collectible. When the action fires, the collectible will be removed. The
   * provided Action will be deep-copied.
   */
  setRemoveOn(action: Action): this {
    this.ro = deepCopy<Action>(action);
    return this;
  }

  override getVerb(participle: boolean): string {
    return participle ? VERB_PARTICIPLE : VERB;
  }

  override getNoun(_eid: boolean): string {
    return "";
  }

  getText(): string {
    return "";
  }

  /**
   * Generates the removal Action. Will always set 'FireAfterThenRemove' to 1, as the Action should
   * always remove itself after firing.
   *
   * @param isEffect Whether the generated Response should remove a permanent collectible effect or
   *                 an actual collectible.
   */
  generateRemoveOn(isEffect: boolean): Action {
    const action = deepCopy<Action>(this.getRemoveOn());
    action.setFireAfterThenRemove(1).setPermanence(true);
    const response = deepCopy(DEFAULT_REMOVAL_RESPONSE);
    response
      .setCollectible(this.getCollectible())
      .setCollectibleEffect(isEffect);
    return action.setResponse(response);
  }

  fire(triggerData: TriggerData): void {
    const player = triggerData.player ?? Isaac.GetPlayer();
    const collectible = this.getCollectible();

    // Add collectible.
    const isEffect = addCollectibleOrEffect(player, collectible);

    // Add removal Action.
    _addActionsToTracker(player, this.generateRemoveOn(isEffect));
  }
}
