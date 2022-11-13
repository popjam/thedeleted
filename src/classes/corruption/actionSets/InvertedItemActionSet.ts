import { ColorDefault } from "isaacscript-common";
import { EID_ENTITY_DATA_KEY } from "../../../constants/eidConstants";
import { MOD_NAME } from "../../../constants/mod/modConstants";
import { legibleString } from "../../../helper/stringHelper";
import { ActionSet } from "./ActionSet";

const DEFAULT_COLOR = ColorDefault;
const DEFAULT_FLIP_X = true;
const DEFAULT_QUALITY = 0;
const DEFAULT_NAME = "Corrupted Item";

/** ActionSet class. */
export abstract class InvertedItemActionSet extends ActionSet {
  /** This color will be reflected in the entity which the ActionSet belongs to. */
  c?: Color;
  fX?: boolean;
  q?: number;
  n?: string;

  getColor(): Color {
    return this.c ?? DEFAULT_COLOR;
  }

  setColor(color: Color): this {
    this.c = color;
    return this;
  }

  getFlipX(): boolean {
    return this.fX ?? DEFAULT_FLIP_X;
  }

  setFlipX(flipX: boolean): this {
    this.fX = flipX;
    return this;
  }

  getQuality(): number {
    return this.q ?? DEFAULT_QUALITY;
  }

  setQuality(quality: number): this {
    this.q = quality;
    return this;
  }

  /** Get the name of the corrupted item. */
  getName(): string {
    return this.n ?? DEFAULT_NAME;
  }

  /** Set the name of the corrupted item. */
  setName(name: string): this {
    this.n = name;
    return this;
  }

  /** Updates the EID Description and appearance of the collectible. */
  updateAppearance(collectible: EntityPickupCollectible): void {
    collectible.SetColor(this.getColor(), 0, 1);
    collectible.FlipX = this.getFlipX();

    const descObj = {
      Description: legibleString(this.getText()),
      Name: this.getName(),
      ModName: MOD_NAME,
      Quality: this.getQuality(),
    };
    collectible.GetData()[EID_ENTITY_DATA_KEY] = descObj;
  }
}
