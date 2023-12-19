import { DISTANCE_OF_GRID_TILE, game, getRandomSeed } from "isaacscript-common";
import { ResponseType } from "../../../enums/corruption/responses/ResponseType";
import {
  getRandomAccessiblePosition,
  isPositionAccessible,
} from "../../../helper/entityHelper";
import { addArticle, addTheS } from "../../../helper/stringHelper";
import type { TriggerData } from "../../../interfaces/corruption/actions/TriggerData";
import { Response } from "./Response";
import type { Range } from "../../../types/general/Range";
import type { NPCAttribute } from "../../../interfaces/general/NPCAttribute";
import type { NPCFlag } from "../../../enums/general/NPCFlag";
import { addNPCFlags } from "../../../helper/entityHelper/npcFlagHelper";
import {
  getRandomNPC,
  npcAttributesToText,
} from "../../../helper/entityHelper/npcHelper";
import {
  getNPCIDName,
  spawnNPCID,
} from "../../../helper/entityHelper/npcIDHelper";
import type { ChampionColor } from "isaac-typescript-definitions";
import { NPCID } from "isaac-typescript-definitions";
import { getChampionColorTextFromMap } from "../../../maps/data/name/championColorNameMap";

const DEFAULT_NPC = NPCID.GAPER;
const UNKNOWN_NPC_NAME_TEXT = "unknown npc";
const VERB = "spawn";
const ARTICLES = ["a", "an", "the"] as const;

/**
 * Response to spawn an NPC.
 *
 * @param e The NPC you want to spawn. Can be a specific NPC, or a random NPC from a group.
 * @param sp The position to spawn the NPC/s at. If not specified, will spawn at a random accessible
 *           position.
 * @param rst How the NPC/s are spawned. Defaults to 'accessible to player but avoid'.
 * @param flg Custom NPC flags to modify the NPC's behavior or appearance.
 */
export class SpawnNPCResponse extends Response {
  override responseType: ResponseType = ResponseType.SPAWN_NPC;
  e?: NPCID | NPCAttribute;
  sp?: Vector;
  flg?: readonly NPCFlag[];
  chmp?: ChampionColor;

  /**
   * Constructor for SpawnNPCResponse.
   *
   * @param entityNPC The NPC you want to spawn. Can be a specific NPC, or a random NPC from a
   *                  group.
   * @param overridePos The position to spawn the NPC/s at. May override the spawn type.
   * @param amount The amount of NPCs to spawn. If a range, will spawn a random amount between the
   *               range.
   * @param flags Custom NPC flags to modify the NPC's behavior or appearance.
   * @param championColor The champion color to make the NPC/s.
   */
  construct(
    entityNPC: NPCID | NPCAttribute,
    overridePos?: Vector,
    amount?: number | Range,
    flags?: readonly NPCFlag[],
    championColor?: ChampionColor,
  ): this {
    this.setNPC(entityNPC);
    if (overridePos !== undefined) {
      this.setPosition(overridePos);
    }
    if (amount !== undefined) {
      this.setAmountOfActivations(amount);
    }
    if (flags !== undefined) {
      this.setNPCFlags(flags);
    }
    if (championColor !== undefined) {
      this.setChampionColor(championColor);
    }
    return this;
  }

  getNPCFlags(): readonly NPCFlag[] | undefined {
    return this.flg;
  }

  setNPCFlags(flags: readonly NPCFlag[]): this {
    this.flg = flags;
    return this;
  }

  // Get the NPC name plus any adjectives (e.g. 'charmed', 'blue-champion') as text. Will
  // automatically add the article.
  getNPCNameClause(adjectives: string): string {
    const npc = this.getNPC();
    const plural = !this.doesTriggerOnce();
    if (typeof npc === "string") {
      let npcNameClause = getNPCIDName(npc) ?? UNKNOWN_NPC_NAME_TEXT;
      if (plural) {
        // Add the plural 's' to the end of the name.
        npcNameClause = addTheS(npcNameClause, true);
      }

      npcNameClause = `${adjectives} ${npcNameClause}`;
      if (!plural) {
        // Only add the article if it's singular.
        npcNameClause = addArticle(npcNameClause);
      }

      return npcNameClause;
    }
    return npcAttributesToText(npc, plural, adjectives);
  }

  getNPC(): NPCID | NPCAttribute {
    return this.e ?? DEFAULT_NPC;
  }

  setNPC(npc: NPCID | NPCAttribute): this {
    this.e = npc;
    return this;
  }

  getChampionColor(): ChampionColor | undefined {
    return this.chmp;
  }

  setChampionColor(championColor: ChampionColor): this {
    this.chmp = championColor;
    return this;
  }

  calculatePostNPCSpawn(spawnedNPC: EntityNPC): EntityNPC {
    const championColor = this.getChampionColor();
    const flags = this.getNPCFlags();
    if (championColor !== undefined) {
      spawnedNPC.MakeChampion(getRandomSeed(), championColor);
    }
    if (flags !== undefined) {
      addNPCFlags(spawnedNPC, ...flags);
    }
    return spawnedNPC;
  }

  calculatePosition(): Vector {
    return (
      this.getPosition() ??
      getRandomAccessiblePosition(Isaac.GetPlayer().Position) ??
      game.GetRoom().GetRandomPosition(DISTANCE_OF_GRID_TILE)
    );
  }

  spawnNPC(position: Vector): EntityNPC | undefined {
    const npc = this.getNPC();
    if (typeof npc === "string") {
      return this.calculatePostNPCSpawn(spawnNPCID(npc, position));
    }
    // Random.
    const randomNPC = getRandomNPC(npc);
    if (randomNPC === undefined) {
      return undefined;
    }
    return this.calculatePostNPCSpawn(spawnNPCID(randomNPC, position));
  }

  getPosition(): Vector | undefined {
    return this.sp;
  }

  setPosition(vec: Vector): this {
    this.sp = vec;
    return this;
  }

  getChampionColorText(): string {
    const championColor = this.getChampionColor();
    if (championColor === undefined) {
      return "";
    }
    return `${getChampionColorTextFromMap(
      championColor,
    ).toLowerCase()} champion`;
  }

  // Get NPC modifiers (e.g. 'charmed', 'blue-champion') as text. This does not include
  // NPCAttributes for random NPCs.
  getAdjectivesText(): string {
    let text = "";
    text += this.getChampionColorText();
    // TODO: Add NPCFlag text.
    return text;
  }

  getText(): string {
    const amountOfActivationsText = this.getAmountOfActivationsText();
    const adjectives = this.getAdjectivesText();

    return `${VERB} ${amountOfActivationsText ?? ""} ${this.getNPCNameClause(
      adjectives,
    )}`;
  }

  fire(triggerData: TriggerData): Entity | undefined {
    const player = triggerData.player ?? Isaac.GetPlayer();

    // If triggered from killing an NPC, spawn from the NPC position.
    if (
      triggerData.onKillAction !== undefined &&
      isPositionAccessible(triggerData.onKillAction.Position, player.Position)
    ) {
      return this.spawnNPC(triggerData.onKillAction.Position);
    }

    return this.spawnNPC(this.calculatePosition());
  }
}
