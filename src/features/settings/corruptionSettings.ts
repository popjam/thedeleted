import {
  DefaultMap,
  defaultMapGetPlayer,
  defaultMapSetPlayer,
  PlayerIndex,
  saveDataManager,
} from "isaacscript-common";
import { CorruptionDNA } from "../../interfaces/corruption/CorruptionDNA";

const v = {
  run: {
    /** CorruptionDNA setting influences corrupted effect generation. */
    corruptionDNA: new DefaultMap<PlayerIndex, CorruptionDNA>(() => ({})),
  },
};

export function corruptionDNASettingInit(): void {
  saveDataManager("corruptionDNASetting", v);
}

/** Get (and set if undefined) the players' CorruptionDNA setting. */
export function getCorruptionDNASetting(player: EntityPlayer): CorruptionDNA {
  return defaultMapGetPlayer(v.run.corruptionDNA, player);
}

/** Set the players' CorruptionDNA setting. */
export function setCorruptionDNASetting(
  player: EntityPlayer,
  corruptionDNA: CorruptionDNA,
): void {
  defaultMapSetPlayer(v.run.corruptionDNA, player, corruptionDNA);
}
