import { ColorDefault } from "isaacscript-common";
import { DeletedColor } from "../../enums/general/DeletedColor";
import type { AdvancedColor } from "../../interfaces/general/AdvancedColor";

export const NUM_ACTIVE_ITEMS_IN_INVERTED_ACTIVES = 2;

// eslint-disable-next-line isaacscript/require-capital-const-assertions
export const REVETONInvertedItemRedSpriteColor: AdvancedColor = {
  color: ColorDefault,
  colorize: [
    DeletedColor.REVETON_RED.R * 4,
    DeletedColor.REVETON_RED.G * 2,
    DeletedColor.REVETON_RED.B * 2,
    1,
  ],
};

// eslint-disable-next-line isaacscript/require-capital-const-assertions
export const REVETONInvertedItemBlueSpriteColor: AdvancedColor = {
  color: ColorDefault,
  colorize: [
    DeletedColor.REVETON_BLUE.R * 2,
    DeletedColor.REVETON_BLUE.G * 2,
    DeletedColor.REVETON_BLUE.B * 4,
    1,
  ],
};
