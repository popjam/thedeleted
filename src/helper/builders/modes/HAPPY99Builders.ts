import { CollectibleType, ItemType } from "isaac-typescript-definitions";
import {
  getRandomArrayElement,
  getRandomFromWeightedArray,
  getRandomInt,
} from "isaacscript-common";
import { Action } from "../../../classes/corruption/actions/Action";
import { OnDamageAction } from "../../../classes/corruption/actions/OnDamageAction";
import { OnFloorAction } from "../../../classes/corruption/actions/OnFloorAction";
import { OnKillAction } from "../../../classes/corruption/actions/OnKillAction";
import { OnObtainAction } from "../../../classes/corruption/actions/OnObtainAction";
import { OnRoomAction } from "../../../classes/corruption/actions/OnRoomAction";
import { InvertedItemActionSet } from "../../../classes/corruption/actionSets/InvertedItemActionSet";
import { InvertedPassiveActionSet } from "../../../classes/corruption/actionSets/InvertedPassiveActionSet";
import { Response } from "../../../classes/corruption/responses/Response";
import { SpawnNPCResponse } from "../../../classes/corruption/responses/SpawnNPCResponse";
import { TriggerInSequenceResponse } from "../../../classes/corruption/responses/TriggerInSequence";
import { TriggerOverTimeResponse } from "../../../classes/corruption/responses/TriggerOverTimeResponse";
import { TriggerRandomResponse } from "../../../classes/corruption/responses/TriggerRandomResponse";
import { UseActiveItemResponse } from "../../../classes/corruption/responses/UseActiveItemResponse";
import { WaitThenTriggerResponse } from "../../../classes/corruption/responses/WaitThenTriggerResponse";
import { DeletedColor } from "../../../enums/general/DeletedColor";
import { NPCID } from "../../../enums/general/NPCID";
import { ActionSetBuilderInput } from "../../../interfaces/corruption/actionSets/ActionSetBuilderInput";
import { getRandomCollectibleType } from "../../collectibleHelper";
import { getObjectValues } from "../../objectHelper";

export function happy99DefaultBuilder(
  inputs?: ActionSetBuilderInput,
): InvertedItemActionSet {
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
  return new InvertedPassiveActionSet()
    .addEffects(...effectArray)
    .setColor(DeletedColor.HAPPY_YELLOW);
}
