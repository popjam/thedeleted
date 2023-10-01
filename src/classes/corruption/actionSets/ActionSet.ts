import { CollectibleType } from "isaac-typescript-definitions";
import { EIDColorShortcut } from "../../../enums/compatibility/EIDColor";
import { EIDColorTriplet } from "../../../enums/compatibility/EIDColorTriplet";
import { Morality } from "../../../enums/corruption/Morality";
import { ActionSetType } from "../../../enums/corruption/actionSets/ActionSetType";
import { getActionSetThemeSetting } from "../../../features/settings/ActionSetThemeSetting";
import { getEIDMarkupFromShortcut } from "../../../helper/compatibility/EIDHelper";
import { legibleString } from "../../../helper/stringHelper";
import {
  getEIDColorShortcutFromMorality,
  getEIDColorTupleFromTriplet,
} from "../../../maps/compatibility/EIDColorMap";
import { Action, isAction } from "../actions/Action";
import { Response, isResponse } from "../responses/Response";

const NO_EFFECTS_DEFAULT_TEXT = "does nothing";

/** ActionSet class. */
export abstract class ActionSet {
  readonly actionSetType!: ActionSetType;
  effects: Array<Action | Response> = [];
  c: EIDColorShortcut | EIDColorTriplet | undefined;

  /** Returns Actions + Responses, does not deepCopy! */
  getEffects(): Array<Action | Response> {
    return this.effects;
  }

  /** Sort effects by Morality. */
  getSortedEffects(): Array<Action | Response> {
    return this.effects.sort((a, b) => {
      const aMorality = a.getMorality();
      const bMorality = b.getMorality();
      if (aMorality === bMorality) {
        return 0;
      }
      if (aMorality === Morality.POSITIVE) {
        return -1;
      }
      if (bMorality === Morality.POSITIVE || bMorality === Morality.NEUTRAL) {
        return 1;
      }
      return -1;
    });
  }

  /**
   * The color/s the ActionSet will adhere to. If no color is specified, will resort to default
   * Morality colors. If an Action or Response has its own color, that will override the color this
   * ActionSet provides it.
   *
   * If a triplet is specified, the first color will be used for positive effects, the second for
   * neutral effects, and the third for negative effects.
   */
  getTheme(): EIDColorShortcut | EIDColorTriplet | undefined {
    return this.c;
  }

  /**
   * Get the EIDColorShortcut for a specific Action or Response in the ActionSet.
   *
   * - If the Action/Response has an overridden color, that will be used.
   * - If the ActionSet has a color set, that will be used.
   * - If the ActionSet has no color set, the default morality color will be used.
   */
  getActionOrResponseColor(
    actionOrResponse: Action | Response,
  ): EIDColorShortcut {
    const overriddenTextColor = actionOrResponse.getTextColor();
    if (overriddenTextColor !== undefined) {
      return overriddenTextColor;
    }
    const morality = actionOrResponse.getMorality();
    if (this.c === undefined || !getActionSetThemeSetting()) {
      return getEIDColorShortcutFromMorality(morality);
    }
    if (typeof this.c === "string") {
      return this.c;
    }
    return getEIDColorTupleFromTriplet(this.c)[morality as number]!;
  }

  /**
   * The color/s the ActionSet will adhere to. If no color is specified, will resort to default
   * Morality colors. If an Action or Response has its own color, that will override the color this
   * ActionSet provides it.
   */
  setTheme(c: EIDColorShortcut | EIDColorTriplet | undefined): this {
    this.c = c;
    return this;
  }

  /** Get collectibles mentioned in any actions or responses. */
  getInvolvedCollectibles(): CollectibleType[] {
    const collectibles: CollectibleType[] = [];
    this.effects.forEach((actionOrResponse) => {
      collectibles.push(...actionOrResponse.getInvolvedCollectibles());
    });
    return collectibles;
  }

  /** Gets only the Responses (does not deepCopy!). */
  getResponses(): Response[] {
    return this.effects.filter(
      (actionOrResponse): actionOrResponse is Response =>
        isResponse(actionOrResponse),
    );
  }

  /** Gets only the Actions (does not deepCopy!). */
  getActions(): Action[] {
    return this.effects.filter((actionOrResponse): actionOrResponse is Action =>
      isAction(actionOrResponse),
    );
  }

  /**
   * Adds one or more actions or responses to the ActionSet. Can provide one action or response,
   * multiple actions or responses or an array of actions or responses. Probably need to update the
   * pickup after calling this function. Does not deepCopy!
   */
  addEffects(...effects: Array<Action | Response>): this {
    this.effects = this.effects.concat(effects);
    return this;
  }

  /** Get the text describing the ActionSet. */
  getText(eid = true): string {
    let text = "";
    const sortedEffects = this.getSortedEffects();
    sortedEffects.forEach((actionOrResponse) => {
      text += "#";
      if (eid) {
        text += getEIDMarkupFromShortcut(
          actionOrResponse.getTextColor() ??
            this.getActionOrResponseColor(actionOrResponse),
        );
      }
      text += legibleString(actionOrResponse.getText());
      if (eid) {
        text += "{{CR}}";
      }
    });
    if (text === "") {
      return NO_EFFECTS_DEFAULT_TEXT;
    }
    return text;
  }

  abstract updateAppearance(entity: Entity): void;
}
