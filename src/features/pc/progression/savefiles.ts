import { mod } from "../../../mod";
import { PlayerTypeCustom } from "../../../enums/general/PlayerTypeCustom";
import type { CompletionMarkType } from "isaac-typescript-definitions-repentogon";
import { SaveFileType } from "../../../enums/progression/SaveFileType";
import type { PlayerType } from "isaac-typescript-definitions";

interface SaveFileCharacterData {
  faceCompletionMarks: boolean;
  faceSecrets: boolean;
  faceWinStreak: boolean;
  winStreak: number;
  completedMarks: Set<CompletionMarkType>;
  unlocked: boolean;
}

interface SaveFileData {
  characterData: Map<PlayerType, SaveFileCharacterData>;
}

const v = {
  persistent: {
    saveFileNormal: undefined as SaveFileData | undefined,
    saveFileHard: undefined as SaveFileData | undefined,
    saveFileImpossible: undefined as SaveFileData | undefined,
  },
};

export function saveFilesInit(): void {
  mod.saveDataManager("saveFiles", v);
}

export function resetSaveFiles(): void {
  v.persistent.saveFileNormal = undefined;
  v.persistent.saveFileHard = undefined;
  v.persistent.saveFileImpossible = undefined;
}

/**
 * Retrieves the save file data based on the specified save file type. If the save file data does
 * not exist, it generates a default save file data.
 *
 * @param saveFileType The type of save file to retrieve.
 * @returns The save file data corresponding to the specified save file type.
 */
export function getSaveFileData(saveFileType: SaveFileType): SaveFileData {
  switch (saveFileType) {
    case SaveFileType.NORMAL: {
      if (v.persistent.saveFileNormal === undefined) {
        v.persistent.saveFileNormal = generateDefaultSaveFileData();
      }
      return v.persistent.saveFileNormal;
    }

    case SaveFileType.HARD: {
      if (v.persistent.saveFileHard === undefined) {
        v.persistent.saveFileHard = generateDefaultSaveFileData();
      }
      return v.persistent.saveFileHard;
    }

    case SaveFileType.IMPOSSIBLE: {
      if (v.persistent.saveFileImpossible === undefined) {
        v.persistent.saveFileImpossible = generateDefaultSaveFileData();
      }
      return v.persistent.saveFileImpossible;
    }
  }
}

function generateDefaultSaveFileCharacterData(): SaveFileCharacterData {
  return {
    faceCompletionMarks: false,
    faceSecrets: false,
    faceWinStreak: false,
    winStreak: 0,
    completedMarks: new Set<CompletionMarkType>(),
    unlocked: false,
  };
}

function generateDefaultSaveFileData(): SaveFileData {
  const newSaveFileData = {} as SaveFileData;
  newSaveFileData.characterData = new Map<PlayerType, SaveFileCharacterData>();

  /** Initialize player save data for each Deleted. */
  for (const playerType of Object.values(PlayerTypeCustom)) {
    newSaveFileData.characterData.set(
      playerType,
      generateDefaultSaveFileCharacterData(),
    );
  }
  return newSaveFileData;
}
