import { EntityType, FireplaceVariant } from "isaac-typescript-definitions";
import { game, spawnNPC } from "isaacscript-common";
import { fprint } from "../printHelper";

const EXPLODE_ENTITY_SCREEN_SHAKE_DURATION = 10;

/**
 * Explodes an entity. This differentiates itself from Entity.Explode() by being able to hurt the
 * player.
 */
export function explodeEntity(entity: Entity, damage = 100): void {
  fprint(
    `Exploding entity: ${entity.Type} (${
      entity.Variant
    } GAME FRAMES: ${game.GetFrameCount()})`,
  );
  entity.Remove();
  Isaac.Explode(entity.Position, undefined, damage);
  spawnNPC(EntityType.FIREPLACE, FireplaceVariant.MOVEABLE, 0, entity.Position);
  game.ShakeScreen(EXPLODE_ENTITY_SCREEN_SHAKE_DURATION);
}
