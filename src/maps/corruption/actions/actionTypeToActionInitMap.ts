import type { Action } from "../../../classes/corruption/actions/Action";
import { OnActiveUseAction } from "../../../classes/corruption/actions/OnActiveUseAction";
import { OnBombExplodeAction } from "../../../classes/corruption/actions/OnBombExplodeAction";
import { OnCardUseAction } from "../../../classes/corruption/actions/OnCardUseAction";
import { OnDamageAction } from "../../../classes/corruption/actions/OnDamageAction";
import { OnDeathAction } from "../../../classes/corruption/actions/OnDeathAction";
import { OnFloorAction } from "../../../classes/corruption/actions/OnFloorAction";
import { OnGreedWaveClearAction } from "../../../classes/corruption/actions/OnGreedWaveClearAction";
import { OnKillAction } from "../../../classes/corruption/actions/OnKillAction";
import { OnPickupCollectAction } from "../../../classes/corruption/actions/OnPickupCollectAction";
import { OnPillUseAction } from "../../../classes/corruption/actions/OnPillUseAction";
import { OnPurchaseAction } from "../../../classes/corruption/actions/OnPurchaseAction";
import { OnReviveAction } from "../../../classes/corruption/actions/OnReviveAction";
import { OnRoomAction } from "../../../classes/corruption/actions/OnRoomAction";
import { OnRoomClearAction } from "../../../classes/corruption/actions/OnRoomClearAction";
import { OnSacrificeAction } from "../../../classes/corruption/actions/OnSacrificeAction";
import { OnSlotDestroyAction } from "../../../classes/corruption/actions/OnSlotDestroyAction";
import { OnSlotUseAction } from "../../../classes/corruption/actions/OnSlotUseAction";
import { OnStatAction } from "../../../classes/corruption/actions/OnStatAction";
import { ActionType } from "../../../enums/corruption/actions/ActionType";

const ACTION_TYPE_TO_ACTION_INITIALIZATION_MAP: ReadonlyMap<
  ActionType,
  () => Action
> = new Map([
  [ActionType.ON_ACTIVE_USE, () => new OnActiveUseAction() as Action],
  [ActionType.ON_BOMB_EXPLODE, () => new OnBombExplodeAction()],
  [ActionType.ON_CARD_USE, () => new OnCardUseAction()],
  [ActionType.ON_DAMAGE, () => new OnDamageAction()],
  [ActionType.ON_DEATH, () => new OnDeathAction()],
  [ActionType.ON_FLOOR, () => new OnFloorAction()],
  [ActionType.ON_GREED_WAVE_CLEAR, () => new OnGreedWaveClearAction()],
  [ActionType.ON_KILL, () => new OnKillAction()],
  [ActionType.ON_PICKUP_COLLECT, () => new OnPickupCollectAction()],
  [ActionType.ON_PILL_USE, () => new OnPillUseAction()],
  [ActionType.ON_PURCHASE, () => new OnPurchaseAction()],
  [ActionType.ON_REVIVE, () => new OnReviveAction()],
  [ActionType.ON_ROOM, () => new OnRoomAction()],
  [ActionType.ON_ROOM_CLEAR, () => new OnRoomClearAction()],
  [ActionType.ON_SACRIFICE, () => new OnSacrificeAction()],
  [ActionType.ON_SLOT_DESTROY, () => new OnSlotDestroyAction()],
  [ActionType.ON_SLOT_USE, () => new OnSlotUseAction()],
  [ActionType.ON_STAT, () => new OnStatAction()],
]);

/**
 * Get an Action from an ActionType. The Action will be an empty Action.
 *
 * @param actionType The ActionType to get the Action from.
 * @returns The Action.
 */
export function generateActionFromActionType(actionType: ActionType): Action {
  const actionInit = ACTION_TYPE_TO_ACTION_INITIALIZATION_MAP.get(actionType);
  if (actionInit === undefined) {
    error(`No action initialization found for action type: ${actionType}`);
  }
  return actionInit();
}
