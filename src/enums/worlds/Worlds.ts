export enum World {
  /**
   * Description:
   *
   * - Connecting point of all Worlds.
   * - Every item pedestal is replaced with a World.
   *
   * Extra:
   *
   * - Backdrop and walls are shiny white marble.
   * - Airport sounds.
   * - "Lost souls" wandering between Worlds.
   */
  AIRPORT,

  /**
   * Description:
   *
   * - Pedestals are replaced with 3 - 4 pedestals of lower quality.
   * - Pickups are replaced with multiple lower quality pickups.
   *
   * Trapdoor:
   *
   * - Made of spare parts / gears.
   */
  SCRAPYARD,

  /**
   * Description:
   *
   * - Dream catcher effect atop of trapdoor.
   * - There will be a bed in the shop.
   *
   * Trapdoor:
   *
   * - Has a dream catcher effect.
   * - Looks dreamy / fades in and out.
   */
  DREAMWORLD,

  /**
   * Description:
   *
   * - Floor has three random curses.
   * - Guaranteed black candle in the super secret room.
   *
   * Trapdoor:
   *
   * - Cursed trapdoor, a few spikes.
   */
  CURSED_I,

  /**
   * Description:
   *
   * - Take half a heart damage going through the trapdoor (except if it would kill you).
   * - Guaranteed extra curse room.
   *
   * Trapdoor:
   *
   * - Consistent spikes.
   */
  CURSED_II,

  /**
   * Description:
   *
   * - Take full heart of damage going down.
   * - Every normal room is a curse room.
   * - Every normal door is also a cursed door.
   * - Spawns with 'Cotton Candyland' besides it.
   *
   * Trapdoor:
   *
   * - Multiple layers of spikes, like IT.
   */
  CURSED_III,

  /**
   * Description:
   *
   * - Half the enemies.
   * - No secret, super secret rooms.
   * -
   *
   * Trapdoor:
   *
   * - Cotton candy
   *
   * Extra:
   *
   * - This World sometimes spawns alongside other Worlds, if the "Safety Net" option is enabled.
   */
  COTTON_CANDYLAND,

  /**
   * Description:
   *
   * - Every item pedestal is replaced with 3 - 5 trinkets and 2 - 4 gulp pills.
   * - Scales with item quality.
   *
   * Trapdoor:
   *
   * - Trapdoor has a bite taken out of it.
   * - Looks sort of like a tropical 'square' lake.
   */
  PICA_PARADISE,

  /**
   * Description:
   * - Enemies and bosses are doubled.
   * - Items and pickups are doubled.
   *
   * Trapdoor:
   *
   * - Two overlapping trapdoors.
   */
  DOUBLE_TROUBLE,

  /**
   * Description:
   *
   * - Get options, options?, there's options and duality for the floor.
   * - Every trapdoor leads to the same world.
   *
   * Trapdoor:
   *
   * - Instead of a single Trapdoor, when the trapdoor spawns, it consists of four neighboring
   *   trapdoors. One has a red border and is square shaped, one has a blue border and is circle
   *   shaped, one has a yellow border and is diamond shaped, the other is purple and arch shaped,
   *   similar to the 'Card Reading' item.
   * - Red leads to the boss room.
   * - Yellow leads to the treasure room.
   * - Blue leads to the secret room.
   * - Purple leads to the shop.
   * - See play school windows for reference.
   */
  LAND_OF_ONE_THOUSAND_AND_ONE_OPTIONS,

  /**
   * Description:
   *
   * - Every item you see will be picked up.
   * - There is no enemy variation.
   * - Every trapdoor is accompanied by an alternate trapdoor.
   */
  LAND_OF_NO_OPTIONS,

  /**
   * Description:
   *
   * - Every enemy is a champion.
   * - Take a full heart of damage from all sources.
   * - Quality 1 and 0 items will be rerolled into higher quality items.
   */
  HELL,
}
