import { CollectibleType, ItemType } from "isaac-typescript-definitions";
import { COLORS, getRandomInt, getRandomSeed } from "isaacscript-common";
import { InvertedActiveActionSet } from "../../../classes/corruption/actionSets/Inverted/InvertedActiveActionSet";
import type { InvertedItemActionSet } from "../../../classes/corruption/actionSets/Inverted/InvertedItemActionSet";
import { InvertedPassiveActionSet } from "../../../classes/corruption/actionSets/Inverted/InvertedPassiveActionSet";
import {
  GetCollectibleResponse,
  isGetCollectibleResponse,
} from "../../../classes/corruption/responses/GetCollectibleResponse";
import type { Response } from "../../../classes/corruption/responses/Response";
import { UseActiveItemResponse } from "../../../classes/corruption/responses/UseActiveItemResponse";
import {
  REVETONInvertedItemBlueSpriteColor,
  REVETONInvertedItemRedSpriteColor,
} from "../../../constants/modes/REVETONConstants";
import { EIDColorShortcut } from "../../../enums/compatibility/EIDColor";
import { ActionSetType } from "../../../enums/corruption/actionSets/ActionSetType";
import { ResponseType } from "../../../enums/corruption/responses/ResponseType";
import { DeletedColor } from "../../../enums/general/DeletedColor";
import { getAdvancedInvertedItemIconSetting } from "../../../features/settings/GeneralSettings";
import type { ActionSetBuilderInput } from "../../../interfaces/corruption/actionSets/ActionSetBuilderInput";
import type { CorruptedCollectibleSprite } from "../../../interfaces/corruption/funny/CorruptedCollectibleSprite";
import { getRandomCollectibleType } from "../../collectibleHelper";
import { getRandomInteger } from "../../randomHelper";

/** Default Builder to generate a REVETON ActionSet. */
export function revetonDefaultBuilder(
  inputs?: ActionSetBuilderInput,
): InvertedItemActionSet {
  const active = getRandomInteger(0, 1) === 0;
  let actionSet: InvertedItemActionSet | undefined;

  /** Determines the sprite & EID text red/blue color order. */
  const colorOrder: [
    typeof DeletedColor.REVETON_BLUE,
    typeof DeletedColor.REVETON_BLUE,
  ] =
    getRandomInteger(0, 1) === 0
      ? [DeletedColor.REVETON_BLUE, DeletedColor.REVETON_RED]
      : [DeletedColor.REVETON_RED, DeletedColor.REVETON_BLUE];
  const colorOrderEIDShortcut: [
    EIDColorShortcut.REVETON_BLUE | EIDColorShortcut.REVETON_RED,
    EIDColorShortcut.REVETON_BLUE | EIDColorShortcut.REVETON_RED,
  ] = [
    colorOrder[0] === DeletedColor.REVETON_BLUE
      ? EIDColorShortcut.REVETON_BLUE
      : EIDColorShortcut.REVETON_RED,
    colorOrder[1] === DeletedColor.REVETON_BLUE
      ? EIDColorShortcut.REVETON_BLUE
      : EIDColorShortcut.REVETON_RED,
  ];

  /** Generate the ActionSet using default properties. */
  actionSet = active
    ? new InvertedActiveActionSet().addEffects(
        ...generateRevetonActiveEffects(inputs, colorOrderEIDShortcut),
      )
    : new InvertedPassiveActionSet().addEffects(
        ...generateRevetonPassiveEffects(inputs, colorOrderEIDShortcut),
      );

  /** Set the name and description. */
  actionSet
    .setName(`REVETON ${active ? "ACTIVE" : "PASSIVE"}`)
    .setDescription("REVETON DESCRIPTION");

  /** Set the icon. */
  const sprite = generateRevetonCorruptedCollectibleSprite(
    actionSet,
    inputs,
    colorOrder,
  );
  actionSet.setIcon(sprite);

  return actionSet;
}

/** Effects to be added to a new REVETON InvertedPassiveActionSet. */
function generateRevetonPassiveEffects(
  _inputs?: ActionSetBuilderInput,
  colorOrder: [
    typeof EIDColorShortcut.REVETON_BLUE | typeof EIDColorShortcut.REVETON_RED,
    typeof EIDColorShortcut.REVETON_BLUE | typeof EIDColorShortcut.REVETON_RED,
  ] = [EIDColorShortcut.REVETON_BLUE, EIDColorShortcut.REVETON_RED],
): Response[] {
  return [
    new GetCollectibleResponse()
      .construct(
        getRandomCollectibleType({
          itemType: [ItemType.PASSIVE, ItemType.FAMILIAR],
        }) ?? CollectibleType.POOP,
      )
      .overrideTextColor(colorOrder[0]),
    new GetCollectibleResponse()
      .construct(
        getRandomCollectibleType({
          itemType: [ItemType.PASSIVE, ItemType.FAMILIAR],
        }) ?? CollectibleType.POOP,
      )
      .overrideTextColor(colorOrder[1]),
  ];
}

/** Effects to be added to a new REVETON InvertedActiveActionSet. */
function generateRevetonActiveEffects(
  _inputs?: ActionSetBuilderInput,
  colorOrder: [
    typeof EIDColorShortcut.REVETON_BLUE | typeof EIDColorShortcut.REVETON_RED,
    typeof EIDColorShortcut.REVETON_BLUE | typeof EIDColorShortcut.REVETON_RED,
  ] = [EIDColorShortcut.REVETON_BLUE, EIDColorShortcut.REVETON_RED],
): Response[] {
  return [
    new UseActiveItemResponse()
      .construct(
        getRandomCollectibleType({ itemType: ItemType.ACTIVE }) ??
          CollectibleType.POOP,
      )
      .overrideTextColor(colorOrder[0]),
    new UseActiveItemResponse()
      .construct(
        getRandomCollectibleType({ itemType: ItemType.ACTIVE }) ??
          CollectibleType.POOP,
      )
      .overrideTextColor(colorOrder[1]),
  ];
}

function generateRevetonCorruptedCollectibleSprite(
  actionSet: InvertedItemActionSet,
  _inputs?: ActionSetBuilderInput,
  colorOrder: [
    typeof DeletedColor.REVETON_BLUE,
    typeof DeletedColor.REVETON_BLUE,
  ] = [DeletedColor.REVETON_BLUE, DeletedColor.REVETON_RED],
): CorruptedCollectibleSprite {
  const responses = actionSet.getResponses();
  let collectibles: Array<[CollectibleType, EIDColorShortcut]> = [];

  /**
   * For passive items, filter out for 'GetCollectibleResponses'. If it is an Active item, filter
   * for 'UseActiveItemResponses'.
   */
  collectibles =
    actionSet.actionSetType === ActionSetType.INVERTED_ACTIVE_ITEM
      ? (
          responses.filter(
            (response) =>
              response.responseType === ResponseType.USE_ACTIVE_ITEM,
          ) as UseActiveItemResponse[]
        )
          .filter((response) => {
            const collectible = response.getActiveItem();
            return typeof collectible === "number";
          })
          .map((response) => {
            const collectible = response.getActiveItem();
            return [
              collectible as CollectibleType,
              response.getTextColor() ?? EIDColorShortcut.REVETON_RED,
            ];
          })
      : (
          responses.filter((response) =>
            isGetCollectibleResponse(response),
          ) as GetCollectibleResponse[]
        )
          .filter((response) => {
            const c = response.getCollectible();
            return typeof c === "number";
          })
          .map((response) => {
            const c = response.getCollectible();
            return [
              c as CollectibleType,
              response.getTextColor() ?? EIDColorShortcut.REVETON_BLUE,
            ];
          });

  /** Rearrange collectibles array to match colorOrder. */
  collectibles.sort((a, b) => {
    if (
      a[1] === EIDColorShortcut.REVETON_RED &&
      colorOrder[0] === DeletedColor.REVETON_RED
    ) {
      return -1;
    }
    if (
      a[1] === EIDColorShortcut.REVETON_BLUE &&
      colorOrder[0] === DeletedColor.REVETON_BLUE
    ) {
      return -1;
    }
    if (
      b[1] === EIDColorShortcut.REVETON_RED &&
      colorOrder[0] === DeletedColor.REVETON_RED
    ) {
      return 1;
    }
    if (
      b[1] === EIDColorShortcut.REVETON_BLUE &&
      colorOrder[0] === DeletedColor.REVETON_BLUE
    ) {
      return 1;
    }
    return 0;
  });

  const sprite: CorruptedCollectibleSprite = {
    color: collectibles.map((c) =>
      c[1] === EIDColorShortcut.REVETON_BLUE
        ? REVETONInvertedItemBlueSpriteColor
        : REVETONInvertedItemRedSpriteColor,
    ),
    collectibles: collectibles.map((c) => c[0]),
    horizontal: false,
    flipX: false,
    flipY: false,
    seed: getRandomSeed(),
  };

  return sprite;
}
