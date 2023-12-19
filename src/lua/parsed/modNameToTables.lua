local modNameToTables = {}

local modNameToEntities2Table = {
   ["CAR"] = require("CAR_ENTITIES2"),
   ["DAMN_FIEND_FOLIO_REHEATED"] = require("DAMN_FIEND_FOLIO_REHEATED_ENTITIES2"),
   ["ANDROMEDA"] = require("ANDROMEDA_ENTITIES2"),


}

local modNameToItemsTable = {
   ["DAMN_FIEND_FOLIO_REHEATED"] = require("DAMN_FIEND_FOLIO_REHEATED_ITEMS"),
   ["ANDROMEDA"] = require("ANDROMEDA_ITEMS"),

}

local modNameToItemPoolsTable = {
   ["DAMN_FIEND_FOLIO_REHEATED"] = require("DAMN_FIEND_FOLIO_REHEATED_ITEMPOOLS"),
   ["ANDROMEDA"] = require("ANDROMEDA_ITEMPOOLS"),


}

local modNameToPlayersTable = {
   ["CAR"] = require("CAR_PLAYERS"),
   ["DAMN_FIEND_FOLIO_REHEATED"] = require("DAMN_FIEND_FOLIO_REHEATED_PLAYERS"),
   ["ANDROMEDA"] = require("ANDROMEDA_PLAYERS"),
}

function modNameToTables.getEntities2Table(modName)
  return modNameToEntities2Table[modName]
end

function modNameToTables.getItemsTable(modName)
  return modNameToItemsTable[modName]
end

function modNameToTables.getItemPoolsTable(modName)
  return modNameToItemPoolsTable[modName]
end

function modNameToTables.getPlayersTable(modName)
  return modNameToPlayersTable[modName]
end

return modNameToTables

