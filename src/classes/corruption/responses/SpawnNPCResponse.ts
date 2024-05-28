import type { EntityID } from "isaacscript-common";
import {
  DISTANCE_OF_GRID_TILE,
  VectorZero,
  game,
  getRandomEnumValue,
  getRandomSeed,
} from "isaacscript-common";
import { ResponseType } from "../../../enums/corruption/responses/ResponseType";
import { addArticle, addTheS } from "../../../helper/stringHelper";
import type { TriggerData } from "../../../interfaces/corruption/actions/TriggerData";
import { Response } from "./Response";
import type { Range } from "../../../types/general/Range";
import type { NPCAttribute } from "../../../interfaces/general/NPCAttribute";
import { NPCFlag } from "../../../enums/general/NPCFlag";
import { addNPCFlags } from "../../../helper/entityHelper/npcFlagHelper";
import {
  getRandomNPC,
  isNPCIDBoss,
  npcAttributesToText,
  spawnNPCID,
} from "../../../helper/entityHelper/npcHelper";
import { ChampionColor, NPCID } from "isaac-typescript-definitions";
import { championColorToString } from "../../../maps/data/name/championColorNameMap";
import { npcFlagToString } from "../../../maps/data/name/npcFlagNameMap";
import {
  isPositionAccessible,
  getRandomAccessiblePosition,
} from "../../../helper/positionHelper";
import type { SpawnEntityResponseInterface } from "../../../interfaces/corruption/responses/SpawnEntityResponseInterface";
import { getEntityNameFromEntityID } from "../../../helper/entityHelper/entityIDHelper";
import {
  BOSS_NPC_SEVERITY,
  NON_BOSS_NPC_SEVERITY,
} from "../../../constants/severityConstants";
import { rollPercentage } from "../../../types/general/Percentage";
import {
  SPAWN_NPC_CHANCE_FOR_CHAMPION,
  SPAWN_NPC_CHANCE_FOR_NPC_FLAG,
  SPAWN_NPC_CHANCE_FOR_SPECIFIC_NPC,
} from "../../../constants/corruptionConstants";
import { makeNPCNonMandatory } from "../../facets/entityModifiers.ts/NPCModifiers/NonMandatoryNPCFacet";
import { EIDMarkup } from "../../../enums/compatibility/EID/EIDMarkup";
import { getEIDColorShortcutFromChampionColor } from "../../../maps/compatibility/ChampionColorToEIDColorShortcutMap";

const DEFAULT_NPC = NPCID.GAPER;
const UNKNOWN_NPC_NAME_TEXT = "unknown npc";
const VERB = "spawn";
const DEFAULT_SPAWN_VELOCITY = VectorZero;
const DEFAULT_CHAMPION_EID_COLOR = EIDMarkup.COLOR_PURPLE;

/**
 * Response to spawn an NPC.
 *
 * @param e The NPC you want to spawn. Can be a specific NPC, or a random NPC from a group.
 * @param sp The position to spawn the NPC/s at. If not specified, will spawn at a random accessible
 *           position.
 * @param rst How the NPC/s are spawned. Defaults to 'accessible to player but avoid'.
 * @param flg Custom NPC flags to modify the NPC's behavior or appearance.
 */
export class SpawnNPCResponse
  extends Response
  implements SpawnEntityResponseInterface<SpawnNPCResponse>
{
  override responseType: ResponseType = ResponseType.SPAWN_NPC;
  e?: NPCID | NPCAttribute | undefined;
  sp?: Vector;
  v?: Vector;
  flg?: readonly NPCFlag[];
  chmp?: ChampionColor;

  /**
   * Constructor for SpawnNPCResponse.
   *
   * @param entityNPC The NPC you want to spawn. Can be a specific NPC, or a random NPC from a
   *                  group.
   * @param overridePos The position to spawn the NPC/s at. If not specified, will spawn at a random
   *                    accessible position.
   * @param overrideVel The velocity of the NPC/s. Defaults to zero.
   * @param amount The amount of NPCs to spawn. If a range, will spawn a random amount between the
   *               range.
   * @param flags Custom NPC flags to modify the NPC's behavior or appearance.
   * @param championColor The champion color to make the NPC/s.
   */
  construct(
    entityNPC: NPCID | NPCAttribute | undefined,
    overridePos?: Vector,
    overrideVel?: Vector,
    amount?: number | Range,
    flags?: readonly NPCFlag[],
    championColor?: ChampionColor,
  ): this {
    this.setNPC(entityNPC);
    if (overridePos !== undefined) {
      this.setPosition(overridePos);
    }
    if (overrideVel !== undefined) {
      this.setVelocity(overrideVel);
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

  override shuffle(): this {
    if (rollPercentage(SPAWN_NPC_CHANCE_FOR_SPECIFIC_NPC)) {
      this.setNPC(getRandomNPC());
    }

    if (rollPercentage(SPAWN_NPC_CHANCE_FOR_CHAMPION)) {
      const randomChampionColor = getRandomEnumValue(ChampionColor, undefined);
      this.setChampionColor(randomChampionColor);
    }

    // Currently only gives one flag.
    if (rollPercentage(SPAWN_NPC_CHANCE_FOR_NPC_FLAG)) {
      const randomFlag = getRandomEnumValue(NPCFlag, undefined);
      this.setNPCFlags([randomFlag]);
    }

    return super.shuffle();
  }

  override getSeverity(): number {
    const npc = this.getNPC();
    if (typeof npc === "string") {
      const isBoss = isNPCIDBoss(npc as NPCID) ?? false;
      return super.getSeverity(
        isBoss ? BOSS_NPC_SEVERITY : NON_BOSS_NPC_SEVERITY,
      );
    }
    return super.getSeverity(NON_BOSS_NPC_SEVERITY);
  }

  getNPCFlags(): readonly NPCFlag[] | undefined {
    return this.flg;
  }

  setNPCFlags(flags: readonly NPCFlag[]): this {
    this.flg = flags;
    return this;
  }

  /**
   * Get the NPC name plus any adjectives (e.g. 'charmed', 'blue-champion') as text. Will
   * automatically add the article.
   *
   * @example "a charmed gaper"
   * @example "a flying boss"
   */
  getNPCNameClause(adjectives: string): string {
    const npc = this.getNPC();
    const plural = this.isMultiple();
    if (typeof npc === "string") {
      let npcNameClause = (
        getEntityNameFromEntityID(npc as EntityID) ?? UNKNOWN_NPC_NAME_TEXT
      ).toLowerCase();
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

    if (npc === undefined) {
      // Random npc.
      return plural
        ? `random ${adjectives} enemies`
        : `a random ${adjectives} enemy`;
    }

    return npcAttributesToText(npc, plural, adjectives);
  }

  getNPC(): NPCID | NPCAttribute | undefined {
    return this.e;
  }

  setNPC(npc: NPCID | NPCAttribute | undefined): this {
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

  calculatePosition(triggerData: TriggerData): Vector {
    const position = this.getPosition();
    if (position !== undefined) {
      return position;
    }

    const triggerDataPosition = triggerData.spawnPosition;
    if (
      triggerDataPosition &&
      isPositionAccessible(
        triggerDataPosition,
        triggerData.player?.Position ?? Isaac.GetPlayer().Position,
      )
    ) {
      return triggerDataPosition;
    }

    return (
      getRandomAccessiblePosition(Isaac.GetPlayer().Position) ??
      game.GetRoom().GetRandomPosition(DISTANCE_OF_GRID_TILE)
    );
  }

  calculateVelocity(triggerData: TriggerData): Vector {
    return triggerData.spawnVelocity ?? DEFAULT_SPAWN_VELOCITY;
  }

  spawnNPC(position: Vector, velocity: Vector): EntityNPC {
    const npc = this.getNPC();
    if (typeof npc === "string") {
      return this.calculatePostNPCSpawn(spawnNPCID(npc, position, velocity));
    }
    // Random.
    const randomNPC = getRandomNPC(npc);
    if (randomNPC === undefined) {
      return spawnNPCID(DEFAULT_NPC, position, velocity);
    }
    return this.calculatePostNPCSpawn(
      spawnNPCID(randomNPC, position, velocity),
    );
  }

  getPosition(): Vector | undefined {
    return this.sp;
  }

  setPosition(position?: Vector): this {
    this.sp = position;
    return this;
  }

  getVelocity(): Vector | undefined {
    return this.v;
  }

  setVelocity(velocity?: Vector): this {
    this.v = velocity;
    return this;
  }

  override getVerb(participle: boolean): string {
    return participle ? VERB : VERB;
  }

  getNPCFlagText(eid: boolean): string {
    const flags = this.getNPCFlags();
    if (flags === undefined) {
      return "";
    }
    const flagText = flags
      .map((flag) => npcFlagToString(flag))
      .join(", ")
      .toLowerCase();

    if (eid) {
      return `{{ColorGreen}}${flagText}{{CR}}`;
    }

    return flagText;
  }

  getChampionColorText(eid: boolean): string {
    const championColor = this.getChampionColor();
    if (championColor === undefined) {
      return "";
    }
    const championColorText =
      championColorToString(championColor).toLowerCase();
    if (eid) {
      const colorShortcut =
        getEIDColorShortcutFromChampionColor(championColor) ??
        DEFAULT_CHAMPION_EID_COLOR;
      return `${colorShortcut}${championColorText}${EIDMarkup.COLOR_RESET}`;
    }
    return championColorText;
  }

  // Get NPC modifiers (e.g. 'charmed', 'blue-champion') as text. This does not include
  // NPCAttributes for random NPCs.
  getAdjectivesText(eid: boolean): string {
    let text = "";
    text += this.getNPCFlagText(eid);
    text += " ";
    text += this.getChampionColorText(eid);
    return text;
  }

  /**
   * Get noun text.
   *
   * @example "3-4 gapers"
   * @example "a random flying boss"
   * @example "12 blue-champion enemies"
   */
  override getNoun(eid: boolean): string {
    const amountOfActivationsText = this.getAmountOfActivationsText() ?? "";
    const adjectives = this.getAdjectivesText(eid);
    const npcNameClause = this.getNPCNameClause(adjectives);

    return `${amountOfActivationsText} ${npcNameClause}`;
  }

  getText(eid: boolean, participle: boolean): string {
    const verb = this.getVerb(participle);
    const noun = this.getNoun(eid);
    const chanceToActivate = this.getChanceToActivateText(participle);

    return `${chanceToActivate} ${verb} ${noun}`;
  }

  override trigger(triggerData?: TriggerData): EntityNPC[] {
    return super.trigger(triggerData) as EntityNPC[];
  }

  fire(triggerData: TriggerData): EntityNPC {
    return this.spawnNPC(
      this.calculatePosition(triggerData),
      this.calculateVelocity(triggerData),
    );
  }
}
