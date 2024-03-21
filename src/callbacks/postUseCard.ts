import { ModCallback } from "isaac-typescript-definitions";
import type { CardType, UseFlag } from "isaac-typescript-definitions";
import type { ModUpgraded } from "isaacscript-common";
import { triggerOnCardUseActions } from "../classes/corruption/actions/OnCardUseAction";

export function postUseCardInit(mod: ModUpgraded): void {
  mod.AddCallback(ModCallback.POST_USE_CARD, main);
}

function main(
  cardType: CardType,
  player: EntityPlayer,
  _useFlags: BitFlags<UseFlag>,
) {
  triggerOnCardUseActions(cardType, player);
}
