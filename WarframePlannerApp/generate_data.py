import json
import urllib.request
import time

BASE_URL = "https://raw.githubusercontent.com/WFCD/warframe-items/master/data/json/"
LANG_RU_URL = "https://raw.githubusercontent.com/calamity-inc/warframe-public-export-plus/master/dict.ru.json"
LANG_DE_URL = "https://raw.githubusercontent.com/calamity-inc/warframe-public-export-plus/master/dict.de.json"

LANG_RU = {}
LANG_DE = {}

CATEGORIES = {
    "Primary": {"file": "Primary.json", "type": "Primary"},
    "Secondary": {"file": "Secondary.json", "type": "Secondary"},
    "Melee": {"file": "Melee.json", "type": "Melee"},
    "ArchGun": {"file": "Arch-Gun.json", "type": "Arch-Gun"},
    "ArchMelee": {"file": "Arch-Melee.json", "type": "Arch-Melee"},
    "Amps": {"file": "Amps.json", "type": "Amp"},
    "Necramech": {"file": "Necramech.json", "type": "Necramech"}, # Добавлено
    "Warframes": {"file": "Warframes.json", "type": "Warframe"},
    "Pets": {"file": "Pets.json", "type": "Pet"},
    "Sentinels": {"file": "Sentinels.json", "type": "Sentinel"},
    "SentinelWeapons": {"file": "SentinelWeapons.json", "type": "SentinelWeapon"},
    "Mods": {"file": "Mods.json", "type": "Mod"},
    "Arcanes": {"file": "Arcanes.json", "type": "Arcane"}
}

def fetch_json(url):
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=30) as response:
            if response.status == 200:
                return json.loads(response.read().decode('utf-8'))
    except Exception as e:
        print(f"  ❌ Ошибка загрузки {url}: {e}")
    return None

def process_weapon(item, item_type):
    if not item.get("name") or item.get("codexSecret") or not item.get("masterable"):
        return None
    desc = item.get("description", "")
    if len(desc) > 150: desc = desc[:147] + "..."
    name_en = item.get("name")
    # Сохраняем подтип (Rifle, Shotgun, Sword и т.д.)
    sub_type = item.get("type", "Unknown") 
    return {
        "name": name_en,
        "nameRu": LANG_RU.get(name_en, name_en),
        "nameDe": LANG_DE.get(name_en, name_en),
        "type": item_type, 
        "subType": sub_type, # <-- ДОБАВЛЕНО
        "tier": "A", "desc": desc,
        "imageName": item.get("imageName", ""),
        "masteryRank": item.get("masteryReq", 0),
        "damage": item.get("totalDamage", 0),
        "critChance": round(item.get("criticalChance", 0) * 100, 1),
        "statusChance": round(item.get("procChance", 0) * 100, 1)
    }

def process_warframe(item):
    if not item.get("name") or item.get("codexSecret"): return None
    desc = item.get("description", "")
    if len(desc) > 200: desc = desc[:197] + "..."
    name_en = item.get("name")
    return {
        "name": name_en,
        "nameRu": LANG_RU.get(name_en, name_en),
        "nameDe": LANG_DE.get(name_en, name_en),
        "type": "Warframe", "tier": "A", "desc": desc,
        "imageName": item.get("imageName", ""),
        "health": item.get("health", 0), "shield": item.get("shield", 0),
        "armor": item.get("armor", 0), "power": item.get("power", 0),
        "masteryRank": item.get("masteryReq", 0),
        "abilities": [a.get("abilityName") for a in item.get("abilities", []) if a.get("abilityName")]
    }

def process_companion(item, comp_type):
    if not item.get("name") or item.get("codexSecret"): return None
    desc = item.get("description", "")
    if len(desc) > 150: desc = desc[:147] + "..."
    name_en = item.get("name")
    return {
        "name": name_en,
        "nameRu": LANG_RU.get(name_en, name_en),
        "nameDe": LANG_DE.get(name_en, name_en),
        "type": comp_type, "tier": "A", "desc": desc,
        "imageName": item.get("imageName", ""),
        "health": item.get("health", 0), "shield": item.get("shield", 0),
        "armor": item.get("armor", 0), "masteryRank": item.get("masteryReq", 0)
    }

def process_mod(item):
    if not item.get("name") or item.get("codexSecret"): return None
    if item.get("type") in ["Focus Lens", "Ayatan Sculpture"]: return None
    name_en = item.get("name")
    return {
        "name": name_en,
        "nameRu": LANG_RU.get(name_en, name_en),
        "nameDe": LANG_DE.get(name_en, name_en),
        "type": item.get("type", ""), "polarity": item.get("polarity", ""),
        "rarity": item.get("rarity", ""), "baseDrain": item.get("baseDrain", 6),
        "maxRank": item.get("maxRank", 10), "imageName": item.get("imageName", "")
    }

def process_arcane(item):
    if not item.get("name"): return None
    name_en = item.get("name")
    return {
        "name": name_en,
        "nameRu": LANG_RU.get(name_en, name_en),
        "nameDe": LANG_DE.get(name_en, name_en),
        "type": item.get("type", ""), "rarity": item.get("rarity", ""),
        "imageName": item.get("imageName", "")
    }

def main():
    global LANG_RU, LANG_DE
    print("🚀 Начинаю сбор данных...")
    
    print("  🌐 Загружаю русский словарь...")
    LANG_RU = fetch_json(LANG_RU_URL) or {}
    print("  🌐 Загружаю немецкий словарь...")
    LANG_DE = fetch_json(LANG_DE_URL) or {}

    all_data = {key: [] for key in CATEGORIES}
    seen_names = set()

    for cat_key, cat_info in CATEGORIES.items():
        url = BASE_URL + cat_info["file"]
        print(f"  📥 {cat_key}...")
        data = fetch_json(url)
        if not data: continue
        
        for item in data:
            processed = None
            if cat_key in ["Primary", "Secondary", "Melee", "ArchGun", "ArchMelee", "Amps", "SentinelWeapons", "Necramech"]:
                processed = process_weapon(item, cat_info["type"])
            elif cat_key == "Warframes":
                processed = process_warframe(item)
            elif cat_key in ["Pets", "Sentinels"]:
                processed = process_companion(item, cat_info["type"])
            elif cat_key == "Mods":
                processed = process_mod(item)
            elif cat_key == "Arcanes":
                processed = process_arcane(item)
                
            if processed and processed["name"] not in seen_names:
                seen_names.add(processed["name"])
                all_data[cat_key].append(processed)
        time.sleep(1)

    for cat_key, items in all_data.items():
        if not items: continue
        items.sort(key=lambda x: x["name"])
        var_name = f"WF_{cat_key.upper()}"
        output_filename = f"{cat_key.lower()}_data.js"
        js_content = f"// Сгенерировано: {cat_key}\n// Всего: {len(items)}\n\n"
        js_content += f"window.{var_name} = " + json.dumps(items, indent=2, ensure_ascii=False) + ";\n"
        with open(output_filename, "w", encoding="utf-8") as f:
            f.write(js_content)
        print(f"  ✅ {output_filename} ({len(items)} ед.)")

    print("\n🎉 Готово!")

if __name__ == "__main__":
    main()