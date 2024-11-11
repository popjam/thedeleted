/** Both Normal-Deleted and Tainted-Deleted's modes. */
export enum Mode {
  // Deleted Modes.

  /**
   * Based off 'Happy99' virus. Starts with Bitflip, corrupted items have positive and negative
   * effects and negative effects persist after inversion.
   *
   * Features:
   *  - Bitflip. Corrupted items have positive and negative effects. (done)
   *  - Negative effects persist after inversion.
   *  - Fireworks on death. Custom fireworks to reduce lag (?).
   *
   * Secret:
   * - Waiting for the timer to hit 2000 (reference to Y2K bug).
   *
   * Birthright:
   * - Removes negative effects passing through inversion.
   *
   * Alternate:
   * - Flipbit, flips Happy99's inversion upon being fully charged (4 charges). Items are not
   *   flipped upon Flipbit activating. Can not use flipbit normally.
   */
  HAPPY_99,

  /**
   * Based off 'ILOVEYOU' virus. Starts with Bitflip, corrupted items have only positive effects.
   *
   * Features:
   *  - Bitflip. Corrupted items have positive effects.
   *  - Kiss sound upon hitting an enemy, also charms them.
   *  - Upon getting hurt, releases a purely visual heart effect that imitates the 'Periscope' app.
   *  - Hearts have different colors, but are generally shades of pink.
   *  - Heart color has a secret effect (?).
   *  - Upon death, sighs.
   *
   * Birthright:
   * - Picking up a corrupted item heals you.
   */
  ILOVEYOU,

  /**
   * Based off 'Morris' worm. Starts with D-14, corrupts items for one room. Corrupted items have
   * positive and negative effects.
   *
   * Features:
   *  - D-14, corrupts items for one room. Corrupted items have positive and negative effects.
   *  - Starts with worm friend that evolves each floor if it survives.
   *
   * Secret:
   * - Worm buddy.
   * - Alternate D-14s based on different modes.
   * - Taking Worm buddy to end unlocks Morris II.
   *
   * Birthright:
   * - Picking up a corrupted item has a 14% chance to duplicate it, otherwise it spawns a worm
   *   friend.
   */
  MORRIS,

  /**
   * Based off zip bombs. Starts with Extract, which rerolls items while adding a negative effect
   * (and carrying through previous negative effects).
   *
   * Features:
   * - Extract, rerolls items while adding a negative effect.
   * - Extract also blows up the nearest pickup.
   * - Extracting an item too much will cause it to become unstable and explode.
   * - 'Extract a shop' easter egg.
   * - Can't pick up bombs (but can explode them).
   * - Starts with 10 bombs.
   *
   * Secret:
   * - Extracting a shop.
   *
   * Birthright:
   * - +25 bombs. Items are more stable.
   */
  ZIPBOMBER,

  /**
   * Based off 'CryptoLocker' ransomware. Starts with Bitflip. Is stuck in the inverted world.
   * Corrupted items have been 'encrypted' and have their descriptions obfuscated. However, there is
   * still various amounts of information that can be gathered from the item description, as only
   * certain words or phrases are encrypted.
   *
   * Example:
   * - Every 3 sdGVkX1+v, gain B0K1Y96Qsv.
   * - Upon taking damage, kwB0K1Y96Qsv2Lm+31cmzaA or 2FsdGV.
   *
   * Features:
   * - Starts with Bitflip.
   * - Stuck in the inverted world.
   * - Corrupted items have been 'encrypted' and have their descriptions obfuscated.
   * - Corrupted items provide a random damage bonus or a key.
   *
   * Birthright:
   * - Corrupted item bonuses are revealed before pickup.
   */
  CRYPTOLOCKER,

  /**
   * Based off 'Spywiper' virus. Starts with Clean, which un-corrupts items in the room. Is stuck in
   * the inverted world.
   *
   * Features:
   * - Clean, un-corrupts items in the room.
   * - Stuck in the inverted world.
   * - Using clean on non-corrupted items turns them into holy water. Using clean on non-corrupted
   *   holy water turns it into 'holier water'. Using clean on 'holier water' turns it into 'holiest
   *   water'. Test.
   */
  SPYWIPER,

  /**
   * Based off 'Jerusalem' virus. Starts with random stats, items, trinkets, hearts, pickups,
   * similar to Eden.
   *
   * Features:
   * - Random stats, items, trinkets, hearts, pickups, similar to Eden.
   * - Starts in the non-inverted world.
   * - Costs bit to play as.
   *
   * Birthright:
   * - Random corrupted item.
   *
   * Random:
   * - Random corrupted pocket item.
   * - 1/2 to 12 hearts of random types.
   * - Random consumables. (e.g 0 bombs, 2 keys, 1 coin).
   * - Random stats.
   * - Random trinket, gulped trinket, passives, card, etc.
   */
  JERUSALEM,

  /**
   * Based off the 'Hicurdismos' virus. Starts with Bitflip, and three soul hearts. You can not pick
   * up health in this game mode, instead using corrupted items to heal.
   *
   * Features:
   * - Bitflip.
   * - Corrupted items are more powerful.
   * - Can not pick up health.
   * - Corrupted items heal you, each negative effect heals you for 1/2 a soul heart.
   * - Soul hearts = Blue spider.
   * - Red hearts = Blue flies.
   * - Black hearts = Friendly dip (blue dip?).
   * - Bone hearts = Mini-isaacs.
   * - Eternal hearts = ?.
   * - Broken hearts = ?.
   *
   * Birthright:
   * - Corrupted items have more negative effects.
   */
  HICURDISMOS,

  /** Custom mode maker. */
  VCS,

  /**
   * Based off 'MEMZ' virus. Starts as a random Deleted mode, but changes every floor.
   *
   * Features:
   * - Starts as a random Deleted mode, but changes every floor.
   * - First mode is not known until exiting the first room.
   * - Indicator of next mode.
   *
   * Birthright:
   * - Can see the next mode.
   *
   * Secret:
   * - Nyan cat can be heard standing in certain position.
   *
   * Alternate:
   * - Starts as a random Deleted mode, but changes every room.
   * - Starts as a random non-Deleted character, but changes every floor.
   * - Starts as a random non-Deleted character, but changes every room. Going into past rooms
   *   changes the character back to the character that was in that room.
   * - Starts as a random non-Deleted character, but changes every X seconds, where X gets lower
   *   every floor.
   * - Starts as a random non-Deleted character, but changes every second.
   * - On getting hit, changes character.
   */
  MEMZ,

  /**
   * Based off 'Mydoom' virus. Is stuck in the inverted world, and inverted items have the effects
   * of trinkets.
   *
   * Features:
   * - Stuck in the inverted world.
   * - Inverted items have the effects of trinkets.
   * - MyDoom eye, instantly kills every enemy in the room and un-corrupts items. Has three stages
   *   of degradation, and upon fully degrading, it is removed and the player is given an array of
   *   negative effects.
   * - Corrupted items are amalgamations of the trinkets they hold.
   *
   * Birthright:
   * - Refreshes the MyDoom eye.
   *
   * Alternate:
   * - Golden MyDoomEye. Never degrades, but gives a negative effect upon use.
   */
  MYDOOM,

  /**
   * Based off 'Reveton' ransomware. Starts with 'Unlock'.
   *
   * Features:
   * - Stuck in the inverted world.
   * - Inverted items are combinations of 2 items (you get both).
   * - Upon picking up one, the player loses a random item they have.
   * - Unlock brings back all lost items, but costs $ per second to use (items4hire).
   * - Hybrid active items.
   * - Chance of hybrid red/blue hybrid enemy.
   *
   * Birthright:
   * - Lost item is known beforehand.
   */
  REVETON,

  /** Based off 'WannaCry' ransomware. Starts with 'Decrypt'. */
  WANNACRY,

  /**
   * Based off 'MyLife' worm, and also 'The Stranger' character.
   *
   * Features:
   * - Upon choosing MyLife, the player is given 3 options of randomly generated characters to play
   *   as (similar to The Stranger). They resemble internet profiles, have a random name, age, sex,
   *   personality traits, items, etc.
   * - Characters have custom positive modifiers, "Jobs", that give them a unique ability or item.
   * - Characters have custom negative modifiers, "Conditions", that give them a unique negative
   *   effect.
   */
  MYLIFE,

  /**
   * Based on 'Code Red' virus.
   *
   * Features:
   * - Isaac switches between 'Code Red' and 'Code Green', code red being the virus and code green
   *   being the antivirus.
   * - In code red, isaac is in the corrupted world, and in code green, isaac is in the
   *   non-corrupted world.
   * - Picking up 4 items will switch isaac to the other world.
   * - Corrupted effects do not carry through to code green.
   * - Code red world is glitched.
   * - Code red corrupted items have split positive and negative effects.
   * - Alternate idea is to have items always be non-corrupted, but in code green, they come with
   *   one positive effect, and in code red, they come with one negative effect. The negative
   *   effects only apply in code red, and the positive effects only apply in code green. The items
   *   are the same in both worlds. Alternatively, items come with one positive and one negative
   *   effect, but they only apply in their respective worlds. Active items would do positive /
   *   negative effects in code green / code red respectively.
   * - Another idea is to have only the responses be different, e.g 'Every 3 rooms, gain a soul
   *   heart (code green) / lose a soul heart (code red)'. Color coordinated.
   */
  CODE_RED,

  /**
   * Based off 'Dozer' trojan.
   *
   * Features:
   * - Clock-based gameplay.
   * - "Dreams" that are similar to WarioWare microgames. Can't get hurt in these.
   * - "Nightmares" that are similar to WarioWare microgames, but negative.
   * - Dreams/Nightmares transport Isaac to a different room, as his base self.
   * - Dreams are rated out of 3 stars upon completion, reference to apps like Cut the Rope.
   * - Isaac can die in a nightmare, but not dreams.
   * - "Star Shop", alternate currency 'Stars'.
   * - Overclock pocket item.
   * - 'Falling asleep' mechanic.
   *
   * Secret:
   * - Dreamception.
   */
  DOZER,

  /**
   * Based off 'Casino' virus.
   *
   * Features:
   * - Starts with Select Tool / Cut and paste your losses.
   * - Select an area with Jackpot (similar to the Windows desktop highlight). Once an area is
   *   selected, 50% chance for everything inside to be duplicated, 50% chance for everything inside
   *   to be deleted.
   * - Touching pedestal breaks it into 'chips'. Various types of 'chips' that are essentially
   *   consumables that offer random choices. One of the chips will always be a chip that can obtain
   *   the item that was broken. This feature is similar to tainted Cain's crafting.
   *
   * Secret:
   * - Select Tool on trapdoor unlocks Dreamworld and secret floor.
   */
  CASINO,

  /**
   * Based off 'Bagle' worm.
   *
   * Features:
   * - Everything is randomized.
   * - NPCs are randomized. At the start of the game, each NPC is assigned to another NPC. When an
   *   NPC spawns, the assigned NPC will spawn instead, borrowing the original NPC's health,
   *   champion status, status effects, size, etc.
   * - Item pools are randomized.
   *
   * Secret:
   * -
   */
  BAGLE,

  /**
   * Based off 'Dreamworld' failed game.
   *
   * Features:
   * - Every trapdoor spawned leads to a random 'World'.
   * - Worlds are similar to floors / chapters, but usually fundamentally change the game's logic
   *   and mechanics in one way or another. There are a large amount of worlds, possible due to not
   *   being 'fully fledged' floors with unique enemies and graphics.
   * - Starts with 'Shovelware', an 8 room charge pocket item that spawns a trapdoor, increasing the
   *   amount of world options.
   *
   * Secret:
   * -
   */
  DREAMWORLD,

  /** Based off a JS Trojan 'YouAreAnIdiot'. */
  YOUAREANIDIOT,

  // T. Deleted.

  /**
   * Based off 'SOPHOS' virus. Standard tainted deleted mode.
   *
   * Features:
   * - Starts with TMTRAINER.
   * - Has 'Trash' item, which can trash previous passive item for consumables or active item for a
   *   random stat.
   *
   * Birthright:
   * - Trashing passive items gives stats.
   */
  SOPHOS,

  /**
   * Based off 'BattleEye' anti-cheat.
   *
   * Features:
   * - 'Anti-cheat' system that detects for game-breaking TMTRAINER items.
   */
  BATTLEYE,
}
