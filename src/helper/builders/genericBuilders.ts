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
import { InvertedActiveActionSet } from "../../classes/corruption/actionSets/Inverted/InvertedActiveActionSet";
import { InvertedItemActionSet } from "../../classes/corruption/actionSets/Inverted/InvertedItemActionSet";
import { InvertedPassiveActionSet } from "../../classes/corruption/actionSets/Inverted/InvertedPassiveActionSet";
import { Action } from "../../classes/corruption/actions/Action";
import { OnDamageAction } from "../../classes/corruption/actions/OnDamageAction";
import { OnFloorAction } from "../../classes/corruption/actions/OnFloorAction";
import { OnKillAction } from "../../classes/corruption/actions/OnKillAction";
import { OnObtainAction } from "../../classes/corruption/actions/OnObtainAction";
import { OnRoomAction } from "../../classes/corruption/actions/OnRoomAction";
import { Response } from "../../classes/corruption/responses/Response";
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
import { ActionSetBuilderInput } from "../../interfaces/corruption/actionSets/ActionSetBuilderInput";
import { CorruptedCollectibleSprite } from "../../interfaces/corruption/funny/CorruptedCollectibleSprite";
import { rollPercentage } from "../../types/general/Percentage";
import { getRandomCollectibleType } from "../collectibleHelper";
import { getPlayerMainColor } from "../deletedSpecific/deletedHelper";
import { getObjectValues } from "../objectHelper";

/**
 * Generates a CustomCollectibleSprite from the provided ActionSet. If 'Advanced Icons' setting is
 * turned off, will instead simply make the sprite a color and flip it. Color defaulted to random,
 * but can be set to a specific color afterwards.
 */
export function generateDefaultCorruptedCollectibleSprite(
  actionSet: InvertedPassiveActionSet,
  inputs?: ActionSetBuilderInput,
): CorruptedCollectibleSprite | Color {
  const advancedIcons = getAdvancedInvertedItemIconSetting();
  if (!advancedIcons) {
    const player = inputs?.player;
    if (player !== undefined) {
      const mainColor = getPlayerMainColor(player);
      if (mainColor !== undefined) {
        return mainColor;
      }
    }
    return DeletedColor.HAPPY_YELLOW;
  }
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
    color: true,
    seed: getRandomSeed(),
  };
}

export function defaultInvertedItemActionSetBuilder(
  inputs?: ActionSetBuilderInput,
): InvertedItemActionSet {
  const active = inputs?.forceActiveOrPassive ?? getRandomInt(0, 1) === 0;
  let actionSet: InvertedItemActionSet | undefined;

  /** Generate the ActionSet using default properties. */
  if (active) {
    actionSet = defaultInvertedActiveActionSetBuilder(inputs);
  } else {
    actionSet = defaultInvertedPassiveActionSetBuilder(inputs);
  }

  /** Set the name and description. */
  actionSet
    .setName(`GENERIC ${active ? "ACTIVE" : "PASSIVE"}`)
    .setDescription("GENERIC DESCRIPTION");

  return actionSet;
}

/**
 * Generates a default actionSet for an inverted active item. Will not add name, description and
 * icon properties, these can be added afterwards or left black to be auto-generated.
 */
export function defaultInvertedActiveActionSetBuilder(
  inputs?: ActionSetBuilderInput,
): InvertedActiveActionSet {
  const amountOfEffects = getRandomInt(1, 3);
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
          .setChanceToActivate(getRandomInt(1, 100))
          .setAmountOfActivations(getRandomInt(1, 3))
          .setMorality(Morality.POSITIVE),
      () =>
        new SpawnNPCResponse()
          .construct(getRandomArrayElement(getObjectValues(NPCID)))
          .setMorality(Morality.NEGATIVE),
      () =>
        new SpawnNPCResponse()
          .construct(getRandomArrayElement(getObjectValues(NPCID)))
          .setChanceToActivate(getRandomInt(1, 100))
          .setAmountOfActivations(getRandomInt(1, 3))
          .setMorality(Morality.NEGATIVE),
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
    .setCharges(getRandomInt(1, 6));
  return invertedActiveActionSet;
}

/**
 * Generates a default actionSet for an inverted passive item. Will not add name, description and
 * icon properties, these can be added afterwards or left black to be auto-generated.
 */
export function defaultInvertedPassiveActionSetBuilder(
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
          .setChanceToActivate(getRandomInt(1, 100))
          .setAmountOfActivations(getRandomInt(1, 3))
          .setMorality(Morality.POSITIVE),
      () =>
        new SpawnNPCResponse()
          .construct(getRandomArrayElement(getObjectValues(NPCID)))
          .setMorality(Morality.NEGATIVE),
      () =>
        new SpawnNPCResponse()
          .construct(getRandomArrayElement(getObjectValues(NPCID)))
          .setChanceToActivate(getRandomInt(1, 100))
          .setAmountOfActivations(getRandomInt(1, 3))
          .setMorality(Morality.NEGATIVE),
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
    .setQuality(3);
  return invertedPassiveActionSet;
}
