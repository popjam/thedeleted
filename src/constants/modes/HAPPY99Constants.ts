import { ColorDefault } from "isaacscript-common";
import { DeletedColor } from "../../enums/general/DeletedColor";
import type { AdvancedColor } from "../../interfaces/general/AdvancedColor";

// eslint-disable-next-line isaacscript/require-capital-const-assertions
export const HAPPY99InvertedItemSpriteColor: AdvancedColor = {
  color: ColorDefault,
  colorize: [
    DeletedColor.HAPPY_YELLOW.R * 2,
    DeletedColor.HAPPY_YELLOW.G * 2,
    DeletedColor.HAPPY_YELLOW.B * 2,
    1,
  ],
};
