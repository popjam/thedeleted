import type { CollectibleType } from "isaac-typescript-definitions";
import type { EIDColorShortcut } from "../../../enums/compatibility/EID/EIDColor";
import type { EIDColorTriplet } from "../../../enums/compatibility/EID/EIDColorTriplet";
import type { ActionSetType } from "../../../enums/corruption/actionSets/ActionSetType";
import { getActionSetThemeSetting } from "../../../features/settings/ActionSetThemeSetting";
import {
  getEIDMarkupFromShortcut,
  simplifyEIDColorTags,
} from "../../../helper/compatibility/EID/EIDHelper";
import { legibleString } from "../../../helper/stringHelper";
import {
  getEIDColorShortcutFromMorality,
  getEIDColorTupleFromTriplet,
} from "../../../maps/compatibility/EIDColorMap";
import type { Action } from "../actions/Action";
import { isAction } from "../actions/Action";
import type { Response } from "../responses/Response";
import { isResponse } from "../responses/Response";
import { NO_EFFECTS_DEFAULT_TEXT } from "../../../constants/actionSetConstants";
import { sortEffectsByMorality } from "../../../helper/deletedSpecific/effects/moralityHelper";
import { fprint } from "../../../helper/printHelper";

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
    return sortEffectsByMorality(this.effects);
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
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
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
    for (const actionOrResponse of this.effects) {
      collectibles.push(...actionOrResponse.getInvolvedCollectibles());
    }
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
  addEffects(...effects: ReadonlyArray<Action | Response>): this {
    this.effects = [...this.effects, ...effects];
    return this;
  }

  /** Get the text describing the ActionSet. */
  getText(eid: boolean): string {
    let text = "";
    const sortedEffects = this.getSortedEffects();
    for (const actionOrResponse of sortedEffects) {
      text += "#";
      let actionOrResponseText = "";
      if (eid) {
        // Set color of action / response.
        actionOrResponseText += getEIDMarkupFromShortcut(
          actionOrResponse.getTextColor() ??
            this.getActionOrResponseColor(actionOrResponse),
        );
      }
      actionOrResponseText += legibleString(
        actionOrResponse.getText(eid, false),
      );
      if (eid) {
        actionOrResponseText += "{{CR}}";
        fprint(actionOrResponseText);
        actionOrResponseText = simplifyEIDColorTags(actionOrResponseText);
        fprint(actionOrResponseText);
      }

      text += actionOrResponseText;
    }
    if (text === "") {
      return NO_EFFECTS_DEFAULT_TEXT;
    }
    return text;
  }

  abstract updateAppearance(entity: Entity): void;
}
