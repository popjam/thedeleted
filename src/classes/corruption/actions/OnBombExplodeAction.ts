import { ON_BOMB_EXPLODE_ACTION_FREQUENCY } from "../../../constants/severityConstants";
import { ActionType } from "../../../enums/corruption/actions/ActionType";
import { triggerPlayerActionsByType } from "../../../features/corruption/effects/playerEffects";
import type { TriggerData } from "../../../interfaces/corruption/actions/TriggerData";
import { Action } from "./Action";

const ACTION_TYPE = ActionType.ON_BOMB_EXPLODE;
const SINGULAR_TRIGGER_CLAUSE = "bomb use";
const PLURAL_TRIGGER_CLAUSE = "bomb uses";

/** Triggers every time a bomb explodes. */
export class OnBombExplodeAction extends Action {
  override actionType = ACTION_TYPE;

  override getIdealSeverity(): number {
    return super.getIdealSeverity(ON_BOMB_EXPLODE_ACTION_FREQUENCY);
  }

  protected override getTriggerClause(plural: boolean, _eid = true): string {
    if (plural) {
      return PLURAL_TRIGGER_CLAUSE;
    }

    return SINGULAR_TRIGGER_CLAUSE;
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
  const entity = bomb.SpawnerEntity;
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
