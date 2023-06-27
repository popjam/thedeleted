import { mod } from "../../../mod";

const v = {};

export function memzInit(): void {
  mod.saveDataManager("memz", v);
}

/** Initiate the player to the HAPPY99 mode. */
export function memzModeInit(player: EntityPlayer): void {}

/** Initiate the player to be HAPPY99 in the MEMZ mode. */
export function memzModeFin(player: EntityPlayer): void {}
