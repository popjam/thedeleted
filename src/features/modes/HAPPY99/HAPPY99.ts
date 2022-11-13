import {
  CollectibleType,
  DamageFlag,
  EffectVariant,
  EntityType,
  PickupVariant,
} from "isaac-typescript-definitions";
import {
  getPlayerIndex,
  playerAddCollectible,
  spawn,
  spawnEffect,
} from "isaacscript-common";
import { Mode } from "../../../enums/modes/Mode";
import { fprint } from "../../../helper/printHelper";
import { getModeData } from "../../../maps/modes/modeMap";
import { mod } from "../../../mod";

const v = {};
const MODE = Mode.HAPPY99;
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const MODE_DATA = getModeData(MODE)!;

export function happy99Init(): void {
  mod.saveDataManager("happy99", v);
}

/** Initiate the player to the HAPPY99 mode. */
export function happy99ModeSetup(player: EntityPlayer): void {
  fprint(`HAPPY99: Mode init for player: ${getPlayerIndex(player)}`);
}

/** When the player swaps out from HAPPY99 mode. */
export function happy99ModeFin(player: EntityPlayer): void {}

/** Death fireworks effect */
export function happy99PostPlayerFatalDamage(
  player: EntityPlayer,
): boolean | undefined {
  spawnEffect(EffectVariant.FIREWORKS, 0, player.Position);
  spawnEffect(EffectVariant.FIREWORKS, 0, player.Position);
  return undefined;
}

/** Triggers all OnDamageActions for all players. */
export function happyTestDMG(
  entity: Entity,
  amount: float,
  damageFlags: BitFlags<DamageFlag>,
  source: EntityRef,
  countdownFrames: int,
): boolean | undefined {
  const player = entity.ToPlayer();
  if (player === undefined) {
    return;
  }

  player.AddCollectible(CollectibleType.TMTRAINER, 0, false);
  const collectible = spawn(
    EntityType.PICKUP,
    PickupVariant.COLLECTIBLE,
    CollectibleType.SAD_ONION,
    Vector(0, 0),
  );
  player.RemoveCollectible(CollectibleType.TMTRAINER);
  collectible.Remove();
  playerAddCollectible(player, collectible.SubType as CollectibleType);
  return undefined;
}
