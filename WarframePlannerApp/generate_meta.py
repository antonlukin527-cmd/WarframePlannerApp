import json, time, urllib.request, urllib.parse, sys

API = "https://overframe.gg/api/v1/builds/"
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
    "Accept": "application/json",
    "Referer": "https://overframe.gg/"
}

# Что ищем: (категория, поисковый запрос)
TARGETS = [
    ("Warframe", "Saryn Prime"),
    ("Warframe", "Revenant Prime"),
    ("Warframe", "Dante"),
    ("Warframe", "Mesa Prime"),
    ("Weapon", "Torid Incarnon"),
    ("Weapon", "Laetum"),
    ("Weapon", "Kuva Nukor"),
    ("Weapon", "Kronen Prime"),
]

def fetch_builds(query, per_page=5):
    params = urllib.parse.urlencode({
        "search": query,
        "per_page": per_page,
        "sort_by": "votes",
        "sort_order": "desc"
    })
    url = API + "?" + params
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=25) as r:
        return json.loads(r.read().decode("utf-8"))

def extract(build, category):
    # API может отдавать разные структуры — берём то, что есть
    name = build.get("name") or build.get("title") or "Без названия"
    author = (build.get("author") or {}).get("name") if isinstance(build.get("author"), dict) else build.get("author", "—")
    votes = build.get("votes") or build.get("score") or 0
    item = build.get("item") or {}
    item_name = item.get("name") if isinstance(item, dict) else ""

    mods = []
    raw_mods = build.get("mods") or build.get("mod_list") or []
    if isinstance(raw_mods, list):
        for m in raw_mods:
            if isinstance(m, dict):
                mods.append(m.get("name", ""))
            elif isinstance(m, str):
                mods.append(m)
    mods_str = ", ".join([m for m in mods if m]) or "—"

    return {
        "id": "of-" + str(build.get("id") or build.get("build_id") or abs(hash(name))),
        "name": f"{name} ({item_name or query})",
        "category": category,
        "source": "Overframe",
        "note": f"Автор: {author}. Голосов: {votes}.",
        "frame": item_name if category == "Warframe" else "—",
        "role": "—",
        "task": "Steel Path",
        "weapon": item_name if category == "Weapon" else "—",
        "companion": "—",
        "modsFrame": mods_str if category == "Warframe" else "—",
        "modsWeapon": mods_str if category == "Weapon" else "—",
        "modsComp": "—",
        "arcFrame": "—",
        "arcWeap": "—",
        "helminth": "—",
        "focus": "—",
        "amp": "—",
        "modsAmp": "—",
        "arcOp": "—",
        "arcAmp": "—",
        "intrinsics": "—"
    }

def main():
    result = []
    for category, query in TARGETS:
        print(f"  📥 {query} ...", end=" ", flush=True)
        try:
            data = fetch_builds(query)
            builds = data if isinstance(data, list) else (data.get("data") or data.get("builds") or [])
            if not builds:
                print("пусто")
                continue
            top = builds[0]
            result.append(extract(top, category))
            print("ok")
        except Exception as e:
            print(f"ошибка: {e}")
        time.sleep(2)  # пауза, чтобы не забанили

    if not result:
        print("\n⚠️ API ничего не вернул. Использую резервный список.")
        result = FALLBACK

    content = "// Warframe Planner — мета-билды\n"
    content += f"// Сгенерировано: {time.strftime('%Y-%m-%d %H:%M:%S')}\n"
    content += f"// Всего: {len(result)}\n\n"
    content += "window.WF_META_BUILDS = " + json.dumps(result, indent=2, ensure_ascii=False) + ";\n"
    with open("meta_builds.js", "w", encoding="utf-8") as f:
        f.write(content)
    print(f"\n✅ meta_builds.js создан ({len(result)} записей)")

# Резервный список, если API недоступен
FALLBACK = [
  {"id":"meta-saryn","name":"Saryn Prime (SP)","category":"Warframe","source":"Overframe (fallback)","note":"Гибрид для Стального Пути.","frame":"Saryn Prime","role":"Damage","task":"Steel Path","weapon":"—","companion":"—","modsFrame":"—","modsWeapon":"—","modsComp":"—","arcFrame":"—","arcWeap":"—","helminth":"Roar","focus":"—","amp":"—","modsAmp":"—","arcOp":"—","arcAmp":"—","intrinsics":"—"},
  {"id":"meta-torid","name":"Torid Incarnon","category":"Weapon","source":"Overframe (fallback)","note":"Цепной токсин-луч.","frame":"—","role":"—","task":"Steel Path","weapon":"Torid Incarnon","companion":"—","modsFrame":"—","modsWeapon":"—","modsComp":"—","arcFrame":"—","arcWeap":"—","helminth":"—","focus":"—","amp":"—","modsAmp":"—","arcOp":"—","arcAmp":"—","intrinsics":"—"}
]

if __name__ == "__main__":
    main()