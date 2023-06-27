import { ColorDefault } from "isaacscript-common";
import { EIDColorShortcut } from "../../enums/compatibility/EIDColor";
import { DeletedColor } from "../../enums/general/DeletedColor";
import { AdvancedColor } from "../../interfaces/general/AdvancedColor";

// eslint-disable-next-line isaacscript/require-capital-const-assertions
export const ILOVEYOU_ACTION_SET_COLOR_TRIPLET: [
  EIDColorShortcut,
  EIDColorShortcut,
  EIDColorShortcut,
] = [
  EIDColorShortcut.HAPPY_YELLOW,
  EIDColorShortcut.ANGRY_RED,
  EIDColorShortcut.HAPPY_YELLOW_DARKEST,
];

// eslint-disable-next-line isaacscript/require-capital-const-assertions
export const ILOVEYOUInvertedItemSpriteColor: AdvancedColor = {
  color: ColorDefault,
  colorize: [
    DeletedColor.LOVE_PINK.R * 2,
    DeletedColor.LOVE_PINK.G * 2,
    DeletedColor.LOVE_PINK.B * 2,
    1,
  ],
};
