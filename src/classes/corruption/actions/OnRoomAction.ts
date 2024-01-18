import { RoomType } from "isaac-typescript-definitions";
import { game, getRoomType } from "isaacscript-common";
import { ActionType } from "../../../enums/corruption/actions/ActionType";
import { triggerPlayersActionsByType } from "../../../features/corruption/effects/playerEffects";
import { addTheS } from "../../../helper/stringHelper";
import type { TriggerData } from "../../../interfaces/corruption/actions/TriggerData";
import { roomTypeToString as getRoomNameFromRoomType } from "../../../maps/data/name/roomTypeNameMap";
import { Action } from "./Action";

const ACTION_TYPE = ActionType.ON_ROOM;
const SINGULAR_CHEST_CLAUSE = "visits to the Chest";
const PLURAL_CHEST_CLAUSE = "time you enter the Chest";
const SINGULAR_NUMBER = 1;
const PLURAL_NUMBER = 2;

/** Triggers every floor. */
export class OnRoomAction extends Action {
  override actionType = ACTION_TYPE;
  rT?: RoomType;

  /** If set, will only fire on the specified RoomType. */
  getRoomType(): RoomType | undefined {
    return this.rT;
  }

  /** If set, will only fire on the specified RoomType. */
  setRoomType(roomType: RoomType): this {
    this.rT = roomType;
    return this;
  }

  getRoomTypeText(amount: number): string | undefined {
    const { rT: roomType } = this;
    if (roomType !== undefined) {
      if (roomType === RoomType.VAULT) {
        if (amount !== 1) {
          return SINGULAR_CHEST_CLAUSE;
        }
        return PLURAL_CHEST_CLAUSE;
      }
      const name = getRoomNameFromRoomType(roomType).toLowerCase();
      return addTheS(name, amount);
    }
    return undefined;
  }

  // Additional Text manipulation for 'RoomType' modifier.
  override getActionText(): string {
    // If overridden.
    if (this.oat !== undefined) {
      return this.oat;
    }

    let text = "";
    const fireAfterThenRemove = this.getFireAfterThenRemove();
    if (fireAfterThenRemove === undefined) {
      const intervalText = this.getIntervalText();
      text +=
        intervalText === ""
          ? `every ${this.getRoomTypeText(SINGULAR_NUMBER) ?? "room"}`
          : `every ${intervalText} ${
              this.getRoomTypeText(PLURAL_NUMBER) ?? "rooms"
            }`;
    } else if (fireAfterThenRemove === 1) {
      text += `next ${this.getRoomTypeText(fireAfterThenRemove) ?? "room"}`;
    } else {
      text += `after ${fireAfterThenRemove} ${
        this.getRoomTypeText(fireAfterThenRemove) ?? "rooms"
      }`;
    }
    text += ", ";
    return text;
  }

  override trigger(triggerData: TriggerData): void {
    const room = game.GetRoom();
    if (!room.IsFirstVisit()) {
      return;
    }

    if (this.rT !== undefined && getRoomType() !== this.rT) {
      return;
    }

    super.trigger(triggerData);
  }
}

/** Triggers all OnRoomActions for all players. */
export function triggerOnRoomActions(): void {
  triggerPlayersActionsByType(ACTION_TYPE, {});
}
