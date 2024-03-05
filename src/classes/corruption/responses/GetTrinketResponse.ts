import { TrinketType } from "isaac-typescript-definitions";
import { ResponseType } from "../../../enums/corruption/responses/ResponseType";
import type { TriggerData } from "../../../interfaces/corruption/actions/TriggerData";
import { Response } from "./Response";
import { getRandomTrinket } from "../../../helper/entityHelper/trinketHelper";
import { getTrinketNameWithEIDSetting } from "../../../helper/compatibility/EID/EIDHelper";
import { addArticle, addTheS } from "../../../helper/stringHelper";
import { getTrinketName, log, smeltTrinket } from "isaacscript-common";
import { getEIDTextSetting } from "../../../features/settings/EIDSettings";
import { EIDObjectDisplaySetting } from "../../../enums/settings/EIDObjectDisplaySetting";
import { fprint } from "../../../helper/printHelper";

const DEFAULT_TRINKET = TrinketType.BROKEN_MAGNET;
const NON_GULP_VERB = "get";
const NON_GULP_VERB_PARTICIPLE = "getting";
const GULP_VERB = "gulp";
const GULP_VERB_PARTICIPLE = "gulping";

/** Response to add a Trinket to the player, either gulped or to the players' TrinketSlot. */
export class GetTrinketResponse extends Response {
  override responseType: ResponseType = ResponseType.GET_TRINKET;
  t?: TrinketType | undefined;
  glp?: false;

  construct(trinket: TrinketType): this {
    this.t = trinket;
    return this;
  }

  /**
   * Set the TrinketType of the trinket this will give the player. If undefined, a random trinket
   * will be given.
   */
  getTrinket(): TrinketType | undefined {
    return this.t;
  }

  /**
   * Get the TrinketType of the trinket this will give the player. If undefined, a random trinket
   * will be given.
   */
  setTrinket(trinket: TrinketType): this {
    this.t = trinket;
    return this;
  }

  /** Whether the player should gulp the Trinket upon giving it to them. */
  getGulpSetting(): boolean {
    return this.glp === undefined;
  }

  /** Whether the player should gulp the Trinket upon giving it to them. */
  setGulpSetting(gulp: boolean): this {
    this.glp = gulp ? undefined : gulp;
    return this;
  }

  calculateTrinket(): TrinketType {
    const trinket = this.getTrinket();
    if (trinket !== undefined) {
      return trinket;
    }
    return getRandomTrinket() ?? DEFAULT_TRINKET;
  }

  getVerb(participle: boolean): string {
    const shouldGulp = this.getGulpSetting();
    if (shouldGulp) {
      return participle ? GULP_VERB_PARTICIPLE : GULP_VERB;
    }
    return participle ? NON_GULP_VERB_PARTICIPLE : NON_GULP_VERB;
  }

  /**
   * Get noun text with amount of activations.
   *
   * @example "match stick"
   * @example "3-5 match sticks"
   */
  override getNoun(eid: boolean): string {
    const trinket = this.getTrinket();
    const isMultiple = this.isMultiple();

    // Random.
    if (trinket === undefined) {
      if (isMultiple) {
        return `${this.getAmountOfActivationsText()} random trinkets`;
      }

      return "a random trinket";
    }

    // Specific trinket.
    const trinketName = eid
      ? getTrinketNameWithEIDSetting(trinket)
      : getTrinketName(trinket);
    const eidSetting = getEIDTextSetting();

    if (isMultiple) {
      // If the trinket name is only an icon, we don't need to add an 's' to the end.
      if (eid && eidSetting === EIDObjectDisplaySetting.ICON_ONLY) {
        return `${this.getAmountOfActivationsText()} ${trinketName}`;
      }
      return `${this.getAmountOfActivationsText()} ${addTheS(
        trinketName,
        true,
      )}`;
    }

    // If the trinket name is only an icon, we don't need to add an article.
    if (eid && eidSetting === EIDObjectDisplaySetting.ICON_ONLY) {
      return getTrinketNameWithEIDSetting(trinket);
    }
    return addArticle(getTrinketNameWithEIDSetting(trinket));
  }

  override getText(eid: boolean, participle: boolean): string {
    const verb = this.getVerb(participle);
    const noun = this.getNoun(eid);

    return `${verb} ${noun}`;
  }

  override trigger(triggerData?: TriggerData): TrinketType[] {
    return super.trigger(triggerData) as TrinketType[];
  }

  override fire(triggerData: TriggerData): TrinketType {
    const shouldGulp = this.getGulpSetting();
    const trinket = this.calculateTrinket();
    const player = triggerData.player ?? Isaac.GetPlayer();

    log(`Giving player trinket: ${trinket}`);

    if (shouldGulp) {
      smeltTrinket(player, trinket);
    } else {
      player.AddTrinket(trinket);
    }

    return trinket;
  }
}
