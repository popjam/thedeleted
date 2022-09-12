import { ActiveSlot, CollectibleType } from "isaac-typescript-definitions";
import {
  getRandomInt,
  playerAddCollectible,
  removeAllActiveItems,
  setActiveItem,
} from "isaacscript-common";
import { ActionType } from "../../enums/corruption/actions/ActionType";
import { ResponseType } from "../../enums/corruption/responses/ResponseType";
import { CollectibleTypeCustom } from "../../enums/general/CollectibleTypeCustom";
import { Mode } from "../../enums/modes/Mode";
import { OnRoomAction } from "../../interfaces/corruption/actions/Action";
import { UseActiveItemResponse } from "../../interfaces/corruption/responses/Response";
import { validifyRange } from "../../types/general/Range";
import { setCurrentMode } from "../modes/mode";

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

/** Test stuff as the developer with command 'del'. */
export function testingFunctionA(): void {
  setCurrentMode(Isaac.GetPlayer(0), Mode.HAPPY99);
}

/** Test stuff as the developer with command 'eted'. */
export function testingFunctionB(): void {
  Isaac.GetPlayer(0).RemoveCollectible(
    Isaac.GetPlayer(0).GetActiveItem(ActiveSlot.POCKET),
  );
}
