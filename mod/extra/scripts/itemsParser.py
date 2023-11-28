import os
import re
import sys
import xml.etree.ElementTree as ET

MOD_NAME = "fiendfolio-reheated_2851063440"
COLLECTIBLE_ENUM_NAME = "FiendFolioCollectibleTypeNames"
TRINKET_ENUM_NAME = "FiendFolioTrinketTypeNames"
ITEMS_XML = f"C:\\Program Files (x86)\\Steam\\steamapps\\common\\The Binding of Isaac Rebirth\\mods\\{MOD_NAME}\\content\\items.xml"
ALLOWED_CHARACTERS_REGEX = '[^A-Za-z0-9_ ]+'

collectibles = {}

trinkets = {}


def main():
    populate()
    # printCollectibles()
    printTrinkets()

def populate():
    tree = ET.parse(ITEMS_XML)
    items = tree.getroot()

    for trinketOrCollectible in items:
        isTrinket = trinketOrCollectible.tag == "trinket"
        if isTrinket:
            populateTrinket(trinketOrCollectible)
        else:
            populateCollectible(trinketOrCollectible)

def populateTrinket(trinket):
    trinketName = trinket.attrib["name"]
    trinketKey = getEnumKeyFromName(trinketName)
    trinkets[trinketKey] = trinketName

def populateCollectible(collectible):
    collectibleName = collectible.attrib["name"]
    collectibleKey = getEnumKeyFromName(collectibleName)
    collectibles[collectibleKey] = collectibleName

# Print the dictionary of collectibles in the form of a Typescript enum.
def printCollectibles():
    printf(f"export enum {COLLECTIBLE_ENUM_NAME} {{")
    for key in collectibles:
        printf(f'    {key} = "{collectibles[key]}",')
    printf("}")

# Print the dictionary of trinkets in the form of a Typescript enum.
def printTrinkets():
    printf(f"export enum {TRINKET_ENUM_NAME} {{")
    for key in trinkets:
        printf(f'    {key} = "{trinkets[key]}",')
    printf("}")

def getEnumKeyFromName(name):
    return re.sub(ALLOWED_CHARACTERS_REGEX, '', name).replace(" ", "_").upper()



def printf(*args):
    print(*args, flush=True)






if __name__ == "__main__":
    main()