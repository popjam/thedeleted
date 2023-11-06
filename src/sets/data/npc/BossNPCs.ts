import { NPCID } from "../../../enums/general/ID/NPCID";

/** Set of non-modded NPCs that are considered bosses. */
// export const BOSS_NPCS: ReadonlySet<NPCID> = new Set([ NPCID.THE_WIDOW, NPCID.THE_WIDOW_BLACK,
// NPCID.THE_WIDOW_PINK, NPCID.THE_WRETCHED, NPCID.DADDY_LONG_LEGS, NPCID.TRIACHNID, NPCID.ISAAC,
// NPCID.BLUE_BABY, NPCID.BLUE_BABY_HUSH, NPCID.DEAD_ISAAC, NPCID.LARRY_JR, NPCID.LARRY_JR_GREEN,
// NPCID.LARRY_JR_BLUE, NPCID.THE_HOLLOW, NPCID.THE_HOLLOW_GREEN, NPCID.THE_HOLLOW_BLACK,
// NPCID.THE_HOLLOW_YELLOW, NPCID.TUFF_TWIN, NPCID.THE_SHELL, NPCID.MONSTRO, NPCID.MONSTRO_RED,
// NPCID.MONSTRO_GREY, NPCID.GURGLING_BOSS, NPCID.GURGLING_BOSS_YELLOW, NPCID.GURGLING_BOSS_BLACK,
// NPCID.TURDLING, NPCID.THE_HAUNT, NPCID.THE_HAUNT_BLACK, NPCID.THE_HAUNT_PINK, NPCID.DINGLE,
// NPCID.DINGLE_RED, NPCID.DINGLE_BLACK, NPCID.DANGLE, NPCID.MEGA_MAW, NPCID.MEGA_MAW_RED,
// NPCID.MEGA_MAW_BLACK, NPCID.THE_GATE, NPCID.THE_GATE_RED, NPCID.THE_GATE_BLACK, NPCID.MEGA_FATTY,
// NPCID.MEGA_FATTY_RED, NPCID.MEGA_FATTY_BROWN, NPCID.THE_CAGE, NPCID.THE_CAGE_GREEN,
// NPCID.THE_CAGE_PINK, NPCID.MAMA_GURDY, NPCID.MAMA_GURDY_LEFT_HAND, NPCID.MAMA_GURDY_RIGHT_HAND,
// NPCID.DARK_ONE, NPCID.THE_ADVERSARY, NPCID.POLYCEPHALUS, NPCID.POLYCEPHALUS_RED,
// NPCID.POLYCEPHALUS_PINK, NPCID.THE_PILE, NPCID.MR_FRED, NPCID.URIEL, NPCID.URIEL_FALLEN,
// NPCID.GABRIEL, NPCID.GABRIEL_FALLEN, NPCID.THE_LAMB, NPCID.THE_LAMB_BODY, NPCID.MEGA_SATAN,
// NPCID.MEGA_SATAN_RIGHT_HAND, NPCID.MEGA_SATAN_LEFT_HAND, NPCID.MEGA_SATAN_2,
// NPCID.MEGA_SATAN_2_RIGHT_HAND, NPCID.MEGA_SATAN_2_LEFT_HAND, NPCID.CHUB, NPCID.CHUB_BLUE,
// NPCID.CHUB_ORANGE, NPCID.CHAD, NPCID.CARRION_QUEEN, NPCID.CARRION_QUEEN_PINK, NPCID.ULTRA_DOOR,
// NPCID.GURDY, NPCID.GURDY_GREEN, NPCID.ULTRA_PRIDE_BABY, NPCID.THE_STAIN, NPCID.THE_STAIN_GREY,
// NPCID.BROWNIE, NPCID.BROWNIE_BLACK, NPCID.THE_FORSAKEN, NPCID.THE_FORSAKEN_BLACK,
// NPCID.LITTLE_HORN, NPCID.LITTLE_HORN_ORANGE, NPCID.LITTLE_HORN_BLACK, NPCID.RAG_MAN,
// NPCID.RAG_MAN_RED, NPCID.RAG_MAN_BLACK, NPCID.ULTRA_GREED, NPCID.ULTRA_GREEDIER, NPCID.HUSH,
// NPCID.HUSH_SKINLESS, NPCID.RAG_MEGA, NPCID.SISTERS_VIS, NPCID.BIG_HORN, NPCID.SMALL_HOLE,
// NPCID.BIG_HOLE, NPCID.DELIRIUM, NPCID.THE_MATRIARCH, NPCID.MONSTRO_2, NPCID.MONSTRO_2_RED,
// NPCID.GISH, NPCID.MOM, NPCID.MOM_BLUE, NPCID.MOM_RED, NPCID.MOM_STOMP, NPCID.MOM_STOMP_BLUE,
// NPCID.MOM_STOMP_RED, NPCID.SLOTH, NPCID.SUPER_SLOTH, NPCID.ULTRA_PRIDE, NPCID.WRATH, NPCID.WRATH,
// NPCID.SUPER_WRATH, NPCID.SUPER_WRATH, NPCID.GLUTTONY, NPCID.GLUTTONY, NPCID.SUPER_GLUTTONY,
// NPCID.SUPER_GLUTTONY, NPCID.ENVY_BIG, NPCID.SUPER_ENVY_BIG, NPCID.ENVY_MEDIUM,
// NPCID.SUPER_ENVY_MEDIUM, NPCID.ENVY_SMALL, NPCID.SUPER_ENVY_SMALL, NPCID.PRIDE,
// NPCID.SUPER_PRIDE, NPCID.PIN, NPCID.PIN_GREY, NPCID.SCOLEX, NPCID.FRAIL, NPCID.FRAIL_BLACK,
// NPCID.WORMWOOD, NPCID.WAR, NPCID.WAR, NPCID.WAR, NPCID.PESTILENCE_GREY, NPCID.PESTILENCE_GREY,
// NPCID.PESTILENCE_GREY, NPCID.CONQUEST, NPCID.WAR_WITHOUT_HORSE, NPCID.DEATH, NPCID.DEATH_BLACK,
// NPCID.DEATH_HORSE, NPCID.DEATH_HORSE_BLACK, NPCID.DEATH_WITHOUT_HORSE,
// NPCID.DEATH_WITHOUT_HORSE_BLACK, NPCID.DUKE_OF_FLIES, NPCID.DUKE_OF_FLIES_GREEN,
// NPCID.DUKE_OF_FLIES_ORANGE, NPCID.THE_HUSK, NPCID.THE_HUSK_BLACK, NPCID.THE_HUSK_RED, NPCID.PEEP,
// NPCID.PEEP_YELLOW, NPCID.PEEP_CYAN, NPCID.BLOAT, NPCID.BLOAT_GREEN, NPCID.LOKI, NPCID.LOKII,
// NPCID.FISTULA_BIG, NPCID.FISTULA_BIG_GREY, NPCID.TERATOMA, NPCID.FISTULA_MEDIUM,
// NPCID.FISTULA_MEDIUM_GREY, NPCID.FISTULA_SMALL, NPCID.FISTULA_SMALL_GREY, NPCID.BLASTOCYST_BIG,
// NPCID.BLASTOCYST_MEDIUM, NPCID.BLASTOCYST_SMALL, NPCID.MOMS_HEART, NPCID.IT_LIVES,
// NPCID.MOMS_GUTS, NPCID.GEMINI, NPCID.GEMINI_GREEN, NPCID.GEMINI_BLUE, NPCID.STEVEN,
// NPCID.GEMINI_BABY, NPCID.GEMINI_BABY_GREEN, NPCID.GEMINI_BABY_BLUE, NPCID.STEVEN_BABY,
// NPCID.BLIGHTED_OVUM_BABY, NPCID.BLIGHTED_OVUM, NPCID.THE_FALLEN, NPCID.KRAMPUS,
// NPCID.HEADLESS_HORSEMAN, NPCID.SATAN, NPCID.SATAN_STOMP, NPCID.DARK_ESAU, NPCID.MOTHERS_SHADOW,
// NPCID.REAP_CREEP, NPCID.LIL_BLUB, NPCID.RAINMAKER, NPCID.THE_VISAGE, NPCID.THE_VISAGE_MASK,
// NPCID.SIREN_MINION, NPCID.SIREN_MINION, NPCID.SIREN_MINION, NPCID.THE_HERETIC, NPCID.HORNFEL,
// NPCID.GREAT_GIDEON, NPCID.BABY_PLUM, NPCID.THE_SCOURGE, NPCID.THE_SCOURGE_CHAIN, NPCID.CHIMERA,
// NPCID.CHIMERA_BODY, NPCID.CHIMERA_HEAD, NPCID.ROTGUT, NPCID.ROTGUT_MAGGOT, NPCID.ROTGUT_HEART,
// NPCID.MOTHER, NPCID.MOTHER_PHASE_2, NPCID.MOTHER_2, NPCID.MOTHER_2_PHASE_2, NPCID.MOTHER_BALL,
// NPCID.MIN_MIN, NPCID.CLOG, NPCID.SINGE, NPCID.BUMBINO, NPCID.COLOSTOMIA, NPCID.TURDLET,
// NPCID.RAGLICH, NPCID.RAGLICH_ARM, NPCID.HORNY_BOYS, NPCID.CLUTCH, NPCID.DOGMA_PHASE_1,
// NPCID.DOGMA_TV, NPCID.DOGMA_PHASE_2, NPCID.BEAST, NPCID.ULTRA_FAMINE, NPCID.BACKGROUND_BEAST,
// NPCID.BACKGROUND_FAMINE, NPCID.BACKGROUND_PESTILENCE, NPCID.BACKGROUND_WAR,
// NPCID.BACKGROUND_DEATH, NPCID.ULTRA_PESTILENCE, NPCID.ULTRA_WAR, NPCID.ULTRA_DEATH, NPCID.DUMMY,
// NPCID.MASK_OF_INFAMY, NPCID.MASK_OF_INFAMY_BLACK, NPCID.GURDY_JR, NPCID.GURDY_JR_BLUE,
// NPCID.GURDY_JR_YELLOW, ]);
