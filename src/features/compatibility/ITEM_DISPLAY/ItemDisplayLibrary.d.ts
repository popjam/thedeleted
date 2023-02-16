import { CollectibleType } from "isaac-typescript-definitions";

declare global {
  const CCO: CCOInterface;

  interface CCOInterface {
    ItemDisplay: {
      API: ItemDisplayLibraryInterface;
    };
  }

  interface ItemDisplayLibraryInterface {
    queueItemDisplay(
      this: void,
      player: EntityPlayer,
      item: CollectibleType,
    ): void;
  }
}
