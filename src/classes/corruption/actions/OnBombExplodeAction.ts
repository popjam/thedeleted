import { ActionType } from "../../../enums/corruption/actions/ActionType";
import { triggerPlayerActionsByType } from "../../../features/corruption/effects/playerEffects";
import type { TriggerData } from "../../../interfaces/corruption/actions/TriggerData";
import { Action } from "./Action";

const ACTION_TYPE = ActionType.ON_BOMB_EXPLODE;

/** Triggers every time a bomb explodes. */
export class OnBombExplodeAction extends Action {
  override actionType = ACTION_TYPE;

  protected override getTriggerClause(): string {
    return "a bomb explodes";
  }

  override trigger(triggerData: TriggerData): void {
    super.trigger({ ...triggerData });
  }
}

/**
 * Triggers all OnBombExplodeActions for all players.
 *
 * POST_BOMB_EXPLOSION callback.
 */
export function triggerOnBombExplodeActions(bomb: EntityBomb): void {
  const entity = bomb.Parent;
  // Check if the bomb is from a player.
  if (entity === undefined) {
    return;
  }

  const player = entity.ToPlayer();
  if (player === undefined) {
    return;
  }

  triggerPlayerActionsByType(player, ACTION_TYPE, {
    player,
    onBombExplodeAction: {
      bomb,
    },
    spawnPosition: bomb.Position,
    spawnVelocity: bomb.Velocity,
  });
}
