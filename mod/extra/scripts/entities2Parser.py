import os
import re
import sys
import xml.etree.ElementTree as ET

MOD_NAME = "fiendfolio-reheated_2851063440"
ENTITIES_2_XML = "C:\\Program Files (x86)\\Steam\\steamapps\\common\\The Binding of Isaac Rebirth\\resources-dlc3\\entities2.xml"
MODDED_ENTITIES_2_PATH = f"C:\\Program Files (x86)\\Steam\\steamapps\\common\\The Binding of Isaac Rebirth\\mods\\{MOD_NAME}\\content\\entities2.xml"
WRITE_TO_DIR = f"C:\\Users\\james\\thedeleted\\src\\maps\\data\\xmlParsed"

ALLOWED_CHARACTERS_NAME = '[^A-Za-z0-9_ ]+'
ALLOWED_CHARACTERS_MAP_NAME = '[^A-Za-z_]+'



def main():
    parse_modded_entities_2_xml()


def printf(*args):
    print(*args, flush=True)

# Parses the modded entities2.xml file and generates a typescript file with the parsed data.
# in the format of a <string, "subtype.name"> map.
def parse_modded_entities_2_xml():
    printf("Parsing file: {}".format(ENTITIES_2_XML))
    tree = ET.parse(MODDED_ENTITIES_2_PATH)
    entities = tree.getroot()
    str = f"export const {format_map_name(MOD_NAME)}_ENTITIES_2_PARSED = new ReadonlyMap([\n"
    for entity in entities:

        # May have subtype.
        subtype = 0

        # Must have name.
        name = entity.attrib["name"]

        # Use name to generate key.
        keyName = format_name(name)

        # If subtype exists, use it.
        if "subtype" in entity.attrib:
            subtype = entity.attrib["subtype"]

        str += f'["{keyName}", "{subtype}.{name}"],\n'

    str += "]);"
    write_to_file(str)

def format_name(name):
    return re.sub(ALLOWED_CHARACTERS_NAME, '', name).replace(" ", "_").upper()

def format_map_name(name):
    return re.sub(ALLOWED_CHARACTERS_MAP_NAME, '', name).upper()

# escape the special characters
def escaped_name(name):
    return name.replace("'", "\\\\'")

# Write to file, generating the file name from the mod name.
def write_to_file(content):
    # See if file already exists.
    file_name = f"{WRITE_TO_DIR}\\{MOD_NAME}.ts"
    if os.path.exists(file_name):
        os.remove(file_name)
    with open(file_name, "w") as file:
        file.write(content)
        file.close()
    printf(f"Wrote to file: {file_name}")




if __name__ == "__main__":
    main()