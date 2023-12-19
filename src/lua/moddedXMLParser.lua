-- This parser is used to parse:
-- The entities2.xml file (if it exists)
-- The items.xml file (if it exists)
-- The itemPools.xml file (if it exists)

-- It does this by first finding the mod's folder using the mod's name and mod
-- directory, then finding the XML files in the mod's folder. It will parse
-- those files, saving the data in a table.

-- package.path = './lib/luaxml-master/?.lua;' .. package.path
local xml2lua = require("lib.xml2lua-master.xml2lua")

--Uses a handler that converts the XML to a Lua table
local handler = require("lib.xml2lua-master.xmlhandler.tree")

local modNameToTable = require("parsed.modNameToTables")



local modFolderPath = "C:\\Program Files (x86)\\Steam\\steamapps\\common\\The Binding of Isaac Rebirth\\mods\\"
local parsedFolderPath = "C:\\Users\\james\\thedeleted\\src\\lua\\parsed\\"

local itemsPath = "\\content\\items.xml"
local itemPoolsPath = "\\content\\itempools.xml"
local entities2Path = "\\content\\entities2.xml"
local playersPath = "\\content\\players.xml"
local metadataPath = "\\metadata.xml"

local entities2Suffix = "_ENTITIES2"
local itemsSuffix = "_ITEMS"
local itemPoolsSuffix = "_ITEMPOOLS"
local playersSuffix = "_PLAYERS"

-- Entity suffixes.
local familiarSuffix = "_FAMILIAR"
local tearSuffix = "_TEAR"
local bombSuffix = "_BOMB"
local knifeSuffix = "_KNIFE"
local laserSuffix = "_LASER"
local npcSuffix = "_NPC"
local projectileSuffix = "_PROJECTILE"
local pickupSuffix = "_PICKUP"
local playerEntitySuffix = "_PLAYER_ENTITY"
local effectSuffix = "_EFFECT"
local slotSuffix = "_SLOT"

local formattedModNameAllowedCharacters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
local formattedKeyFromEntityNameAllowedCharacters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_"

local moddedXMLParser = {}

-- Converts Lua table to a string, for saving to a file.
local function tableToString(o)
  if type(o) == 'table' then
     local s = '{ '
     for k,v in pairs(o) do
        if type(k) ~= 'number' then k = '"'..k..'"' end
        s = s .. '['..k..'] = ' .. tableToString(v) .. ','
     end
     return s .. '} '
  else
    local str = '"' .. tostring(o) .. '"'
    -- Escape any single backslash characters.
    str = str:gsub("\\", "\\\\")
    return str
  end
end

-- Returns the entity category (e.g "_TEAR") from an entity's 'id' attribute.
-- Must be a number (not a string).
local function getEntityCategoryFromID(id)
  -- Must be number
  if type(id) ~= "number" then
    return nil
  end

  if id == 0 then
    -- Error
    return nil
  elseif id == 1 then
    return playerEntitySuffix
  elseif id == 2 then
    return tearSuffix
  elseif id == 3 then
    return familiarSuffix
  elseif id == 4 then
    return bombSuffix
  elseif id == 5 then
    return pickupSuffix
  elseif id == 6 then
    return slotSuffix
  elseif id == 7 then
    return laserSuffix
  elseif id == 8 then
    return knifeSuffix
  elseif id == 9 then
    return projectileSuffix
  elseif id >= 1000 then
    return effectSuffix
  elseif id < 1000 then
    return npcSuffix
  end

  -- Error
  return nil
end

local function generateEntityCategoryTable()
  return {
    [familiarSuffix] = {},
    [tearSuffix] = {},
    [bombSuffix] = {},
    [knifeSuffix] = {},
    [laserSuffix] = {},
    [npcSuffix] = {},
    [projectileSuffix] = {},
    [pickupSuffix] = {},
    [playerEntitySuffix] = {},
    [effectSuffix] = {},
    [slotSuffix] = {}
  }
end


-- Formats a mod folder name to a formatted mod name, which can be used
-- for table names, file names, etc.
local function formatModName(modFolderName)
  local formattedModName = ""

  for i = 1, #modFolderName do
    local char = modFolderName:sub(i, i)
    -- Swap space for underscore, unless it's the first or last character.
    if char == " " and i ~= 1 and i ~= #modFolderName then
      formattedModName = formattedModName .. "_"
    -- Swap hyphen for underscore, unless it's the first or last character.
    elseif char == "-" and i ~= 1 and i ~= #modFolderName then
      formattedModName = formattedModName .. "_"
    elseif string.find(formattedModNameAllowedCharacters, char) then
      -- If it's the first character, make it uppercase.
      formattedModName = formattedModName .. char
    end
  end

  -- Remove any trailing underscores.
  while formattedModName:sub(#formattedModName, #formattedModName) == "_" do
    formattedModName = formattedModName:sub(1, #formattedModName - 1)
  end

  -- Remove any leading underscores.
  while formattedModName:sub(1, 1) == "_" do
    formattedModName = formattedModName:sub(2, #formattedModName)
  end

  -- Convert to uppercase.
  formattedModName = formattedModName:upper()

  -- If string is empty, return "UnknownMod".
  if formattedModName == "" then
    formattedModName = "UnknownMod"
  end

  return formattedModName
end

-- After generating the new parsed XML file, we need to add it to its respective
-- table in modNameToTables.lua for reference.
local function addToModNameToTables(formattedModName, suffix)
  -- Read the content of modNameToTables.lua
  local file, err = io.open(parsedFolderPath .. "modNameToTables.lua", "r")
  if not file then
    print("Error opening file:", err)
    return
  end

  local content = file:read("*all")
  file:close()


  -- Check if the key-value pair (e.g ["ANDROMEDA"] = require("ANDROMEDA_ENTITIES2"),) already exists.
  if string.find(content, formattedModName .. suffix) ~= nil then
    print("Key-value pair already exists in modNameToTables.lua.")
    return
  end

  -- Modify the content to add a new key-value pair
  local newContent = content
  if suffix == entities2Suffix then
    print("Adding new key-value pair to modNameToEntities2Table.")
    newContent = content:gsub(
      "local modNameToEntities2Table = {",
      string.format('local modNameToEntities2Table = {%s ["%s"] = %s,', '\n  ', formattedModName, "require(\"" .. formattedModName .. suffix .. "\")")
    )
  elseif suffix == itemsSuffix then
    print("Adding new key-value pair to modNameToItemsTable.")
    newContent = content:gsub(
      "local modNameToItemsTable = {",
      string.format('local modNameToItemsTable = {%s ["%s"] = %s,', '\n  ', formattedModName, "require(\"" .. formattedModName .. suffix .. "\")")
    )
  elseif suffix == itemPoolsSuffix then
    print("Adding new key-value pair to modNameToItemPoolsTable.")
    newContent = content:gsub(
      "local modNameToItemPoolsTable = {",
      string.format('local modNameToItemPoolsTable = {%s ["%s"] = %s,', '\n  ', formattedModName, "require(\"" .. formattedModName .. suffix .. "\")")
    )
  elseif suffix == playersSuffix then
    print("Adding new key-value pair to modNameToPlayersTable.")
    newContent = content:gsub(
      "local modNameToPlayersTable = {",
      string.format('local modNameToPlayersTable = {%s ["%s"] = %s,', '\n  ', formattedModName, "require(\"" .. formattedModName .. suffix .. "\")")
    )
  end

  -- Write the updated content back to modNameToTables.lua
  file, err = io.open(parsedFolderPath .. "modNameToTables.lua", "w")
  if not file then
    print("Error opening file for writing:", err)
    return
  end

  file:write(newContent)
  file:close()

  print("New key-value pair added to modNameToEntities2Table.")
end

-- Takes an xml is string form, and returns the same xml in string form
-- after swapping '>' characters for '&gt;'. It will only swap '>' characters
-- that are part of an attribute value. Attribute values can be wrapped in
-- single or double quotes.
local function preParseXML(xml)
  local newXML = ""
  local inAttributeValue = false
  local attributeValueWrapper = ""
  -- Filter out comments
  xml = xml:gsub("<!%-%-.-%-%->", "")
  for i = 1, #xml do
    local char = xml:sub(i, i)
    if char == "'" or char == '"' then
      if inAttributeValue == false then
        inAttributeValue = true
        attributeValueWrapper = char
      elseif inAttributeValue == true and attributeValueWrapper == char then
        inAttributeValue = false
        attributeValueWrapper = ""
      end
    elseif char == ">" and inAttributeValue == true then
      char = "&gt;"
    end
    newXML = newXML .. char
  end
  return newXML
end

-- Parse entities from entities2.xml. This will sort them into separate categories
-- determined by their 'id' attribute.
local function parseEntities(modFolderName)
  -- Check if entities2.xml exists.
  local file = io.open(modFolderPath .. modFolderName .. entities2Path, "r")
  if not file then
    print("Couldn't find entities2.xml for " .. modFolderName .. ".")
    return
  end
  file:close()
  local xml = xml2lua.loadFile(modFolderPath .. modFolderName .. entities2Path)
  xml = preParseXML(xml)
  local dom = handler:new()
  local parser = xml2lua.parser(dom)
  parser:parse(xml)
  local entities = dom.root.entities
  if #entities.entity > 1 then
    entities = entities.entity
  end

  -- Sort entities into separate tables based on their 'id' attribute.
  local entityCategoryTable = generateEntityCategoryTable()

  for i = 1, #entities do
    print("Categorizing entity " .. i .. " of " .. #entities .. ".")
    local entity = entities[i]
    local idString = entity._attr.id

    -- These will be used as keys in the entityCategoryTables.
    local nameString = entity._attr.name
    local subtypeString = entity._attr.subtype or "0"
    local entityNameSubtype = subtypeString .. "." .. nameString

    -- This should never happen unless the XML is malformed.
    if idString == nil then
      print("Couldn't find 'id' attribute for entity " .. i .. ".")
      return
    end

    -- Find the entityCategory from ID, in the form of their suffix string.
    local entityCategory = getEntityCategoryFromID(tonumber(idString))
    if entityCategory ~= nil then
      -- If the entityCategoryTable doesn't have a table for this entityCategory,
      -- create one.
      if entityCategoryTable[entityCategory] == nil then
        entityCategoryTable[entityCategory] = {}
      end

      -- Add the entity to the entityCategoryTable.
      entityCategoryTable[entityCategory][entityNameSubtype] = entity
    else
      print("Couldn't find entity category for entity " .. i .. ".")
    end
  end

  return entityCategoryTable
end

local function parseItems(modFolderName)
  -- Check if items.xml exists.
  local file = io.open(modFolderPath .. modFolderName .. itemsPath, "r")
  if not file then
    print("Couldn't find items.xml for " .. modFolderName .. ".")
    return
  else

  end
  file:close()
  local xml = xml2lua.loadFile(modFolderPath .. modFolderName .. itemsPath)
  xml = preParseXML(xml)

  local dom = handler:new()
  local parser = xml2lua.parser(dom)
  parser:parse(xml)
  local items = dom.root.items
  return items
end

local function parseItemPools(modFolderName)
  -- Check if itemPools.xml exists.
  local file = io.open(modFolderPath .. modFolderName .. itemPoolsPath, "r")
  if not file then
    print("Couldn't find itemPools.xml for " .. modFolderName .. ".")
    return
  end
  file:close()
  local xml = xml2lua.loadFile(modFolderPath .. modFolderName .. itemPoolsPath)
  xml = preParseXML(xml)
  local dom = handler:new()
  local parser = xml2lua.parser(dom)
  parser:parse(xml)
  local itemPools = dom.root.ItemPools
  if #itemPools.Pool > 1 then
    itemPools = itemPools.Pool
  end
  return itemPools
end

local function parsePlayers(modFolderName)
  -- Check if players.xml exists.
  local file = io.open(modFolderPath .. modFolderName .. playersPath, "r")
  if not file then
    print("Couldn't find players.xml for " .. modFolderName .. ".")
    return
  end
  file:close()
  local xml = xml2lua.loadFile(modFolderPath .. modFolderName .. playersPath)
  xml = preParseXML(xml)
  local dom = handler:new()
  local parser = xml2lua.parser(dom)
  parser:parse(xml)
  local players = dom.root.players
  if #players.player > 1 then
    players = players.player
  end
  return players
end

local function getModName(modFolderName)
  -- Check if metadata.xml exists.
  local file = io.open(modFolderPath .. modFolderName .. metadataPath, "r")
  if not file then
    print("Couldn't find metadata.xml for " .. modFolderName .. ".")
    return
  end
  file:close()
  local xml = xml2lua.loadFile(modFolderPath .. modFolderName .. metadataPath)

  -- Find 'name' tag and get its value.
  local name = xml:match("<name>(.-)</name>")
  return name
end

local function writeTableToFile(table, formattedModName, suffix)
  if table == nil then
    print("Couldn't find " .. suffix .. " table for " .. formattedModName .. ".")
    return
  end

  local file = assert(io.open(parsedFolderPath .. formattedModName .. suffix .. ".lua", "w"))
  file:write("return " .. tableToString(table))
  file:close()

  print(formattedModName .. suffix .. " table written to file.")
  addToModNameToTables(formattedModName, suffix)
end

function moddedXMLParser:getFamiliars(modName)
  local formattedModName = formatModName(modName)
  local familiars = modNameToTable.getEntities2Table(formattedModName)[familiarSuffix]
  if familiars == nil then
    print("Couldn't get familiars table for " .. formattedModName .. ".")
  end
  return familiars
end

function moddedXMLParser:getTears(modName)
  local formattedModName = formatModName(modName)
  local tears = modNameToTable.getEntities2Table(formattedModName)[tearSuffix]
  if tears == nil then
    print("Couldn't get tears table for " .. formattedModName .. ".")
  end
  return tears
end

function moddedXMLParser:getBombs(modName)
  local formattedModName = formatModName(modName)
  local bombs = modNameToTable.getEntities2Table(formattedModName)[bombSuffix]
  if bombs == nil then
    print("Couldn't get bombs table for " .. formattedModName .. ".")
  end
  return bombs
end

function moddedXMLParser:getKnives(modName)
  local formattedModName = formatModName(modName)
  local knives = modNameToTable.getEntities2Table(formattedModName)[knifeSuffix]
  if knives == nil then
    print("Couldn't get knives table for " .. formattedModName .. ".")
  end
  return knives
end

function moddedXMLParser:getLasers(modName)
  local formattedModName = formatModName(modName)
  local lasers = modNameToTable.getEntities2Table(formattedModName)[laserSuffix]
  if lasers == nil then
    print("Couldn't get lasers table for " .. formattedModName .. ".")
  end
  return lasers
end

function moddedXMLParser:getNPCs(modName)
  local formattedModName = formatModName(modName)
  local npcs = modNameToTable.getEntities2Table(formattedModName)[npcSuffix]
  if npcs == nil then
    print("Couldn't get npcs table for " .. formattedModName .. ".")
  end
  return npcs
end

function moddedXMLParser:getProjectiles(modName)
  local formattedModName = formatModName(modName)
  local projectiles = modNameToTable.getEntities2Table(formattedModName)[projectileSuffix]
  if projectiles == nil then
    print("Couldn't get projectiles table for " .. formattedModName .. ".")
  end
  return projectiles
end

function moddedXMLParser:getPickups(modName)
  local formattedModName = formatModName(modName)
  local pickups = modNameToTable.getEntities2Table(formattedModName)[pickupSuffix]
  if pickups == nil then
    print("Couldn't get pickups table for " .. formattedModName .. ".")
  end
  return pickups
end

function moddedXMLParser:getPlayerEntities(modName)
  local formattedModName = formatModName(modName)
  local playerEntities = modNameToTable.getEntities2Table(formattedModName)[playerEntitySuffix]
  if playerEntities == nil then
    print("Couldn't get player entities table for " .. formattedModName .. ".")
  end
  return playerEntities
end

function moddedXMLParser:getEffects(modName)
  local formattedModName = formatModName(modName)
  local effects = modNameToTable.getEntities2Table(formattedModName)[effectSuffix]
  if effects == nil then
    print("Couldn't get effects table for " .. formattedModName .. ".")
  end
  return effects
end

function moddedXMLParser:getSlots(modName)
  local formattedModName = formatModName(modName)
  local slots = modNameToTable.getEntities2Table(formattedModName)[slotSuffix]
  if slots == nil then
    print("Couldn't get slots table for " .. formattedModName .. ".")
  end
  return slots
end

-- Get items from items.xml saved in the parsed folder, will be separated by ItemType.
function moddedXMLParser:getItems(modName)
  local formattedModName = formatModName(modName)
  local items = modNameToTable.getItemsTable(formattedModName)
  if items == nil then
    print("Couldn't get items table for " .. formattedModName .. ".")
  end
  return items
end

-- Get item pools from itemPools.xml saved in the parsed folder.
function moddedXMLParser:getItemPools(modName)
  local formattedModName = formatModName(modName)
  local itemPools = modNameToTable.getItemPoolsTable(formattedModName)
  if itemPools == nil then
    print("Couldn't get item pools table for " .. formattedModName .. ".")
  end
  return itemPools
end

-- Get players from players.xml saved in the parsed folder.
function moddedXMLParser:getPlayers(modName)
  local formattedModName = formatModName(modName)
  local players = modNameToTable.getPlayersTable(formattedModName)
  if players == nil then
    print("Couldn't get players table for " .. formattedModName .. ".")
  end
  return players
end

-- Parse a mod's XML files and save them into a folder in /parsed.
function moddedXMLParser:parseXML(modFolderName)
  print("Parsing XML files for " .. modFolderName .. ".")

  -- Check if mod exists by finding its metadata.xml file.
  local modName = getModName(modFolderName)
  if modName == nil then
    print("Couldn't find metadata.xml for " .. modFolderName .. ".")
    return
  end

  -- Derive the formatted mod name from the mod name.
  local formattedModName = formatModName(modName)

  -- entities2.xml
  writeTableToFile(parseEntities(modFolderName), formattedModName, entities2Suffix)

  -- items.xml
  writeTableToFile(parseItems(modFolderName), formattedModName, itemsSuffix)

  -- itemPools.xml
  writeTableToFile(parseItemPools(modFolderName), formattedModName, itemPoolsSuffix)

  -- players.xml
  writeTableToFile(parsePlayers(modFolderName), formattedModName, playersSuffix)
end





return { Parse = moddedXMLParser.parseXML, getEntities = moddedXMLParser.getEntities,
  getItems = moddedXMLParser.getItems, getItemPools = moddedXMLParser.getItemPools,
  getPlayers = moddedXMLParser.getPlayers,
  getEntityFamiliars = moddedXMLParser.getFamiliars,
  getEntityTears = moddedXMLParser.getTears,
  getEntityBombs = moddedXMLParser.getBombs,
  getEntityKnives = moddedXMLParser.getKnives,
  getEntityLasers = moddedXMLParser.getLasers,
  getEntityNPCs = moddedXMLParser.getNPCs,
  getEntityProjectiles = moddedXMLParser.getProjectiles,
  getEntityPickups = moddedXMLParser.getPickups,
  getEntityPlayers = moddedXMLParser.getPlayerEntities,
  getEntityEffects = moddedXMLParser.getEffects,
  getEntitySlots = moddedXMLParser.getSlots }

