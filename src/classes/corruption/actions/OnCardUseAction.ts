import { CardType } from "isaac-typescript-definitions";
import { ActionType } from "../../../enums/corruption/actions/ActionType";
import { triggerPlayerActionsByType } from "../../../features/corruption/effects/playerEffects";
import { Action } from "./Action";
import type { TriggerData } from "../../../interfaces/corruption/actions/TriggerData";
import { rollPercentage } from "../../../types/general/Percentage";
import {
  ON_CARD_USE_ACTION_FREQUENCY,
  ON_FLOOR_ACTION_FREQUENCY,
} from "../../../constants/severityConstants";
import { getCardNameWithEIDSetting } from "../../../helper/compatibility/EID/EIDHelper";

const ACTION_TYPE = ActionType.ON_CARD_USE;
const CHANCE_FOR_CARD_TYPE_PARAM = 10;

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

  override getIdealSeverity(): number {
    const cardType = this.getCard();
    if (cardType === undefined) {
      return super.getIdealSeverity(ON_CARD_USE_ACTION_FREQUENCY);
    }

    // Specific card.
    return super.getIdealSeverity(ON_FLOOR_ACTION_FREQUENCY);
  }

  override shuffle(): this {
    if (rollPercentage(CHANCE_FOR_CARD_TYPE_PARAM)) {
      this.setCard(CardType.FOOL);
    }

    return super.shuffle();
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

  getCardText(eid: boolean, plural: boolean): string | undefined {
    const card = this.getCard();
    if (card === undefined) {
      return undefined;
    }

    return getCardNameWithEIDSetting(card, plural, eid);
  }

  protected override getTriggerClause(plural: boolean, eid = true): string {
    const card = this.getCardText(eid, plural);

    return plural
      ? `uses of ${card ?? "a card"}`
      : `use of ${card ?? "a card"}`;
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
