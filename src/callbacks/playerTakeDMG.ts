import {
  DamageFlag,
  EntityType,
  ModCallback,
  PlayerVariant,
} from "isaac-typescript-definitions";
import { ModCallbackCustom, ModUpgraded } from "isaacscript-common";
import { triggerOnDamageActions } from "../classes/corruption/actions/OnDamageAction";
import { PlayerTypeCustom } from "../enums/general/PlayerTypeCustom";
import { temporaryItemsPlayerTakeDMG } from "../features/general/temporaryItems";
import { iloveyouPlayerTakeDMG } from "../features/modes/ILOVEYOU/ILOVEYOU";

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
  mod.AddCallbackCustom(
    ModCallbackCustom.ENTITY_TAKE_DMG_PLAYER,
    iloveyou,
    PlayerVariant.PLAYER,
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

function iloveyou(
  player: EntityPlayer,
  amount: float,
  damageFlags: BitFlags<DamageFlag>,
  source: EntityRef,
  countdownFrames: int,
): boolean | undefined {
  if (player.GetPlayerType() !== PlayerTypeCustom.DELETED_ILOVEYOU) {
    return undefined;
  }
  return iloveyouPlayerTakeDMG(
    player,
    amount,
    damageFlags,
    source,
    countdownFrames,
  );
}
