import { ColorDefault } from "isaacscript-common";
import { DeletedColor } from "../../enums/general/DeletedColor";
import { AdvancedColor } from "../../interfaces/general/AdvancedColor";

// eslint-disable-next-line isaacscript/require-capital-const-assertions
export const MORRISInvertedItemSpriteColor: AdvancedColor = {
  color: ColorDefault,
  colorize: [
    DeletedColor.WORM_TURQUOISE.R * 2,
    DeletedColor.WORM_TURQUOISE.G * 2,
    DeletedColor.WORM_TURQUOISE.B * 2,
    1,
  ],
};
