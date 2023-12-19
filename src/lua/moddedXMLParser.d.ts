import type { Entities2XML } from "../interfaces/xml/entities2XML";
import type { ItemPoolsXML } from "../interfaces/xml/itemPoolXML";
import type { ItemsXML } from "../interfaces/xml/itemsXML";
import type { PlayersXML } from "../interfaces/xml/playersXML";

/** need to enable --luadebug. */
export function Parse(modFolderName: string): void;

/** entities2.xml */
export function getEntityFamiliars(modName: string): Entities2XML | undefined;

/** entities2.xml */
export function getEntityTears(modName: string): Entities2XML | undefined;

/** entities2.xml */
export function getEntityBombs(modName: string): Entities2XML | undefined;

/** entities2.xml */
export function getEntityKnives(modName: string): Entities2XML | undefined;

/** entities2.xml */
export function getEntityLasers(modName: string): Entities2XML | undefined;

/** entities2.xml */
export function getEntityNPCs(modName: string): Entities2XML | undefined;

/** entities2.xml */
export function getEntityProjectiles(modName: string): Entities2XML | undefined;

/** entities2.xml */
export function getEntityPlayers(modName: string): Entities2XML | undefined;

/** entities2.xml */
export function getEntityEffects(modName: string): Entities2XML | undefined;

/** entities2.xml */
export function getEntitySlots(modName: string): Entities2XML | undefined;

/** entities2.xml */
export function getEntityPickups(modName: string): Entities2XML | undefined;

/** items.xml */
export function getItems(modName: string): ItemsXML | undefined;

/** itempools.xml */
export function getItemPools(modName: string): ItemPoolsXML | undefined;

/** players.xml */
export function getPlayers(modName: string): PlayersXML | undefined;
