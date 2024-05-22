/**
 * This class is for REPENTOGON, an exe-hack which expands the modding API.
 *
 * @see https://repentogon.com/index.html
 */
export interface ItemsXMLData {
  achievement?: string;
  addcostumeonpickup?: string;
  blackhearts?: string;
  bombs?: string;
  cache?:
    | "firedelay"
    | "damage"
    | "speed"
    | "range"
    | "tearcolor"
    | "tearflag"
    | "color"
    | "size"
    | "shotspeed"
    | "all"
    | "luck"
    | "flying"
    | "weapon"
    | "familiars";
  chargetype?: "normal" | "timed" | "special";
  cleareffectsonremove?: string;
  coins?: string;
  cooldown?: string;
  craftquality?: "-1" | "0" | "1" | "2" | "3" | "4";
  description: string;
  devilprice?: "1" | "2";
  gfx: string;
  gfxroot: string;
  hearts?: string;
  hidden?: string;
  id?: string;
  initcharge?: string;
  keys?: string;
  maxhearts?: string;
  name: string;
  passivecache?: string;
  persistent?: string;
  quality?: "0" | "1" | "2" | "3" | "4";
  shopprice?: string;
  sourceid: string;
  soulhearts?: string;
  special?: string;
  tags?: string;
  type: string;
  version: string;
}

/**
 * This class is for REPENTOGON, an exe-hack which expands the modding API.
 *
 * @see https://repentogon.com/index.html
 */
export interface SoundsXMLData {
  name: string;
  root: string;
  sample: Array<{
    weight: string;
    path: string;
  }>;
  sourceid: string;
}

/**
 * This class is for REPENTOGON, an exe-hack which expands the modding API.
 *
 * @see https://repentogon.com/index.html
 */
export interface PlayersXMLData {
  achievement?: string;
  armor?: string;
  birthright?: string;
  black?: string;
  blackheart?: string;
  bonehearts?: string;
  bombs?: string;
  broken?: string;
  brokenhearts?: string;
  bskinparent?: string;
  canshoot?: string;
  card?: string;
  coins?: string;
  completionparent?: string;
  costume?: string;
  costumesuffix?: string;
  damagemodifier?: string;
  eternalheart?: string;
  extraportrait?: string;
  firedelaymodifier?: string;
  gigabombs?: string;
  goldenhearts?: string;
  healthlimit?: string;
  healthtype?: string;
  heartcontainers?: string;
  hidden?: string;
  hp?: string;
  items?: string;
  keys?: string;
  luckmodifier?: string;
  modcostume?: string;
  name: string;
  nameimage?: string;
  nameimageroot: string;
  nomarks?: string;
  pocketactive?: string;
  portrait?: string;
  portraitroot: string;
  rangemodifier?: string;
  redhearts?: string;
  root: string;
  rottenhearts?: string;
  shotspeedmodifier?: string;
  skin?: string;
  skincolor?: string;
  soulhearts?: string;
  sourceid: string;
  speedmodifier?: string;
  trinket?: string;
  untranslatedbirthright?: string;
  untranslatedname?: string;
}

/**
 * This class is for REPENTOGON, an exe-hack which expands the modding API.
 *
 * @see https://repentogon.com/index.html
 */
export interface AchievementsXMLData {
  gfx: string;
  gfxback?: string;
  gfxroot: string;
  hidden?: string;
  id: string;
  name?: string;
  sourceid: string;
  steam_description?: string;
  steam_icon?: string;
  steam_name?: string;
  text: string;
}

/**
 * This class is for REPENTOGON, an exe-hack which expands the modding API.
 *
 * @see https://repentogon.com/index.html
 */
export interface BackdropsXMLData {
  bridge?: string;
  door?: string;
  effectsgfxroot?: string;
  floors?: string;
  floorvariants?: string;
  gfx?: string;
  gfxroot: string;
  holeinwall?: string;
  id?: string;
  lfloorgfx?: string;
  name?: string;
  nfloorgfx?: string;
  pit?: string;
  props?: string;
  reftype?: string;
  reversewatergfx?: string;
  rocks?: string;
  sourceid: string;
  spikes?: string;
  walls?: string;
  wallvariants?: string;
  watergfx?: string;
  waterpit?: string;
  waterpitsmode?: string;
}

/**
 * This class is for REPENTOGON, an exe-hack which expands the modding API.
 *
 * @see https://repentogon.com/index.html
 */
export interface CursesXMLData {
  id: string;
  name?: string;
  sourceid: string;
  sourcepath?: string;
  relativeid?: string;
  untranslatedname?: string;
}

/**
 * This class is for REPENTOGON, an exe-hack which expands the modding API.
 *
 * @see https://repentogon.com/index.html
 */
export interface WispsXMLData {
  canshoot?: string;
  corecolor?: string;
  coregfx?: string;
  count?: string;
  damage?: string;
  damagemultiplier2?: string;
  firedelay?: string;
  flamecolor?: string;
  gfxroot: string;
  hp?: string;
  id: string;
  layer?: string;
  name?: string;
  priority?: string;
  procchance?: string;
  relativeid?: string;
  shotspeed?: string;
  sourceid: string;
  tearcolor?: string;
  tearcolor2?: string;
  tearflags?: string;
  tearflags2?: string;
  tearscale?: string;
  tearscale2?: string;
  tearvariant?: string;
}

/**
 * This class is for REPENTOGON, an exe-hack which expands the modding API.
 *
 * @see https://repentogon.com/index.html
 */
export interface Costumes2XMLData {
  anm2path?: string;
  forcebodycolor?: string;
  forceheadcolor?: string;
  hasoverlay?: string;
  hasskinalt?: string;
  id: string;
  isflying?: string;
  name?: string;
  overwritecolor?: string;
  priority?: string;
  relativeid?: string;
  skincolor?: string;
  sourceid: string;
  type?: string;
}

/**
 * This class is for REPENTOGON, an exe-hack which expands the modding API.
 *
 * @see https://repentogon.com/index.html
 */
export interface MusicXMLData {
  id: string;
  intro?: string;
  layer?: string;
  layerfadespeed?: string;
  layerintro?: string;
  layermode?: string;
  layermul?: string;
  loop?: string;
  mul?: string;
  name: string;
  path?: string;
  root?: string;
  sourceid: string;
}
