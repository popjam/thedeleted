import { FriendlyWormType } from "../../enums/FriendlyWormType";
import { FriendlyWorm } from "./FriendlyWorm";

export class LevelOneWorm extends FriendlyWorm {
  override wormType = FriendlyWormType.LEVEL_ONE_WORM;
}
