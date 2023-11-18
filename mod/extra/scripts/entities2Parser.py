import os
import re
import sys
import xml.etree.ElementTree as ET

ENTITIES_2_XML = "C:\\Program Files (x86)\\Steam\\steamapps\\common\\The Binding of Isaac Rebirth\\resources-dlc3\\entities2.xml"
FIEND_FOLIO_ENTITIES_2_XML = "C:\\Program Files (x86)\\Steam\\steamapps\\common\\The Binding of Isaac Rebirth\\mods\\fiendfolio-reheated_2851063440\\content\\entities2.xml"
# BOSS_COLORS_XML = "C:\\Program Files (x86)\\Steam\\steamapps\\common\\The Binding of Isaac Rebirth\\resources\\bosscolors.xml"
ALLOWED_CHARACTERS_REGEX = '[^A-Za-z0-9_ ]+'

PRINT_MAP = "Print Name"
PRINT_ENUM = "Print Enum"
PRINT_SET = "Print Set"
PRINT_NAME_AND_SUBTYPE = "Print Name and Subtype"

# True to substitute 'incomplete' entries with their name value.
INCOMPLETE_ENTRIES = False

entities2Names = {}

def main():
    print_entities_2_xml(FIEND_FOLIO_ENTITIES_2_XML, PRINT_NAME_AND_SUBTYPE, INCOMPLETE_ENTRIES)
    # print_boss_colors_xml()


def printf(*args):
    print(*args, flush=True)


def print_entities_2_xml(path, printMethod, removeIncomplete):
    printf("Parsing file: {}".format(ENTITIES_2_XML))
    tree = ET.parse(path)
    entities = tree.getroot()
    for entity in entities:
        id = entity.attrib["id"]
        variant = 0
        subtype = 0
        name = entity.attrib["name"]
        formattedName = format_name(name)
        if "variant" in entity.attrib:
            variant = entity.attrib["variant"]
        if "subtype" in entity.attrib:
            subtype = entity.attrib["subtype"]
        entities2Names[f"{id}.{variant}.{subtype}"] = formattedName
        value = f'${{Isaac.GetEntityTypeByName("{name}")}}.${{Isaac.GetEntityVariantByName("{name}")}}.{subtype}'
        if removeIncomplete and (("variant" not in entity.attrib) or ("subtype" not in entity.attrib)):
            value = escaped_name(name)
        if printMethod == PRINT_ENUM:
            printf(f"{formattedName} = '{value}',")
        elif printMethod == PRINT_MAP:
            printf(f"['{formattedName}', `{value}`],")
        elif printMethod == PRINT_NAME_AND_SUBTYPE:
            printf(f'["{formattedName}", ["{name}",{subtype}]],')
        else:
            printf(f"'{value}',")

def print_boss_colors_xml():
    printf("Parsing file: {}".format(BOSS_COLORS_XML))
    tree = ET.parse(BOSS_COLORS_XML)
    bosses = tree.getroot()
    for boss in bosses:
        id = boss.attrib["id"]
        variant = boss.attrib["variant"]
        i = 1
        for color in boss:
            suffix = "UNKNOWN"
            if "suffix" in color.attrib:
                suffix = color.attrib["suffix"]
            elif "anm2path" in color.attrib:
                suffix = color.attrib["anm2path"]
            name = format_name(entities2Names[f"{id}.{variant}.0"] + suffix)
            if PRINT_MAP:
                printf(f"{name}:'{id}.{variant}.{i}',")
            else:
                printf(f"'{id}.{variant}.{i}',")
            i += 1

def format_name(name):
    return re.sub(ALLOWED_CHARACTERS_REGEX, '', name).replace(" ", "_").upper()

# escape the special characters
def escaped_name(name):
    return name.replace("'", "\\\\'")



if __name__ == "__main__":
    main()