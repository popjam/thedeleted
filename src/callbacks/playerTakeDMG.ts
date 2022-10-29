import {
  DamageFlag,
  EntityType,
  ModCallback,
} from "isaac-typescript-definitions";
import { ModUpgraded } from "isaacscript-common";
import { triggerOnDamageActions } from "../classes/corruption/actions/OnDamageAction";
import { temporaryItemsPlayerTakeDMG } from "../features/general/temporaryItems";

// Add new callback for every use case, unless order is needed.
export function playerTakeDMGInit(mod: ModUpgraded): void {
  mod.AddCallback(
    ModCallback.ENTITY_TAKE_DMG,
    temporaryItems,
    EntityType.PLAYER,
  );
  mod.AddCallback(
    ModCallback.ENTITY_TAKE_DMG,
    onDamageAction,
    EntityType.PLAYER,
  );
}

function temporaryItems(
  entity: Entity,
  amount: float,
  damageFlags: BitFlags<DamageFlag>,
  source: EntityRef,
  countdownFrames: int,
): boolean | undefined {
  return temporaryItemsPlayerTakeDMG(
    entity,
    amount,
    damageFlags,
    source,
    countdownFrames,
  );
}

function onDamageAction(
  entity: Entity,
  amount: float,
  damageFlags: BitFlags<DamageFlag>,
  source: EntityRef,
  countdownFrames: int,
): boolean | undefined {
  return triggerOnDamageActions(
    entity,
    amount,
    damageFlags,
    source,
    countdownFrames,
  );
}
