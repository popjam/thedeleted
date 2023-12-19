/** References a player entry from players.xml. */
export interface PlayerXML {
  _attr: {
    name: string;
    skin: string;
    skinColor: string;
    nameimage: string;
    portrait: string;
    extraportrait?: string;
    hp?: string;
    armor?: string;
    black?: string;
    items?: string;
    trinket?: string;
    costume?: string;
    costumeSuffix?: string;
    bombs?: string;
    keys?: string;
    coins?: string;
    card?: string;
    pill?: string;
    canShoot?: string;
    achievement?: string;
    broken?: string;
    pocketActive?: string;
    birthright?: string;
    bSkinParent?: string;
    hidden?: string;
  };
}

/** References players.xml. */
export type PlayersXML = PlayerXML[];
