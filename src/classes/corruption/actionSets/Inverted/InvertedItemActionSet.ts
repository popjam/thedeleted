import type { ActiveSlot, CollectibleType } from "isaac-typescript-definitions";
import type { PickingUpItemCollectible } from "isaacscript-common";
import { ColorDefault, game, isColor } from "isaacscript-common";
import {
  DEFAULT_CORRUPTED_SOUND_EFFECT_AMOUNT,
  DEFAULT_CORRUPTED_SOUND_EFFECT_LENGTH,
} from "../../../../constants/corruptionConstants";
import { MOD_NAME } from "../../../../constants/mod/modConstants";
import { _invertedPickupHasBeenSeen } from "../../../../features/corruption/inversion/seenInvertedPickups";
import { getAdvancedInvertedItemIconSetting } from "../../../../features/settings/GeneralSettings";
import { setSpecificEntityEIDDescriptionObject } from "../../../../helper/compatibility/EIDHelper";
import {
  generateCorruptedSound,
  playCorruptedSound,
} from "../../../../helper/deletedSpecific/funnySounds";
import { generateCorruptedCollectibleSprite } from "../../../../helper/deletedSpecific/funnySprites";
import { fprint } from "../../../../helper/printHelper";
import { legibleString } from "../../../../helper/stringHelper";
import type { CorruptedCollectibleSprite } from "../../../../interfaces/corruption/funny/CorruptedCollectibleSprite";
import type { CorruptedSoundEffect } from "../../../../interfaces/corruption/funny/CorruptedSoundEffect";
import { replaceCollectibleSpriteWithCorrupted } from "../../../facets/CorruptedCollectibleSpriteFacet";
import { overridePickupAnimationWithCustomSprite } from "../../../facets/RenderOverHeadFacet";
import { ActionSet } from "../ActionSet";

const DEFAULT_QUALITY = 0;
const DEFAULT_DESCRIPTION = "Beware...";
const DEFAULT_NAME = "Corrupted Item";

/** ActionSet class for Inverted Items. */
export abstract class InvertedItemActionSet extends ActionSet {
  q?: number;
  d?: string;
  n?: string;
  ic?: CorruptedCollectibleSprite;
  sfx?: CorruptedSoundEffect;

  // Attributes.

  /** The Origin Item, which CollectibleType the ActionSet resides on. */
  oi?: CollectibleType;

  /** Negatives carry over. */
  ngo?: boolean;

  /**
   * If this is not undefined, negative effects will carry over to the non-inverted pedestal the
   * first time that the pedestal changes from inverted -> non-inverted.
   */
  getNegativesCarryOver(): boolean {
    return this.ngo ?? false;
  }

  setNegativesCarryOver(negativesCarryOver: boolean): this {
    this.ngo = negativesCarryOver;
    return this;
  }

  /**
   * The sound effect that will be played upon picking up the corrupted item. If the corrupted item
   * is also an Active item, using the Active item will also play the sound effect.
   *
   * If no sound effect exists, generates a new default one.
   */
  getSoundEffect(): CorruptedSoundEffect {
    return this.sfx ?? this.generateSoundEffect();
  }

  /**
   * The sound effect that will be played upon picking up the corrupted item. If the corrupted item
   * is also an Active item, using the Active item will also play the sound effect.
   */
  setSoundEffect(soundEffect: CorruptedSoundEffect): this {
    this.sfx = soundEffect;
    return this;
  }

  /** Generates a new sound effect for the ActionSet. */
  generateSoundEffect(): CorruptedSoundEffect {
    this.sfx = generateCorruptedSound(
      DEFAULT_CORRUPTED_SOUND_EFFECT_AMOUNT,
      DEFAULT_CORRUPTED_SOUND_EFFECT_LENGTH,
    );
    return this.sfx;
  }

  /**
   * Plays the sound effect of the corrupted item. If a sound effect is not set yet, it will
   * generate and set a random default one and play it.
   */
  playSoundEffect(): void {
    const soundEffect = this.getSoundEffect();
    playCorruptedSound(soundEffect);
  }

  /** Will generate an Icon if none exists. */
  getIcon(): CorruptedCollectibleSprite {
    return this.ic ?? this.generateIcon();
  }

  // TODO.
  generateIcon(): CorruptedCollectibleSprite {
    const advancedIconSetting = getAdvancedInvertedItemIconSetting();
    this.ic = advancedIconSetting
      ? generateCorruptedCollectibleSprite()
      : generateCorruptedCollectibleSprite();
    return this.ic;
  }

  /** Depending on the Icon form, does the relevant actions. If no icon exist, will generate one. */
  updateIcon(pickup: EntityPickup): void {
    const icon = this.getIcon();
    if (isColor(icon)) {
      const sprite = pickup.GetSprite();
      sprite.Color = icon;
      sprite.FlipX = true;
    } else {
      replaceCollectibleSpriteWithCorrupted(pickup as EntityPickupCollectible, {
        ...icon,
      });
    }
  }

  setIcon(icon: CorruptedCollectibleSprite): this {
    this.ic = icon;
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

  /** Get the description of the corrupted item. */
  getDescription(): string {
    return this.d ?? DEFAULT_DESCRIPTION;
  }

  /** Set the description of the corrupted item. */
  setDescription(description: string): this {
    this.d = description;
    return this;
  }

  getQuality(): number {
    return this.q ?? DEFAULT_QUALITY;
  }

  setQuality(quality: number): this {
    this.q = quality;
    return this;
  }

  /** Updates the EID Description and appearance of the collectible. */
  updateAppearance(collectible: EntityPickupCollectible): void {
    fprint(`Updating appearance of inverted item ${this.getName()}.`);
    this.updateIcon(collectible);

    /** When the pedestal is updating appearance, register it as being seen. */
    _invertedPickupHasBeenSeen(collectible);

    const descObj = {
      Description: legibleString(this.getText()),
      Name: this.getName(),
      ModName: MOD_NAME,
      Quality: this.getQuality(),
    };
    setSpecificEntityEIDDescriptionObject(collectible, descObj);
  }

  abstract addToPlayer(
    player: EntityPlayer,
    collectible: CollectibleType,
    addLogo: boolean,
    addToInventory: boolean,
    slot?: ActiveSlot,
  ): void;

  abstract removeFromPlayer(
    player: EntityPlayer,
    collectible: CollectibleType,
    removeLogo: boolean,
    removeFromInventory: boolean,
  ): void;

  abstract preGetPedestal(
    player: EntityPlayer,
    pedestal: EntityPickupCollectible,
  ): boolean | undefined;

  prePickupCollectible(
    player: EntityPlayer,
    _collectible: PickingUpItemCollectible,
  ): void {
    this.playSoundEffect();
    game.GetHUD().ShowItemText(this.getName(), this.getDescription());
    const icon = this.getIcon();
    if (isColor(icon)) {
    } else {
      overridePickupAnimationWithCustomSprite(player, icon);
    }

    fprint(`  Picked up inverted item ${this.getName()}.
    With Description: ${this.getDescription()}`);

    return undefined;
  }
}
