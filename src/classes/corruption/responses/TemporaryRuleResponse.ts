import { CollectibleType } from "isaac-typescript-definitions";
import { deepCopy } from "isaacscript-common";
import { ResponseType } from "../../../enums/corruption/responses/ResponseType";
import { Rule } from "../../../enums/customModFeatures/rules";
import { addActionsToPlayer } from "../../../features/corruption/effects/playerEffects";
import { TriggerData } from "../../../interfaces/corruption/actions/TriggerData";
import { getCMFFromRule } from "../../../maps/rules/ruleCMFMap";
import { EveryItemIsInstance } from "../../../modFeatures/general/EveryItemIsFeature";
import { CMFInstance, RulePlusInstance } from "../../../types/CMFInstance";
import { Action } from "../actions/Action";
import { OnRoomAction } from "../actions/OnRoomAction";
import { RemoveRuleResponse } from "./RemoveRuleResponse";
import { Response } from "./Response";

const DEFAULT_REMOVE_ON = new OnRoomAction();
const DEFAULT_REMOVAL_RESPONSE = new RemoveRuleResponse();
const DEFAULT_RPI: RulePlusInstance = [
  Rule.EVERY_ITEM_IS_RULE,
  { collectibleType: CollectibleType.ABEL } as EveryItemIsInstance,
];

/**
 * Response which temporarily activates a 'Rule'. Rules are modifications of the game.
 *
 * @param removeOn When to remove the Rule. Action will be deep copied and set to remove itself
 *                 after firing once.
 */
export class TemporaryRuleResponse extends Response {
  override responseType: ResponseType = ResponseType.TEMPORARY_RULE;
  ro?: Action;
  rpi?: RulePlusInstance;

  construct<T extends CMFInstance>(
    rule: Rule,
    instance: T,
    removeOn: Action,
  ): this {
    this.setRulePlusInstance(rule, instance);
    this.setRemoveOn(removeOn);
    return this;
  }

  getRulePlusInstance(): RulePlusInstance {
    return this.rpi ?? DEFAULT_RPI;
  }

  setRulePlusInstance(rule: Rule, instance: CMFInstance): this {
    this.rpi = [rule, instance];
    return this;
  }

  /**
   * When to remove the collectible. When the action fires, the collectible will be removed. The
   * provided Action will be deep-copied.
   */
  getRemoveOn(): Action {
    return this.ro ?? DEFAULT_REMOVE_ON;
  }

  /**
   * When to remove the collectible. When the action fires, the collectible will be removed. The
   * provided Action will be deep-copied.
   */
  setRemoveOn(action: Action): this {
    this.ro = action;
    return this;
  }

  getText(): string {
    return "";
  }

  /**
   * Generates the removal Action. Will always set 'FireAfterThenRemove' to 1, as the Action should
   * always remove itself after firing.
   */
  generateRemoveOn(rule: Rule, id: number): Action {
    const action = deepCopy<Action>(this.getRemoveOn());
    action.setFireAfterThenRemove(1).setPermanence(true);
    const response = deepCopy(DEFAULT_REMOVAL_RESPONSE);
    return action.setResponse(response.setID(id).setRule(rule));
  }

  fire(triggerData: TriggerData): void {
    const player = triggerData.player ?? Isaac.GetPlayer();

    // Subscribe to Rule.
    const rpi = this.getRulePlusInstance();
    const rule = rpi[0];
    const instance = rpi[1];
    const CMF = getCMFFromRule(rule);
    const id = CMF.subscribeWithInstance(instance);

    // Add removal Action.
    addActionsToPlayer(player, this.generateRemoveOn(rule, id));
  }
}
