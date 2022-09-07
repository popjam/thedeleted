import { CollectibleType } from "isaac-typescript-definitions";
import { getRandomInt } from "isaacscript-common";
import { ActionType } from "../../enums/corruption/ActionType";
import { ResponseType } from "../../enums/corruption/ResponseType";
import { OnRoomAction } from "../../interfaces/corruption/Action";
import { UseActiveItemResponse } from "../../interfaces/corruption/Response";
import {
  ComplexSpreadOrType,
  createComplexType,
  isComplexType,
  simplifyComplexType,
} from "../../types/ComplexStructure";
import { spread } from "../../types/Spread";

const testResponse: UseActiveItemResponse = {
  responseType: ResponseType.USE_ACTIVE_ITEM,
  activeItem: CollectibleType.ANARCHIST_COOKBOOK,
  tags: {
    chanceToActivate: getRandomInt(1, 100),
  },
};

const testAction: OnRoomAction = {
  actionType: ActionType.ON_ROOM,
  responses: testResponse,
  tags: {
    activateAfter: 3,
  },
};

const testAction2: OnRoomAction = {
  actionType: ActionType.ON_ROOM,
  responses: testResponse,
};

const ex: ComplexSpreadOrType<number> = createComplexType(
  createComplexType(
    [
      [1, 1],
      [2, 1],
    ],
    "ComplexSpread",
  ),
  "ComplexSpreadOrType",
);

/** Test stuff as the developer with command 'del'. */
export function testingFunctionA(): void {
  let spreadOrType = simplifyComplexType(ex);
  if (isComplexType(spreadOrType, "ComplexSpread")) {
    const s = spread(simplifyComplexType(spreadOrType));
    if (s === undefined) {
      return;
    }
    spreadOrType = s;
  }
  print(spreadOrType);
}

/** Test stuff as the developer with command 'del'. */
export function testingFunctionB(): void {
  print("hieeeeii");
}
