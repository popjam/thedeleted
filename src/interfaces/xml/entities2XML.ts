import type { EntityCategory } from "../../enums/general/EntityCategory";
import type { NameSubType } from "../../types/data/nameSubType";

export interface EntityXML {
  _attr: {
    name: string;
    id: string;
    variant?: string;
    subtype?: string;
    anm2path?: string;
    baseHP?: string;
    boss?: "0" | "1";
    bossID?: string;
    champion?: string;
    collisionDamage?: string;
    collisionMass?: string;
    collisionRadius?: string;
    collisionRadiusXMulti?: string;
    collisionRadiusYMulti?: string;
    collisionInterval?: string;
    numGridCollisionPoints?: string;
    friction?: string;
    shadowSize?: string;
    stageHP?: string;
    tags?: string;
    gridCollision?: string;
    portrait?: string;
    hasFloorAlts?: string;
    reroll?: string;
    shutdoors?: string;
    shieldStrength?: string;
    gibAmount?: string;
    gibFlags?: string;
    bestiaryAnim?: string;
    bestiaryOverlay?: string;
  };
  gibs: GibsXML;
}

export interface GibsXML {
  _attr: {
    amount: string;
    blood?: "0" | "1";
    bone?: "0" | "1";
    chain?: "0" | "1";
    colorblood?: "0" | "1";
    dust?: "0" | "1";
    eye?: "0" | "1";
    gut?: "0" | "1";
    huge?: "0" | "1";
    large?: "0" | "1";
    poop?: "0" | "1";
    rock?: "0" | "1";
    rock_small?: "0" | "1";
    small?: "0" | "1";
    sound_baby?: "0" | "1";
    sound_bone?: "0" | "1";
    worm?: "0" | "1";
  };
}

/**
 * This type is used to describe a group of entities derived from entities2.xml that are separated
 * into their entity categories. The entities are stored in an object with the keys being the
 * entityNameSubType, and the values being the entity data.
 */
export type Entities2XML = Record<NameSubType, EntityXML>;
