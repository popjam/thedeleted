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
} from "isaacscript-common";
import { Action } from "../../../classes/corruption/actions/Action";
import { OnDamageAction } from "../../../classes/corruption/actions/OnDamageAction";
import { OnFloorAction } from "../../../classes/corruption/actions/OnFloorAction";
import { OnKillAction } from "../../../classes/corruption/actions/OnKillAction";
import { OnObtainAction } from "../../../classes/corruption/actions/OnObtainAction";
import { OnRoomAction } from "../../../classes/corruption/actions/OnRoomAction";
import { InvertedActiveActionSet } from "../../../classes/corruption/actionSets/Inverted/InvertedActiveActionSet";
import { InvertedItemActionSet } from "../../../classes/corruption/actionSets/Inverted/InvertedItemActionSet";
import { InvertedPassiveActionSet } from "../../../classes/corruption/actionSets/Inverted/InvertedPassiveActionSet";
import { Response } from "../../../classes/corruption/responses/Response";
import { SpawnNPCResponse } from "../../../classes/corruption/responses/SpawnNPCResponse";
import { TriggerInSequenceResponse } from "../../../classes/corruption/responses/TriggerInSequence";
import { TriggerOverTimeResponse } from "../../../classes/corruption/responses/TriggerOverTimeResponse";
import { TriggerRandomResponse } from "../../../classes/corruption/responses/TriggerRandomResponse";
import { UseActiveItemResponse } from "../../../classes/corruption/responses/UseActiveItemResponse";
import { WaitThenTriggerResponse } from "../../../classes/corruption/responses/WaitThenTriggerResponse";
import { INVERTED_COLLECTIBLE_CUSTOM_SPRITE_SEGMENT_AMOUNT_SPREAD } from "../../../constants/corruptionConstants";
import { Morality } from "../../../enums/corruption/Morality";
import { DeletedColor } from "../../../enums/general/DeletedColor";
import { NPCID } from "../../../enums/general/NPCID";
import { ActionSetBuilderInput } from "../../../interfaces/corruption/actionSets/ActionSetBuilderInput";
import { CorruptedCollectibleSprite } from "../../../interfaces/corruption/funny/CorruptedCollectibleSprite";
import { getRandomCollectibleType } from "../../collectibleHelper";
import { getObjectValues } from "../../objectHelper";

export function happy99DefaultBuilder(
  inputs?: ActionSetBuilderInput,
): InvertedItemActionSet {
  const active = getRandomInt(0, 1) === 0;
  if (active) {
    return genericActiveBuilder(inputs);
  }
  return genericPassiveBuilder(inputs);
}

function genericActiveBuilder(
  inputs?: ActionSetBuilderInput,
): InvertedActiveActionSet {
  const amountOfEffects = getRandomInt(1, 3);
  const effectArray: Action[] = [];
  const randomActions: Action = getRandomFromWeightedArray([
    [new OnDamageAction(), 1],
    [new OnFloorAction(), 1],
    [new OnObtainAction(), 1],
    [new OnRoomAction(), 1],
    [new OnKillAction(), 1],
  ]);
  for (let i = 0; i < amountOfEffects; i++) {
    const responses = [
      () =>
        new UseActiveItemResponse().construct(
          getRandomCollectibleType({ itemType: ItemType.ACTIVE }) ??
            CollectibleType.POOP,
        ),
      () =>
        new UseActiveItemResponse()
          .construct(
            getRandomCollectibleType({ itemType: ItemType.ACTIVE }) ??
              CollectibleType.POOP,
          )
          .setChanceToActivate(getRandomInt(1, 100))
          .setAmountOfActivations(getRandomInt(1, 3)),
      () =>
        new SpawnNPCResponse().construct(
          getRandomArrayElement(getObjectValues(NPCID)),
        ),
      () =>
        new SpawnNPCResponse()
          .construct(getRandomArrayElement(getObjectValues(NPCID)))
          .setChanceToActivate(getRandomInt(1, 100))
          .setAmountOfActivations(getRandomInt(1, 3)),
    ];
    const randomAction: () => Action = getRandomFromWeightedArray<() => Action>(
      [
        [() => new OnDamageAction(), 1],
        [() => new OnFloorAction(), 1],
        [() => new OnObtainAction(), 1],
        [() => new OnRoomAction(), 1],
      ],
    );
    const randomResponse: Response = getRandomFromWeightedArray<Response>([
      [getRandomArrayElement(responses)(), 1],
      [
        new WaitThenTriggerResponse().construct(
          getRandomArrayElement(responses)(),
        ),
        1,
      ],
      [
        new TriggerInSequenceResponse().construct(
          getRandomArrayElement(responses)(),
          getRandomArrayElement(responses)(),
        ),
        1,
      ],
      [
        new TriggerRandomResponse().construct(
          getRandomArrayElement(responses)(),
          getRandomArrayElement(responses)(),
        ),
        1,
      ],
      [
        new TriggerOverTimeResponse().construct(
          getRandomArrayElement(responses)(),
          getRandomInt(1, 4),
          getRandomInt(1, 3),
        ),
        1,
      ],
    ]);
    effectArray.push(randomAction().setResponse(randomResponse));
  }
  const invertedActiveActionSet = new InvertedActiveActionSet()
    .addEffects(...effectArray)
    .setName("active item, happy99")
    .setQuality(3)
    .setChargeType(ItemConfigChargeType.NORMAL)
    .setCharges(getRandomInt(1, 6));
  invertedActiveActionSet.setIcon(
    generateHAPPY99CorruptedCollectibleSprite(invertedActiveActionSet, inputs),
  );
  return invertedActiveActionSet;
}

function genericPassiveBuilder(
  inputs?: ActionSetBuilderInput,
): InvertedPassiveActionSet {
  const amountOfEffects = getRandomInt(1, 3);
  const effectArray: Action[] = [];
  const randomActions: Action = getRandomFromWeightedArray([
    [new OnDamageAction(), 1],
    [new OnFloorAction(), 1],
    [new OnObtainAction(), 1],
    [new OnRoomAction(), 1],
    [new OnKillAction(), 1],
  ]);
  for (let i = 0; i < amountOfEffects; i++) {
    const responses = [
      () =>
        new UseActiveItemResponse().construct(
          getRandomCollectibleType({ itemType: ItemType.ACTIVE }) ??
            CollectibleType.POOP,
        ),
      () =>
        new UseActiveItemResponse()
          .construct(
            getRandomCollectibleType({ itemType: ItemType.ACTIVE }) ??
              CollectibleType.POOP,
          )
          .setChanceToActivate(getRandomInt(1, 100))
          .setAmountOfActivations(getRandomInt(1, 3)),
      () =>
        new SpawnNPCResponse().construct(
          getRandomArrayElement(getObjectValues(NPCID)),
        ),
      () =>
        new SpawnNPCResponse()
          .construct(getRandomArrayElement(getObjectValues(NPCID)))
          .setChanceToActivate(getRandomInt(1, 100))
          .setAmountOfActivations(getRandomInt(1, 3)),
    ];
    const randomAction: () => Action = getRandomFromWeightedArray<() => Action>(
      [
        [() => new OnDamageAction(), 1],
        [() => new OnFloorAction(), 1],
        [() => new OnObtainAction(), 1],
        [() => new OnRoomAction(), 1],
      ],
    );
    const randomResponse: Response = getRandomFromWeightedArray<Response>([
      [getRandomArrayElement(responses)(), 1],
      [
        new WaitThenTriggerResponse().construct(
          getRandomArrayElement(responses)(),
        ),
        1,
      ],
      [
        new TriggerInSequenceResponse().construct(
          getRandomArrayElement(responses)(),
          getRandomArrayElement(responses)(),
        ),
        1,
      ],
      [
        new TriggerRandomResponse().construct(
          getRandomArrayElement(responses)(),
          getRandomArrayElement(responses)(),
        ),
        1,
      ],
      [
        new TriggerOverTimeResponse().construct(
          getRandomArrayElement(responses)(),
          getRandomInt(1, 4),
          getRandomInt(1, 3),
        ),
        1,
      ],
    ]);
    effectArray.push(
      randomAction().setResponse(randomResponse.setMorality(Morality.POSITIVE)),
    );
  }
  const invertedPassiveActionSet = new InvertedPassiveActionSet()
    .addEffects(...effectArray)
    .setName("passive item, happy99")
    .setQuality(3);
  invertedPassiveActionSet.setIcon(
    generateHAPPY99CorruptedCollectibleSprite(invertedPassiveActionSet, inputs),
  );
  return invertedPassiveActionSet;
}

/**
 * Generates a CustomCollectibleSprite from the provided ActionSet in the style of 'HAPPY99'. If
 * 'Advanced Icons' setting is turned off, will instead simply make the sprite HAPPY99_YELLOW and
 * flip it.
 */
export function generateHAPPY99CorruptedCollectibleSprite(
  actionSet: InvertedPassiveActionSet,
  inputs?: ActionSetBuilderInput,
): CorruptedCollectibleSprite {
  // const advancedIcons = getAdvancedInvertedItemIconSetting(); if (!advancedIcons) { return
  // DeletedColor.HAPPY_YELLOW; }
  const amountOfSegments = getRandomFromWeightedArray(
    INVERTED_COLLECTIBLE_CUSTOM_SPRITE_SEGMENT_AMOUNT_SPREAD,
  );
  const involvedCollectibles = actionSet.getInvolvedCollectibles();
  if (inputs?.collectible !== undefined) {
    involvedCollectibles.push(inputs.collectible);
  }
  if (involvedCollectibles.length < amountOfSegments) {
    for (let i = 0; i < amountOfSegments - involvedCollectibles.length; i++) {
      involvedCollectibles.push(
        getRandomCollectibleType({}) ?? CollectibleType.POOP,
      );
    }
  } else if (involvedCollectibles.length > amountOfSegments) {
    involvedCollectibles.splice(
      getRandomInt(0, involvedCollectibles.length - 1),
      involvedCollectibles.length - amountOfSegments,
    );
  }

  return {
    collectibles: involvedCollectibles,
    color: DeletedColor.HAPPY_YELLOW,
    seed: getRandomSeed(),
  };
}
