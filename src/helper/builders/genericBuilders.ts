import {
  CollectibleType,
  ItemConfigChargeType,
  ItemType,
} from "isaac-typescript-definitions";
import {
  getRandomArrayElement,
  getRandomFromWeightedArray,
  getRandomInt,
  getRandomSeed,
  shuffleArrayInPlace,
} from "isaacscript-common";
import { InvertedActiveActionSet } from "../../classes/corruption/actionSets/Inverted/InvertedActiveActionSet";
import type { InvertedItemActionSet } from "../../classes/corruption/actionSets/Inverted/InvertedItemActionSet";
import { InvertedPassiveActionSet } from "../../classes/corruption/actionSets/Inverted/InvertedPassiveActionSet";
import type { Action } from "../../classes/corruption/actions/Action";
import { OnDamageAction } from "../../classes/corruption/actions/OnDamageAction";
import { OnFloorAction } from "../../classes/corruption/actions/OnFloorAction";
import { OnKillAction } from "../../classes/corruption/actions/OnKillAction";
import { OnObtainAction } from "../../classes/corruption/actions/OnObtainAction";
import { OnRoomAction } from "../../classes/corruption/actions/OnRoomAction";
import type { Response } from "../../classes/corruption/responses/Response";
import { SpawnNPCResponse } from "../../classes/corruption/responses/SpawnNPCResponse";
import { TriggerInSequenceResponse } from "../../classes/corruption/responses/TriggerInSequence";
import { TriggerOverTimeResponse } from "../../classes/corruption/responses/TriggerOverTimeResponse";
import { TriggerRandomResponse } from "../../classes/corruption/responses/TriggerRandomResponse";
import { UseActiveItemResponse } from "../../classes/corruption/responses/UseActiveItemResponse";
import { WaitThenTriggerResponse } from "../../classes/corruption/responses/WaitThenTriggerResponse";
import { INVERTED_COLLECTIBLE_CUSTOM_SPRITE_SEGMENT_AMOUNT_SPREAD } from "../../constants/corruptionConstants";
import { Morality } from "../../enums/corruption/Morality";
import { DeletedColor } from "../../enums/general/DeletedColor";
import { NPCID } from "../../enums/general/ID/NPCID";
import { getAdvancedInvertedItemIconSetting } from "../../features/settings/GeneralSettings";
import type { ActionSetBuilderInput } from "../../interfaces/corruption/actionSets/ActionSetBuilderInput";
import type { CorruptedCollectibleSprite } from "../../interfaces/corruption/funny/CorruptedCollectibleSprite";
import { rollPercentage } from "../../types/general/Percentage";
import { getRandomCollectibleType } from "../collectibleHelper";
import { getObjectValues } from "../objectHelper";
import { fprint } from "../printHelper";
import { getRandomInteger } from "../randomHelper";

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

export function defaultInvertedItemActionSetBuilder(
  inputs?: ActionSetBuilderInput,
): InvertedItemActionSet {
  const active = inputs?.forceActiveOrPassive ?? getRandomInteger(0, 1) === 0;

  /** Generate the ActionSet using default properties. */
  const actionSet = active
    ? defaultInvertedActiveActionSetBuilder(inputs)
    : defaultInvertedPassiveActionSetBuilder(inputs);

  /** Set the name and description. */
  actionSet
    .setName(`GENERIC ${active ? "ACTIVE" : "PASSIVE"}`)
    .setDescription("GENERIC DESCRIPTION");

  return actionSet;
}

/**
 * Generates a default actionSet for an inverted active item. Will not add name, description and
 * icon properties, these can be added afterwards or left blank to be auto-generated.
 */
export function defaultInvertedActiveActionSetBuilder(
  inputs?: ActionSetBuilderInput,
): InvertedActiveActionSet {
  fprint(`defaultInvertedActiveActionSetBuilder. inputs: (${inputs})`);

  const amountOfEffects = getRandomInteger(1, 3);
  const effectArray: Array<Action | Response> = [];
  for (let i = 0; i < amountOfEffects; i++) {
    const responses = [
      () =>
        new UseActiveItemResponse()
          .construct(
            getRandomCollectibleType({ itemType: ItemType.ACTIVE }) ??
              CollectibleType.POOP,
          )
          .setMorality(Morality.POSITIVE),
      () =>
        new UseActiveItemResponse()
          .construct(
            getRandomCollectibleType({ itemType: ItemType.ACTIVE }) ??
              CollectibleType.POOP,
          )
          .setChanceToActivate(getRandomInteger(1, 100))
          .setAmountOfActivations(getRandomInteger(1, 3))
          .setMorality(Morality.POSITIVE),
      () =>
        new SpawnNPCResponse()
          .construct(getRandomArrayElement(getObjectValues(NPCID), undefined))
          .setMorality(Morality.NEGATIVE),
      () =>
        new SpawnNPCResponse()
          .construct(getRandomArrayElement(getObjectValues(NPCID), undefined))
          .setChanceToActivate(getRandomInteger(1, 100))
          .setAmountOfActivations(getRandomInteger(1, 3))
          .setMorality(Morality.NEGATIVE),
    ];
    const randomAction: () => Action = getRandomFromWeightedArray<() => Action>(
      [
        [() => new OnDamageAction(), 1],
        [() => new OnFloorAction(), 1],
        [() => new OnObtainAction(), 1],
        [() => new OnRoomAction(), 1],
      ],
      undefined,
    );
    const randomResponse: Response = getRandomFromWeightedArray<Response>(
      [
        [getRandomArrayElement(responses, undefined)(), 1],
        [
          new WaitThenTriggerResponse().construct(
            getRandomArrayElement(responses, undefined)(),
          ),
          1,
        ],
        [
          new TriggerInSequenceResponse().construct(
            getRandomArrayElement(responses, undefined)(),
            getRandomArrayElement(responses, undefined)(),
          ),
          1,
        ],
        [
          new TriggerRandomResponse().construct(
            getRandomArrayElement(responses, undefined)(),
            getRandomArrayElement(responses, undefined)(),
          ),
          1,
        ],
        [
          new TriggerOverTimeResponse().construct(
            getRandomArrayElement(responses, undefined)(),
            getRandomInteger(1, 4),
            getRandomInteger(1, 3),
          ),
          1,
        ],
      ],
      undefined,
    );

    /** % Chance of Action/Response. */
    if (rollPercentage(10)) {
      effectArray.push(randomAction().setResponse(randomResponse));
    } else {
      effectArray.push(randomResponse);
    }
  }
  const invertedActiveActionSet = new InvertedActiveActionSet()
    .addEffects(...effectArray)
    .setQuality(3)
    .setChargeType(ItemConfigChargeType.NORMAL)
    .setCharges(getRandomInteger(1, 6));
  return invertedActiveActionSet;
}

/**
 * Generates a default actionSet for an inverted passive item. Will not add name, description and
 * icon properties, these can be added afterwards or left black to be auto-generated.
 */
export function defaultInvertedPassiveActionSetBuilder(
  inputs?: ActionSetBuilderInput,
): InvertedPassiveActionSet {
  fprint(`defaultInvertedPassiveActionSetBuilder. inputs: (${inputs})`);

  const amountOfEffects = getRandomInteger(1, 3);
  const effectArray: Action[] = [];
  const randomActions: Action = getRandomFromWeightedArray(
    [
      [new OnDamageAction(), 1],
      [new OnFloorAction(), 1],
      [new OnObtainAction(), 1],
      [new OnRoomAction(), 1],
      [new OnKillAction(), 1],
    ],
    undefined,
  );
  for (let i = 0; i < amountOfEffects; i++) {
    const responses = [
      () =>
        new UseActiveItemResponse()
          .construct(
            getRandomCollectibleType({ itemType: ItemType.ACTIVE }) ??
              CollectibleType.POOP,
          )
          .setMorality(Morality.POSITIVE),
      () =>
        new UseActiveItemResponse()
          .construct(
            getRandomCollectibleType({ itemType: ItemType.ACTIVE }) ??
              CollectibleType.POOP,
          )
          .setChanceToActivate(getRandomInteger(1, 100))
          .setAmountOfActivations(getRandomInteger(1, 3))
          .setMorality(Morality.POSITIVE),
      () =>
        new SpawnNPCResponse()
          .construct(getRandomArrayElement(getObjectValues(NPCID), undefined))
          .setMorality(Morality.NEGATIVE),
      () =>
        new SpawnNPCResponse()
          .construct(getRandomArrayElement(getObjectValues(NPCID), undefined))
          .setChanceToActivate(getRandomInteger(1, 100))
          .setAmountOfActivations(getRandomInteger(1, 3))
          .setMorality(Morality.NEGATIVE),
    ];
    const randomAction: () => Action = getRandomFromWeightedArray<() => Action>(
      [
        [() => new OnDamageAction(), 1],
        [() => new OnFloorAction(), 1],
        [() => new OnObtainAction(), 1],
        [() => new OnRoomAction(), 1],
      ],
      undefined,
    );
    const randomResponse: Response = getRandomFromWeightedArray<Response>(
      [
        [getRandomArrayElement(responses, undefined)(), 1],
        [
          new WaitThenTriggerResponse().construct(
            getRandomArrayElement(responses, undefined)(),
          ),
          1,
        ],
        [
          new TriggerInSequenceResponse().construct(
            getRandomArrayElement(responses, undefined)(),
            getRandomArrayElement(responses, undefined)(),
          ),
          1,
        ],
        [
          new TriggerRandomResponse().construct(
            getRandomArrayElement(responses, undefined)(),
            getRandomArrayElement(responses, undefined)(),
          ),
          1,
        ],
        [
          new TriggerOverTimeResponse().construct(
            getRandomArrayElement(responses, undefined)(),
            getRandomInteger(1, 4),
            getRandomInteger(1, 3),
          ),
          1,
        ],
      ],
      undefined,
    );
    effectArray.push(
      randomAction().setResponse(randomResponse.setMorality(Morality.POSITIVE)),
    );
  }
  const invertedPassiveActionSet = new InvertedPassiveActionSet()
    .addEffects(...effectArray)
    .setQuality(3);
  return invertedPassiveActionSet;
}
