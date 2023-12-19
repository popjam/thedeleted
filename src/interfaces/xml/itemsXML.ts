/** Can be referencing a Trinket, Active, Passive or Familiar. */
export interface ItemXML {
  _attr: {
    id?: string;
    cache?: string;
    name: string;
    description: string;
    gfx: string;
    tags?: string;
    bombs?: string;
    keys?: string;
    coins?: string;
    hearts?: string;
    soulhearts?: string;
    blackhearts?: string;
    maxhearts?: string;
    chargetype?: "normal" | "timed" | "special";
    cooldown?: string;
    passivecache?: "true" | "false";
    special?: "true" | "false";
    initcharge?: string;
    devilprice?: "1" | "2";
    shopprice?: string;
    addcostumeonpickup?: "true" | "false";
    persistent?: "true" | "false";
    achievement?: string;
    quality?: "0" | "1" | "2" | "3" | "4";
    craftquality?: "-1" | "0" | "1" | "2" | "3" | "4";
    hidden?: "true" | "false";
    cleareffectsonremove?: "true" | "false";
  };
}

/** Interface for lua transcription of items.xml file. */
export interface ItemsXML {
  _attr: {
    deathanm2: string;
    gfxroot: string;
    version: string;
  };
  passive?: ItemXML[];
  active?: ItemXML[];
  familiar?: ItemXML[];
  trinket?: ItemXML[];
}
