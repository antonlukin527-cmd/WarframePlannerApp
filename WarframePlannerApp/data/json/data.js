// ============================================================
// Warframe Build Planner — ФАЙЛ ДАННЫХ
// Редактируй этот файл в Блокноте и сохраняй (Ctrl+S).
// После сохранения открой builds.html — данные обновятся.
// ============================================================

window.WF_DATA = {

  // ---------- БИЛДЫ ВАРФРЕЙМОВ ----------
  // Поля: frame, role, task, faction, weapon, companion, mods, arcFrame, arcWeap, helminth
  builds: [
    {frame:"Citrine", role:"Support", task:"Cascade 9999", faction:"Все", weapon:"Strun Prime + Furax Inc.", companion:"Nautilus", mods:"Prismatic Gem, Archon Continuity", arcFrame:"Arcane Molt Augmented", arcWeap:"Primary Crux", helminth:"Roar вместо Crystallize"},
    {frame:"Atlas", role:"Tank", task:"Cascade 9999", faction:"Все", weapon:"Furax Inc.", companion:"Nautilus", mods:"Rubble Heap, Path of Statues", arcFrame:"Arcane Persistence", arcWeap:"Melee Influence", helminth:"—"},
    {frame:"Kullervo", role:"Damage", task:"Steel Path", faction:"Все", weapon:"Furax Inc.", companion:"Panzer Vulpaphyla", mods:"Wrathful Advance, Blind Rage", arcFrame:"Arcane Fury", arcWeap:"Melee Duplicate", helminth:"—"},
    {frame:"Dante", role:"Support", task:"Steel Path", faction:"Все", weapon:"Strun Prime", companion:"Nautilus", mods:"Light Verse, Dark Verse", arcFrame:"Arcane Energize", arcWeap:"Primary Merciless", helminth:"—"},
    {frame:"Saryn", role:"Damage", task:"Farm", faction:"Все", weapon:"Strun Prime", companion:"Nautilus", mods:"Spores, Toxic Lash", arcFrame:"Arcane Molt Augmented", arcWeap:"Primary Merciless", helminth:"Roar вместо Molt"},
    {frame:"Equinox", role:"Damage", task:"Farm", faction:"Все", weapon:"Strun Prime + Furax", companion:"Nautilus", mods:"Maim, Energy Transfer", arcFrame:"Arcane Energize", arcWeap:"Melee Influence", helminth:"Terrify вместо Rest & Rage"},
    {frame:"Nekros", role:"Farming", task:"Farm", faction:"Все", weapon:"Любое", companion:"Smeeta Kavat", mods:"Desecrate, Despoil", arcFrame:"Arcane Energize", arcWeap:"—", helminth:"—"},
    {frame:"Khora", role:"Farming", task:"Farm", faction:"Все", weapon:"Любое", companion:"Smeeta Kavat", mods:"Pilfering Strangledome", arcFrame:"Arcane Energize", arcWeap:"Melee Influence", helminth:"—"},
    {frame:"Revenant", role:"Tank", task:"Cascade 9999", faction:"Все", weapon:"Любое", companion:"Panzer Vulpaphyla", mods:"Mesmer Skin", arcFrame:"Arcane Energize", arcWeap:"—", helminth:"—"},
    {frame:"Vauban", role:"CC", task:"Defense", faction:"Grineer", weapon:"Strun Prime", companion:"Nautilus", mods:"Bastille, Vortex", arcFrame:"Arcane Energize", arcWeap:"Primary Merciless", helminth:"—"},
    {frame:"Frost", role:"CC", task:"Defense", faction:"Все", weapon:"Strun Prime", companion:"Nautilus", mods:"Snow Globe", arcFrame:"Arcane Energize", arcWeap:"Primary Merciless", helminth:"Roar вместо Ice Wave"},
    {frame:"Ivara", role:"Stealth", task:"Speed", faction:"Все", weapon:"Любое", companion:"Huras Kubrow", mods:"Prowl, Infiltrate", arcFrame:"Arcane Energize", arcWeap:"—", helminth:"—"},
    {frame:"Volt", role:"Damage", task:"Speed", faction:"Corpus", weapon:"Strun Prime", companion:"Nautilus", mods:"Speed, Discharge", arcFrame:"Arcane Molt Augmented", arcWeap:"Primary Merciless", helminth:"—"}
  ],

  // ---------- АРСЕНАЛ (актуальное мета-оружие) ----------
  // Поля: name, type (Primary/Secondary/Melee), tier (S/A+/A), desc
  arsenal: [
    {name:"Torid (Incarnon)", type:"Primary", tier:"S", desc:"Лучшая пушка «всё в одном». Цепной токсин-луч зачищает комнаты без хедшотов."},
    {name:"Phenmor (Incarnon)", type:"Primary", tier:"S", desc:"Король одиночного урона по боссам и элите."},
    {name:"Felarx (Incarnon)", type:"Primary", tier:"S", desc:"Дробовик с огромным разовым уроном для «ваншотов»."},
    {name:"Latron (Incarnon)", type:"Primary", tier:"A+", desc:"Стабильный крит-урон, снимает броню через Puncture."},
    {name:"Nataruk", type:"Primary", tier:"A", desc:"Лучшая бесплатная пушка с бесконечными патронами."},
    {name:"Laetum (Incarnon)", type:"Secondary", tier:"S", desc:"Король вторички для убийства. В Инкарнон-форме — пулемёт."},
    {name:"Kuva Nukor", type:"Secondary", tier:"S", desc:"Мета-праймер №1. Мгновенно вешает Вирус + Огонь на толпу."},
    {name:"Dual Toxocyst (Incarnon)", type:"Secondary", tier:"S", desc:"Лучшая вторичка для зачистки толпы с рикошетом."},
    {name:"Epitaph", type:"Secondary", tier:"A+", desc:"Мощный праймер, альтернатива Nukor."},
    {name:"Tenet Cycron", type:"Secondary", tier:"A", desc:"Надёжный луч с бесконечным боезапасом."},
    {name:"Kronen Prime", type:"Melee", tier:"S", desc:"Лучший универсал с почти идеальным гибридом крита и статуса."},
    {name:"Praedos (Incarnon)", type:"Melee", tier:"S", desc:"Лучший выбор для мобильности и скорости."},
    {name:"Glaive Prime", type:"Melee", tier:"S", desc:"Лучший метательный вариант, взрывы очищают комнаты."},
    {name:"Dual Ichor (Incarnon)", type:"Melee", tier:"A+", desc:"Отличный вариант для зачистки через облака."},
    {name:"Ceramic Dagger (Incarnon)", type:"Melee", tier:"A+", desc:"Держит максимальное комбо для Secondary Outburst."}
  ],

  // ---------- ФРАКЦИИ (резисты и уязвимости) ----------
  // Поля: name, weak (уязвимость +50%), resist (сопротивление −50%), color
  factions: [
    {name:"Grineer", weak:"Impact, Corrosive", resist:"—", color:"#d4a017"},
    {name:"Kuva Grineer", weak:"Impact, Corrosive", resist:"Heat", color:"#d4a017"},
    {name:"Corpus", weak:"Puncture, Magnetic", resist:"—", color:"#3a9d5d"},
    {name:"Corpus Amalgam", weak:"Electricity, Magnetic", resist:"Blast", color:"#3a9d5d"},
    {name:"Infested", weak:"Slash, Heat", resist:"—", color:"#8a2a3a"},
    {name:"Infested Deimos", weak:"Blast, Gas", resist:"Viral", color:"#8a2a3a"},
    {name:"Orokin", weak:"Puncture, Viral", resist:"Radiation", color:"#9b59b6"},
    {name:"Sentient", weak:"Cold, Radiation", resist:"Corrosive", color:"#3498db"},
    {name:"Narmer", weak:"Slash, Toxin", resist:"Magnetic", color:"#e67e22"},
    {name:"Murmur", weak:"Electricity, Radiation", resist:"Viral", color:"#2a8a8a"},
    {name:"Zariman", weak:"Void", resist:"—", color:"#8e44ad"},
    {name:"Scaldra", weak:"Impact, Corrosive", resist:"Gas", color:"#e67e22"},
    {name:"Techrot", weak:"Gas, Magnetic", resist:"Cold", color:"#27ae60"},
    {name:"Anarchs", weak:"Impact, Electricity", resist:"Radiation", color:"#9b59b6"}
  ],

  // ---------- СТАТУСЫ И ДЕБАФФЫ ----------
  // Поля: name, type, desc, color
  statuses: [
    {name:"Corrosive", type:"Дебафф брони", desc:"Снимает 26% брони за первый стак, +6% за каждый следующий, до 80%. Длительность 8 сек.", color:"#8a6d3b"},
    {name:"Viral", type:"Усиление урона", desc:"+100% урона по здоровью за 1-й стак, +25% за каждый следующий, до +325%. Длит. 6 сек.", color:"#3a9d5d"},
    {name:"Magnetic", type:"Дебафф щитов", desc:"+100% урона по щитам за 1-й стак, +25% за каждый следующий, до +325%. Блокирует реген. Длит. 6 сек.", color:"#4a6fa5"},
    {name:"Heat", type:"DoT + броня", desc:"DoT + снимает до 50% брони. Может вызвать панику.", color:"#e94560"},
    {name:"Slash", type:"DoT (игнор брони)", desc:"DoT, игнорирует броню. Кинематический урон. Длит. 6 сек.", color:"#c0392b"},
    {name:"Toxin", type:"DoT (игнор щитов)", desc:"DoT, игнорирует щиты. Длит. 6 сек.", color:"#27ae60"},
    {name:"Electricity", type:"DoT + AoE", desc:"DoT + урон по площади. Может оглушать.", color:"#f1c40f"},
    {name:"Gas", type:"AoE DoT", desc:"Создаёт облако газа с уроном по площади. Длит. 6 сек.", color:"#2a8a8a"},
    {name:"Cold", type:"Контроль", desc:"Замедляет на 25% за 1-й стак, +5% за каждый, до 70%. Длит. 6 сек.", color:"#3498db"},
    {name:"Blast", type:"Контроль", desc:"Снижает точность врага до 75%. Длит. 6 сек.", color:"#e67e22"},
    {name:"Radiation", type:"Контроль", desc:"Заставляет врага атаковать союзников. До +550% урона по союзникам. Длит. 12 сек.", color:"#9b59b6"},
    {name:"Impact", type:"Контроль", desc:"Может оглушить. Уязвимость Grineer и Scaldra.", color:"#95a5a6"},
    {name:"Puncture", type:"Дебафф урона", desc:"Снижает урон врага. Уязвимость Corpus и Orokin.", color:"#7f8c8d"},
    {name:"Void", type:"Особый", desc:"Урон Бездны. Уязвимость Zariman. Накладывается способностями (Xaku, Dante, оператор).", color:"#8e44ad"}
  ]
};