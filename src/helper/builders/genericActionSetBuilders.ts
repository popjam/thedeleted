import { CollectibleType } from "isaac-typescript-definitions";
import {
  getRandomFromWeightedArray,
  getRandomSeed,
  shuffleArrayInPlace,
} from "isaacscript-common";
import { InvertedActiveActionSet } from "../../classes/corruption/actionSets/Inverted/InvertedActiveActionSet";
import type { InvertedItemActionSet } from "../../classes/corruption/actionSets/Inverted/InvertedItemActionSet";
import { InvertedPassiveActionSet } from "../../classes/corruption/actionSets/Inverted/InvertedPassiveActionSet";
import {
  DEFAULT_ACTION_WEIGHTS,
  DEFAULT_INVERTED_ACTIVE_GENERATION_PERCENTAGE,
  DEFAULT_INVERTED_ITEM_AMOUNT_OF_EFFECTS_WEIGHTS,
  DEFAULT_RESPONSE_WEIGHTS,
  INVERTED_COLLECTIBLE_CUSTOM_SPRITE_SEGMENT_AMOUNT_SPREAD,
} from "../../constants/corruptionConstants";
import type { ActionSetBuilderInput } from "../../interfaces/corruption/actionSets/ActionSetBuilderInput";
import type { CorruptedCollectibleSprite } from "../../interfaces/corruption/funny/CorruptedCollectibleSprite";
import { rollPercentage } from "../../types/general/Percentage";
import { getRandomCollectibleType } from "../collectibleHelper";
import { fprint } from "../printHelper";
import { getRandomInteger } from "../randomHelper";
import { generateActionFromActionType } from "../../maps/corruption/actions/actionTypeToActionInitMap";
import { generateResponseFromResponseType } from "../../maps/corruption/responses/responseTypeToResponseInitMap";

/**
 * Generates a CustomCollectibleSprite from the provided ActionSet. If 'Advanced Icons' setting is
 * turned off, will instead simply make the sprite a color and flip it. Color defaulted to random,
 * but can be set to a specific color afterwards.
 */
export function generateDefaultCorruptedCollectibleSprite(
  actionSet: InvertedPassiveActionSet,
  inputs?: ActionSetBuilderInput,
): CorruptedCollectibleSprite {
  const amountOfSegments = getRandomFromWeightedArray(
    INVERTED_COLLECTIBLE_CUSTOM_SPRITE_SEGMENT_AMOUNT_SPREAD,
    undefined,
  );
  const involvedCollectibles = actionSet.getInvolvedCollectibles();
  if (inputs?.collectible !== undefined) {
    involvedCollectibles.push(inputs.collectible);
  }
  if (involvedCollectibles.length < amountOfSegments) {
    for (let i = 0; i < amountOfSegments - involvedCollectibles.length; i++) {
      involvedCollectibles.push(
        getRandomCollectibleType() ?? CollectibleType.POOP,
      );
    }
  } else if (involvedCollectibles.length > amountOfSegments) {
    involvedCollectibles.splice(
      getRandomInteger(0, involvedCollectibles.length - 1),
      involvedCollectibles.length - amountOfSegments,
    );
  }
  shuffleArrayInPlace(involvedCollectibles, undefined);
  return {
    collectibles: involvedCollectibles,
    color: "random",
    seed: getRandomSeed(),
    horizontal: getRandomInteger(0, 1) === 0,
  };
}

export function generateDefaultInvertedItemActionSet(
  inputs: ActionSetBuilderInput = {},
): InvertedItemActionSet {
  const active = rollPercentage(
    inputs.chanceOfActive ?? DEFAULT_INVERTED_ACTIVE_GENERATION_PERCENTAGE,
  );

  /** Generate the ActionSet using default properties. */
  const actionSet = active
    ? generateDefaultInvertedActiveActionSet(inputs)
    : generateDefaultInvertedPassiveActionSet(inputs);

  /** Set the name and description. */
  actionSet
    .setName(`GENERIC ${active ? "ACTIVE" : "PASSIVE"}`)
    .setDescription("GENERIC DESCRIPTION");

  return actionSet;
}

/**
 * Generates a default actionSet for an inverted active item. Will not add name, description and
 * icon properties, these can be added afterwards or left blank to be auto-generated.
 *
 * 1. Will determine the amount of effects the item will have.
 * 2. For each effect, will determine if it is positive or negative.
 * 3. For each effect, will determine the action (based on weightings).
 * 4. Once the action is determined, will determine the response based on either the negative or
 *    positive response weightings.
 * 5. Will modify the severity of the response based on the action's ideal severity.
 */
export function generateDefaultInvertedActiveActionSet(
  inputs: ActionSetBuilderInput = {},
): InvertedActiveActionSet {
  const amountOfEffects =
    inputs.numberOfEffects ??
    getRandomFromWeightedArray(
      DEFAULT_INVERTED_ITEM_AMOUNT_OF_EFFECTS_WEIGHTS,
      undefined,
    );

  for (let i = 0; i < amountOfEffects; i++) {
    const actionWeightings = inputs.actionWeightings ?? DEFAULT_ACTION_WEIGHTS;

    const action = generateActionFromActionType(
      getRandomFromWeightedArray(actionWeightings, undefined),
    );
    action.shuffle();

    const response = generateResponseFromResponseType(
      getRandomFromWeightedArray(DEFAULT_RESPONSE_WEIGHTS, undefined),
    );
    response.shuffle();

    const idealSeverity = action.getIdealSeverity();
    const severity = response.getSeverity();

    // Work out how much we need to adjust the responses' severity by. This should be the absolute
    // value.
    const severityDifference = idealSeverity - Math.abs(severity);
  }

  return new InvertedActiveActionSet();
}

/**
 * Generates a default actionSet for an inverted passive item. Will not add name, description and
 * icon properties, these can be added afterwards or left black to be auto-generated.
 */
export function generateDefaultInvertedPassiveActionSet(
  inputs: ActionSetBuilderInput = {},
): InvertedPassiveActionSet {
  fprint(`defaultInvertedPassiveActionSetBuilder. inputs: (${inputs})`);

  /** Generation variables. */
  const amountOfEffects =
    inputs.numberOfEffects ??
    getRandomFromWeightedArray(
      DEFAULT_INVERTED_ITEM_AMOUNT_OF_EFFECTS_WEIGHTS,
      undefined,
    );

  /** Get Action/Response pair. */
  const action = generateActionFromActionType(
    getRandomFromWeightedArray(DEFAULT_ACTION_WEIGHTS, undefined),
  );
  const response = generateResponseFromResponseType(
    getRandomFromWeightedArray(DEFAULT_RESPONSE_WEIGHTS, undefined),
  );

  const idealSeverity = action.getIdealSeverity();
  const severity = response.getSeverity();

  // Work out how much we need to adjust the responses' severity by. This should be the absolute
  // value.
  const severityDifference = idealSeverity - Math.abs(severity);

  return new InvertedPassiveActionSet();
}
