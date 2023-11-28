import os
import re
import sys
import xml.etree.ElementTree as ET

ITEM_POOLS_XML = "C:\\Program Files (x86)\\Steam\\steamapps\\common\\The Binding of Isaac Rebirth\\resources-dlc3\\itempools.xml"

# Dictionary mapping item pool names to their 'ItemPoolType' enum keys.
itemPoolsNameToEnum = {
    "treasure": "ItemPoolType.TREASURE",
    "shop": "ItemPoolType.SHOP",
    "boss": "ItemPoolType.BOSS",
    "devil": "ItemPoolType.DEVIL",
    "angel": "ItemPoolType.ANGEL",
    "secret": "ItemPoolType.SECRET",
    "library": "ItemPoolType.LIBRARY",
    "shellGame": "ItemPoolType.SHELL_GAME",
    "goldenChest": "ItemPoolType.GOLDEN_CHEST",
    "redChest": "ItemPoolType.RED_CHEST",
    "beggar": "ItemPoolType.BEGGAR",
    "demonBeggar": "ItemPoolType.DEMON_BEGGAR",
    "curse": "ItemPoolType.CURSE",
    "keyMaster": "ItemPoolType.KEY_MASTER",
    "batteryBum": "ItemPoolType.BATTERY_BUM",
    "momsChest": "ItemPoolType.MOMS_CHEST",
    "greedTreasure": "ItemPoolType.GREED_TREASURE",
    "greedBoss": "ItemPoolType.GREED_BOSS",
    "greedShop": "ItemPoolType.GREED_SHOP",
    "greedCurse": "ItemPoolType.GREED_CURSE",
    "greedSecret": "ItemPoolType.GREED_SECRET",
    "greedDevil": "ItemPoolType.GREED_DEVIL",
    "greedAngel": "ItemPoolType.GREED_ANGEL",
    "craneGame": "ItemPoolType.CRANE_GAME",
    "ultraSecret": "ItemPoolType.ULTRA_SECRET",
    "bombBum": "ItemPoolType.BOMB_BUM",
    "planetarium": "ItemPoolType.PLANETARIUM",
    "oldChest": "ItemPoolType.OLD_CHEST",
    "babyShop": "ItemPoolType.BABY_SHOP",
    "woodenChest": "ItemPoolType.WOODEN_CHEST",
    "rottenBeggar": "ItemPoolType.ROTTEN_BEGGAR",
}

# Dictionary mapping IDs or Names to their ItemPools.
items = {}

def main():
    populateItemPoolDictionary()
    printItemPoolDictionary()

def populateItemPoolDictionary():
    tree = ET.parse(ITEM_POOLS_XML)
    itemPools = tree.getroot()

    for itemPool in itemPools:
        poolName = itemPool.attrib["Name"]
        printf(f"Pool: {poolName}")
        for item in itemPool:
            # Items can either have an 'id' attribute or a 'name' attribute.
            itemID = item.attrib["Id"]
            # itemName = item.attrib["name"] if "name" in item.attrib else None

            if itemID is not None:
                itemPoolList = items.get(itemID, [])
                itemPoolList.append(poolName)
                items[itemID] = itemPoolList

# Print in the format of a Typescript map (Map<number, string[]>).
def printItemPoolDictionary():
    printf("Size: {}".format(len(items)))
    printf("export const itemPools: Map<number, string[]> = new Map([")

    # Order the items by their ID.
    sortedItems = dict(sorted(items.items(), key=lambda item: int(item[0])))

    for itemID in sortedItems:
        itemPoolList = items[itemID]
        itemPoolEnumList = [getItemPoolEnumText(poolName) for poolName in itemPoolList]
        printf(f"[{itemID}, [{', '.join(itemPoolEnumList)}]],")
    printf("]);")

def getItemPoolEnumText(poolName):
    if poolName in itemPoolsNameToEnum:
        return itemPoolsNameToEnum[poolName]
    else:
        # Throw error
        ReferenceError(f"Item pool '{poolName}' not found in itemPools dictionary.")



def printf(*args):
    print(*args, flush=True)






if __name__ == "__main__":
    main()