import type { CardType } from "isaac-typescript-definitions";
import { ActionType } from "../../../enums/corruption/actions/ActionType";
import { triggerPlayerActionsByType } from "../../../features/corruption/effects/playerEffects";
import { Action } from "./Action";
import type { TriggerData } from "../../../interfaces/corruption/actions/TriggerData";

const ACTION_TYPE = ActionType.ON_CARD_USE;

/** Triggers every time the player uses a card. */
/** Represents an action that triggers when a card is used. */
export class OnCardUseAction extends Action {
  override actionType = ACTION_TYPE;
  c?: CardType;

  /**
   * Constructs a new OnCardUseAction.
   *
   * @param card The card to associate with the action. If undefined, the action will trigger for
   *             any card.
   */
  construct(card?: CardType): this {
    this.setCard(card);
    return this;
  }

  /**
   * Gets the card associated with the action.
   *
   * @returns The card associated with the action, or undefined if the action triggers for any card.
   */
  getCard(): CardType | undefined {
    return this.c;
  }

  /**
   * Sets the card associated with the action.
   *
   * @param card The card to associate with the action. If undefined, the action will trigger for
   *             any card.
   * @returns The updated OnCardUseAction instance.
   */
  setCard(card?: CardType): this {
    this.c = card;
    return this;
  }

  protected override getTriggerClause(): string {
    const card = this.getCard();
    return card === undefined ? "you use a card" : `you use ${card}`;
  }

  override trigger(triggerData: TriggerData): void {
    if (this.c !== undefined && triggerData.onCardUseAction?.card !== this.c) {
      return;
    }

    super.trigger(triggerData);
  }
}

/**
 * Triggers all OnCardUseActions for all players.
 *
 * POST_USE_CARD callback.
 */
export function triggerOnCardUseActions(
  card: CardType,
  player: EntityPlayer,
): void {
  triggerPlayerActionsByType(player, ACTION_TYPE, {
    player,
    onCardUseAction: {
      player,
      card,
    },
  });
}
