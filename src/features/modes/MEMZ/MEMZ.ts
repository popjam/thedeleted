import { saveDataManager } from "isaacscript-common";

const v = {};

export function memzInit(): void {
  saveDataManager("memz", v);
}

/** Initiate the player to the HAPPY99 mode. */
export function memzModeInit(player: EntityPlayer): void {}

/** Initiate the player to be HAPPY99 in the MEMZ mode. */
export function memz99MemzInit(player: EntityPlayer): void {}
