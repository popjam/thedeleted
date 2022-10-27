import { RoomType } from "isaac-typescript-definitions";
import { game, getRoomType } from "isaacscript-common";
import { ActionType } from "../../../enums/corruption/actions/ActionType";
import { triggerPlayersActionsByType } from "../../../features/corruption/effects/playerEffects";
import { addTheS } from "../../../helper/stringHelper";
import { TriggerData } from "../../../interfaces/corruption/actions/TriggerData";
import { getRoomNameFromType as getRoomNameFromRoomType } from "../../../maps/data/roomTypeNameMap";
import { Action } from "./Action";

const ACTION_TYPE = ActionType.ON_ROOM;
const SINGULAR_CHEST_CLAUSE = "visits to the Chest";
const PLURAL_CHEST_CLAUSE = "time you enter the Chest";
const SINGULAR_NUMBER = 1;
const PLURAL_NUMBER = 2;

/** Triggers every floor. */
export class OnRoomAction extends Action {
  override actionType = ACTION_TYPE;
  override noun = "room";
  override nounPlural = "rooms";
  roomType?: RoomType;

  /** If set, will only fire on the specified RoomType. */
  getRoomType(): RoomType | undefined {
    return this.roomType;
  }

  /** If set, will only fire on the specified RoomType. */
  setRoomType(roomType: RoomType): this {
    this.roomType = roomType;
    return this;
  }

  getRoomTypeText(amount: number): string | undefined {
    const { roomType } = this;
    if (roomType !== undefined) {
      if (roomType === RoomType.CHEST) {
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
    if (this.overriddenActionText !== undefined) {
      return this.overriddenActionText;
    }

    let text = "";
    const fireAfterThenRemove = this.getFireAfterThenRemove();
    if (fireAfterThenRemove !== undefined) {
      if (fireAfterThenRemove === 1) {
        text += `next ${
          this.getRoomTypeText(fireAfterThenRemove) ?? this.noun
        }`;
      } else {
        text += `after ${fireAfterThenRemove} ${
          this.getRoomTypeText(fireAfterThenRemove) ?? this.nounPlural
        }`;
      }
    } else {
      const intervalText = this.getIntervalText();
      if (intervalText === "") {
        text += `${this.verb} ${
          this.getRoomTypeText(SINGULAR_NUMBER) ?? this.noun
        }`;
      } else {
        text += `${this.verb} ${intervalText} ${
          this.getRoomTypeText(PLURAL_NUMBER) ?? this.nounPlural
        }`;
      }
    }
    text += ", ";
    return text;
  }

  override trigger(triggerData: TriggerData): void {
    const room = game.GetRoom();
    if (!room.IsFirstVisit()) {
      return;
    }

    if (this.roomType !== undefined) {
      if (getRoomType() !== this.roomType) {
        return;
      }
    }

    super.trigger(triggerData);
  }
}

/** Triggers all OnRoomActions for all players. */
export function triggerOnRoomActions(): void {
  triggerPlayersActionsByType(ACTION_TYPE);
}
