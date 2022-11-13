import { DamageFlag, EntityType } from "isaac-typescript-definitions";
import {
  clearSprite,
  getEnumValues,
  getRandomArrayElement,
  getRandomSeed,
  spawnNPC,
} from "isaacscript-common";
import { OnDamageAction } from "../../classes/corruption/actions/OnDamageAction";
import { SpawnNPCResponse } from "../../classes/corruption/responses/SpawnNPCResponse";
import { NPCID } from "../../enums/general/NPCID";
import { PlayerTypeCustom } from "../../enums/general/PlayerTypeCustom";
import { getRandomAccessiblePosition } from "../../helper/entityHelper";
import { mod } from "../../mod";
import { addActionsToPlayer } from "../corruption/effects/playerEffects";

/** Test player */
const player = () => Isaac.GetPlayer(0);

/** Testing variables */
const action1 = new OnDamageAction().setDamageFlag(DamageFlag.IV_BAG);
const item1 = new SpawnNPCResponse()
  .construct(NPCID.CHUBBER_PROJECTILE)
  .setAmountOfActivations(5);
action1.setResponse(item1);

/** Add all the testing commands. */
export function addTestingCommands(): void {
  mod.addConsoleCommand("del1", () => {
    testingFunction1();
  });
  mod.addConsoleCommand("del2", () => {
    testingFunction2();
  });
  mod.addConsoleCommand("del3", () => {
    testingFunction3();
  });
  mod.addConsoleCommand("del4", () => {
    testingFunction4();
  });
  mod.addConsoleCommand("del5", () => {
    testingFunction5();
  });
}

function spawnDips() {
  new SpawnNPCResponse().setNPC(NPCID.FLAMING_GAPER).trigger({});
}

/** Test stuff as the developer with command 'del'. */
export function testingFunction1(): void {
  addActionsToPlayer(player(), action1);
  print(action1.getText());
}

function renderThing(sprite: Sprite, spider: EntityNPC) {
  mod.runNextRenderFrame(() => {
    sprite.Render(Isaac.WorldToRenderPosition(spider.Position));
    sprite.Update();
    if (sprite.IsFinished(sprite.GetAnimation())) {
      sprite.PlayRandom(getRandomSeed());
    }
    renderThing(sprite, spider);
  });
}

/** Test stuff as the developer with command 'eted'. */
export function testingFunction2(): void {
  const collectible = spawnNPC(EntityType.DRIP, 0, 0, Vector(0, 0));
  const spider = spawnNPC(
    EntityType.RAINMAKER,
    0,
    0,
    getRandomAccessiblePosition(player().Position) ?? Vector(0, 0),
  );
  clearSprite(spider.GetSprite());
  const sprite = collectible.GetSprite();
  const newSprite = Sprite();
  newSprite.Load(sprite.GetFilename(), true);
  newSprite.PlayRandom(getRandomSeed());
  newSprite.PlaybackSpeed = 0.5;
  // for (let i = 0; i < newSprite.GetLayerCount() - 1; i++) { newSprite.ReplaceSpritesheet( i,
  // getCollectibleGfxFilename(collectible.SubType), ); }
  newSprite.LoadGraphics();
  collectible.Remove();
  renderThing(newSprite, spider);
}

/** Test stuff as the developer with command 'eted'. */
export function testingFunction3(): void {}

/** Test stuff as the developer with command 'eted'. */
export function testingFunction4(): void {}

/** Test stuff as the developer with command 'eted'. */
export function testingFunction5(): void {
  const customPlayerTypes = getEnumValues(PlayerTypeCustom);
  const randomPlayerType = getRandomArrayElement(customPlayerTypes);
  player().ChangePlayerType(randomPlayerType);
}
