import { EntityFlag, EntityType } from "isaac-typescript-definitions";
import type { PlayerIndex } from "isaacscript-common";
import {
  VectorZero,
  arrayToBitFlags,
  copyColor,
  getPlayerIndex,
  spawnNPC,
} from "isaacscript-common";
import type { FriendlyWormType } from "../../enums/FriendlyWormType";
import { DeletedColor } from "../../enums/general/DeletedColor";
import { getRandomAccessiblePosition } from "../../helper/positionHelper";

export abstract class FriendlyWorm {
  readonly wormType!: FriendlyWormType;
  owner?: PlayerIndex;
  found?: true;

  construct(owner: EntityPlayer): EntityNPC {
    this.owner = getPlayerIndex(owner);
    return spawnNPC(
      EntityType.SMALL_MAGGOT,
      0,
      0,
      getRandomAccessiblePosition(owner.Position) ?? VectorZero,
    );
  }

  updateAppearance(npc: EntityNPC): void {
    npc.AddEntityFlags(
      arrayToBitFlags([EntityFlag.FRIENDLY, EntityFlag.PERSISTENT]),
    );
    npc.GetSprite().Color = copyColor(DeletedColor.WORM_TURQUOISE);
    npc.GetSprite().LoadGraphics();
    return undefined;
  }
}
