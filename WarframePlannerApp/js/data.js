// Все справочники и константы. Просто данные.
const KNOWN_AUGMENTS = new Set([
  'Mesmer Shield','Enveloping Cloud','Celestial Stomp','Rubble Heap','Path Of Statues','Negation Armor',
  'Parasitic Vitality','Insatiable','Abating Link','Reactive Storm','Elusive Retribution',
  'Gourmand','Hearty Nourishment','Icy Avalanche','Chilling Globe','Venom Dose','Revealing Spores',
  "Mesa's Waltz",'Wrath Of Ukko','Noctua Swarm','The Relentless Lost','Vampiric Grasp',
  'Cathode Current','Coil Recharge','Prey Of Dynar','Seeking Shuriken','Smoke Shadow',
  'Assimilate','Chaos Sphere','Duality','Peaceful Provocation','Fused Reservoir','Critical Surge',
  'Shock Trooper','Capacitance','Enduring Bastille','Reinforcing Stomp','Iron Shrapnel',
  'Ironclad Charge','Total Eclipse','Hall Of Malevolence','Recrystalize','Prismatic Companion',
  'Pyroclastic Flow','Reaping Chakram','Safeguard','Ward Recovery','Divine Retribution',
  'Magnetized Discharge','Counter Pulse','Fracturing Crush','Greedy Pull','Safeguard Switch',
  'Savior Decoy','Hushed Invisibility','Irradiating Disarm','Damage Decoy','Razorwing Blitz',
  'Spellbound Harvest','Beguiling Lantern','Vampire Leech','Pool Of Life',"Champion's Blessing",
  'Eternal War','Prolonged Paralysis','Swing Line','Hysterical Assault','Enraged',
  'Cataclysmic Continuum','Rift Haven','Rift Torrent','Phoenix Renewal','Smite Infusion',
  'Hallowed Eruption','Hallowed Reckoning','Calm & Frenzy','Energy Transfer','Push & Pull',
  'Chromatic Blade','Furious Javelin','Surging Dash','Radiant Finish','Purging Slash',
  'Larva Burst','Teeming Virulence','Abundant Mutation','Fireball Frenzy','Healing Flame',
  'Exothermic','Immolated Radiance','Razor Mortar','Vexing Retaliation','Guided Effigy',
  'Guardian Armor','Everlasting Ward','Afterburn','Spectral Spirit',"Jade's Judgment",
  "Omikuji's Fortune",'Kumihimo Loading','Valence Formation','Swift Bite','Lingering Transmutation',
  'Reroot Rampage',"Brood's Oversurge",'Wrecking Wall','Axios Javelineers','Intrepid Stand',
  'Tharros Lethality','Rhythm Guard',"Ulfrun's Endurance",'Merulina Guardian','Loyal Merulina',
  'Surging Blades','Airburst Rounds','Target Fixation','Funnel Clouds','Jet Stream',
  'Tesla Bank','Photon Repeater','Resonance','Savage Silence','Sonic Siphon','Gaseous Quake',
  "Desiccation's Curse",'Elemental Sandstorm','Pilfering Swarm','Viral Tempest','Tidal Impunity',
  'Rousing Plunder','Conductor','Partitioned Mallet','Repair Dispensary','Temporal Artillery',
  'Temporal Erosion','Molecular Fission','Neutron Star','Antimatter Absorb','Escape Velocity',
  'Despoil','Shield Of Shadows','Soul Survivor','Ballistic Bullseye','Muzzle Flash',
  'Staggering Shield','Dark Propagation','Shadow Haze','Mach Crash','Thermal Transfer',
  'Lasting Covenant','Tribunal','Warding Thurible','Blazing Pillage','Balefire Surge',
  'Aegis Gale','Piercing Navigator','Concentrated Arrow','Empowered Quiver','Infiltrate',
  'Blending Talons','Blood Forge','Dread Ward','Titanic Rumbler','Tectonic Fracture','Rumbled',
  'Contagion Cloud','Cataclysmic Gate'
]);

const MOD_STATS_DB = {
  'Serration': {dmg: 1.65}, 'Primed Pressure Point': {dmg: 1.65},
  'Split Chamber': {multi: 0.90}, 'Galvanized Chamber': {multi: 0.80},
  'Point Strike': {crit: 1.50}, 'Blood Rush': {crit: 1.65},
  'Vital Sense': {critDmg: 1.20}, 'Organ Shatter': {critDmg: 0.90},
  'Infected Clip': {elem: 0.90}, 'Cryo Rounds': {elem: 0.90}, 'Stormbringer': {elem: 0.90},
  'Galvanized Shot': {dmg: 0.80, multi: 0.30}, 'Galvanized Hell': {multi: 1.10}
};

const ARCANE_DB = {
  frame: [
    { name: "Arcane Energize", tags: ['energy'], desc: "Восстановление энергии.", source: "Гидролист (Эйдолон) / Orphix (Veil Proxima)" },
    { name: "Arcane Grace", tags: ['health', 'regen'], desc: "Регенерация здоровья.", source: "Гидролист (Эйдолон) / Orphix" },
    { name: "Arcane Guardian", tags: ['armor'], desc: "+900 брони.", source: "Гантулист (Эйдолон) / Orphix" },
    { name: "Arcane Aegis", tags: ['shield'], desc: "Восстановление щитов.", source: "Гантулист (Эйдолон) / Orphix" },
    { name: "Arcane Avenger", tags: ['crit', 'damage'], desc: "+45% шанс крита.", source: "Гидролист (Эйдолон) / Orphix" },
    { name: "Molt Augmented", tags: ['strength', 'damage'], desc: "+60% силы способностей.", source: "Ангелы Заримана / Тракс (Zariman) / Кавалеро" },
    { name: "Molt Vigor", tags: ['strength'], desc: "Сила способностей.", source: "Кавалеро (Zariman, ранг 5)" },
    { name: "Molt Efficiency", tags: ['duration'], desc: "Длительность способностей.", source: "Кавалеро (Zariman, ранг 5)" },
    { name: "Arcane Blessing", tags: ['health'], desc: "+1200 макс. HP.", source: "Темпоральная Архимедея (Temporal Archimedea)" },
    { name: "Arcane Steadfast", tags: ['energy', 'comfort'], desc: "Бесплатные касты.", source: "Темпоральная Архимедея" },
    { name: "Arcane Bellicose", tags: ['strength'], desc: "Усиление способностей.", source: "Миссии Höllvania (1999) / The Hex" },
    { name: "Arcane Concentration", tags: ['strength'], desc: "Усиление способностей.", source: "The Descendia / Roathe" },
    { name: "Arcane Battery", tags: ['energy'], desc: "Энергия.", source: "Ascension (новый режим)" }
  ],
  primary: [
    { name: "Primary Merciless", tags: ['damage'], desc: "+360% урона.", source: "Аколенты (Стальной Путь)" },
    { name: "Primary Frostbite", tags: ['status', 'crit'], desc: "Усиливает статус и крит.", source: "Аколенты (Стальной Путь)" },
    { name: "Primary Dexterity", tags: ['comfort', 'utility'], desc: "Скорость перезарядки.", source: "Аколенты (Стальной Путь)" },
    { name: "Primary Overcharge", tags: ['damage'], desc: "Урон.", source: "Аколенты (Стальной Путь)" }
  ],
  secondary: [
    { name: "Secondary Merciless", tags: ['damage'], desc: "+360% урона.", source: "Аколенты (Стальной Путь)" },
    { name: "Secondary Encumber", tags: ['status'], desc: "Случайные статусы.", source: "Аколенты (Стальной Путь)" },
    { name: "Secondary Fortifier", tags: ['comfort', 'survival'], desc: "Оверщиты при уроне.", source: "Аколенты (Стальной Путь)" },
    { name: "Secondary Enervate", tags: ['crit'], desc: "Крит шанс.", source: "Höllvania (Scaldra Screamer / H-09 Tank)" }
  ],
  melee: [
    { name: "Melee Influence", tags: ['status', 'damage'], desc: "Распространение статусов.", source: "Cavia / Netracells" },
    { name: "Melee Exposure", tags: ['damage'], desc: "Коррозия от способностей.", source: "Cavia / Netracells" },
    { name: "Melee Animosity", tags: ['heavy', 'damage'], desc: "Урон тяжелых атак.", source: "Cavia / Netracells" },
    { name: "Melee Careen", tags: ['damage'], desc: "Урон ближнего боя.", source: "Cavia / Netracells" },
    { name: "Melee Duplicate", tags: ['crit'], desc: "Дублирование ударов.", source: "Cavia / Netracells" }
  ]
};

// Собираем все арканы в один массив для Базы Данных
let ALL_ARCANES = [];
Object.keys(ARCANE_DB).forEach(slotType => {
  ARCANE_DB[slotType].forEach(arc => {
    let typeStr = 'Arcane Frame';
    if (slotType === 'primary') typeStr = 'Arcane Primary';
    if (slotType === 'secondary') typeStr = 'Arcane Secondary';
    if (slotType === 'melee') typeStr = 'Arcane Melee';
    
    ALL_ARCANES.push({
      name: arc.name,
      type: typeStr,
      subType: slotType,
      desc: arc.desc || 'Описание отсутствует',
      tags: arc.tags || []
    });
  });
});

const SMART_BUILD_DB = {
  cascade: {
    Tank: {
      'Revenant Prime': {comp:'Panzer Vulpaphyla',prim:'Torid Incarnon',sec:'Laetum',melee:'Praedos',helminth:'Roar',mods:['Vitality','Steel Fiber','Adaptation','Primed Continuity','Blind Rage','Rolling Guard','Mesmer Shield'],weaponMods:['Serration','Galvanized Chamber','Point Strike','Vital Sense','Infected Clip','Stormbringer'], arcane1: 'Arcane Energize', arcane2: 'Arcane Grace', shards: ['Azure Armor', 'Azure Armor', 'Azure Max Health', 'Azure Max Health', 'Azure Health Regen']},
      'Wukong Prime': {comp:'Panzer Vulpaphyla',prim:'Torid Incarnon',sec:'Laetum',melee:'Praedos',helminth:'Roar',mods:['Vitality','Steel Fiber','Adaptation','Primed Continuity','Blind Rage','Rolling Guard','Enveloping Cloud'],weaponMods:['Serration','Galvanized Chamber','Point Strike','Vital Sense','Infected Clip','Stormbringer'], arcane1: 'Arcane Energize', arcane2: 'Arcane Guardian', shards: ['Azure Armor', 'Azure Armor', 'Azure Max Health', 'Azure Max Health', 'Azure Armor']},
      'Atlas Prime': {comp:'Panzer Vulpaphyla',prim:'Torid Incarnon',sec:'Laetum',melee:'Praedos',helminth:'Roar',mods:['Vitality','Steel Fiber','Primed Continuity','Umbral Intensify','Rubble Heap','Path Of Statues'],weaponMods:['Serration','Galvanized Chamber','Point Strike','Vital Sense','Infected Clip','Stormbringer'], arcane1: 'Arcane Energize', arcane2: 'Arcane Guardian', shards: ['Azure Armor', 'Azure Armor', 'Azure Max Health', 'Azure Max Health', 'Azure Armor']},
      'Inaros Prime': {comp:'Panzer Vulpaphyla',prim:'Torid Incarnon',sec:'Laetum',melee:'Praedos',helminth:'Roar',mods:['Vitality','Steel Fiber','Adaptation','Negation Armor','Blind Rage','Primed Continuity'],weaponMods:['Serration','Galvanized Chamber','Point Strike','Vital Sense','Infected Clip','Stormbringer'], arcane1: 'Arcane Grace', arcane2: 'Arcane Guardian', shards: ['Azure Armor', 'Azure Armor', 'Azure Max Health', 'Azure Max Health', 'Azure Armor']},
      'Nidus Prime': {comp:'Panzer Vulpaphyla',prim:'Torid Incarnon',sec:'Laetum',melee:'Praedos',helminth:'Roar',mods:['Vitality','Steel Fiber','Primed Continuity','Blind Rage','Parasitic Vitality','Insatiable'],weaponMods:['Serration','Galvanized Chamber','Point Strike','Vital Sense','Infected Clip','Stormbringer'], arcane1: 'Arcane Energize', arcane2: 'Arcane Grace', shards: ['Azure Armor', 'Azure Armor', 'Azure Max Health', 'Azure Max Health', 'Azure Armor']},
      'Frost Prime': {comp:'Panzer Vulpaphyla',prim:'Torid Incarnon',sec:'Laetum',melee:'Praedos',helminth:'Roar',mods:['Vitality','Steel Fiber','Primed Continuity','Blind Rage','Icy Avalanche','Chilling Globe'],weaponMods:['Serration','Galvanized Chamber','Point Strike','Vital Sense','Infected Clip','Stormbringer'], arcane1: 'Arcane Energize', arcane2: 'Arcane Guardian', shards: ['Azure Armor', 'Azure Armor', 'Azure Max Health', 'Azure Max Health', 'Azure Armor']},
      'Baruuk Prime': {comp:'Panzer Vulpaphyla',prim:'Torid Incarnon',sec:'Laetum',melee:'Desert Wind',helminth:'Pillage',mods:['Vitality','Steel Fiber','Primed Continuity','Blind Rage','Reactive Storm','Elusive Retribution'],weaponMods:['Primed Pressure Point','Blood Rush','Organ Shatter','Infected Clip','Cryo Rounds'], arcane1: 'Arcane Energize', arcane2: 'Arcane Guardian', shards: ['Azure Armor', 'Azure Armor', 'Azure Max Health', 'Azure Max Health', 'Azure Armor']},
      'Trinity Prime': {comp:'Panzer Vulpaphyla',prim:'Torid Incarnon',sec:'Laetum',melee:'Praedos',helminth:'Dispensary',mods:['Vitality','Steel Fiber','Primed Continuity','Blind Rage','Abating Link','Rolling Guard'],weaponMods:['Serration','Galvanized Chamber','Point Strike','Vital Sense','Infected Clip','Stormbringer'], arcane1: 'Arcane Energize', arcane2: 'Arcane Grace', shards: ['Azure Armor', 'Azure Armor', 'Azure Max Health', 'Azure Max Health', 'Azure Armor']},
      'Grendel Prime': {comp:'Panzer Vulpaphyla',prim:'Torid Incarnon',sec:'Laetum',melee:'Praedos',helminth:'Roar',mods:['Vitality','Steel Fiber','Adaptation','Primed Continuity','Gourmand','Hearty Nourishment'],weaponMods:['Serration','Galvanized Chamber','Point Strike','Vital Sense','Infected Clip','Stormbringer'], arcane1: 'Arcane Energize', arcane2: 'Arcane Grace', shards: ['Azure Armor', 'Azure Armor', 'Azure Max Health', 'Azure Max Health', 'Azure Armor']}
    },
    Damage: {
      'Saryn Prime': {comp:'Panzer Vulpaphyla',prim:'Phenmor',sec:'Laetum',melee:'Praedos',helminth:'Roar',mods:['Blind Rage','Transient Fortitude','Primed Continuity','Stretch','Primed Flow','Umbral Intensify','Venom Dose','Revealing Spores'],weaponMods:['Serration','Galvanized Chamber','Point Strike','Vital Sense','Hunter Munitions'], arcane1: 'Arcane Energize', arcane2: 'Molt Augmented', shards: ['Crimson Ability Strength', 'Crimson Ability Strength', 'Crimson Ability Strength', 'Crimson Ability Strength', 'Crimson Ability Strength']},
      'Mesa Prime': {comp:'Panzer Vulpaphyla',prim:'Phenmor',sec:'Laetum',melee:'Praedos',helminth:'Roar',mods:['Blind Rage','Transient Fortitude','Primed Continuity','Stretch','Primed Flow','Umbral Intensify',"Mesa's Waltz"],weaponMods:['Serration','Galvanized Chamber','Point Strike','Vital Sense','Hunter Munitions'], arcane1: 'Arcane Energize', arcane2: 'Arcane Avenger', shards: ['Crimson Ability Strength', 'Crimson Ability Strength', 'Crimson Ability Strength', 'Crimson Ability Strength', 'Crimson Ability Strength']},
      'Kullervo': {comp:'Panzer Vulpaphyla',prim:'Torid Incarnon',sec:'Laetum',melee:'Praedos',helminth:'Roar',mods:['Vitality','Steel Fiber','Primed Continuity','Blind Rage','Umbral Vitality','Wrath Of Ukko'],weaponMods:['Serration','Galvanized Chamber','Point Strike','Vital Sense','Infected Clip','Stormbringer'], arcane1: 'Arcane Energize', arcane2: 'Arcane Avenger', shards: ['Crimson Ability Strength', 'Crimson Ability Strength', 'Crimson Ability Strength', 'Crimson Ability Strength', 'Crimson Ability Strength']},
      'Dante': {comp:'Panzer Vulpaphyla',prim:'Torid Incarnon',sec:'Laetum',melee:'Praedos',helminth:'Roar',mods:['Vitality','Primed Continuity','Blind Rage','Primed Flow','Equilibrium','Noctua Swarm'],weaponMods:['Serration','Galvanized Chamber','Point Strike','Vital Sense','Infected Clip','Stormbringer'], arcane1: 'Arcane Energize', arcane2: 'Molt Augmented', shards: ['Crimson Ability Strength', 'Crimson Ability Strength', 'Crimson Ability Strength', 'Crimson Ability Strength', 'Crimson Ability Strength']},
      'Xaku Prime': {comp:'Panzer Vulpaphyla',prim:'Torid Incarnon',sec:'Laetum',melee:'Praedos',helminth:'Roar',mods:['Blind Rage','Primed Continuity','Stretch','Umbral Intensify','Primed Flow','The Relentless Lost','Vampiric Grasp'],weaponMods:['Serration','Galvanized Chamber','Point Strike','Vital Sense','Infected Clip','Stormbringer'], arcane1: 'Arcane Energize', arcane2: 'Molt Augmented', shards: ['Crimson Ability Strength', 'Crimson Ability Strength', 'Crimson Ability Strength', 'Crimson Ability Strength', 'Crimson Ability Strength']},
      'Gyre Prime': {comp:'Panzer Vulpaphyla',prim:'Torid Incarnon',sec:'Laetum',melee:'Praedos',helminth:'Roar',mods:['Blind Rage','Primed Continuity','Stretch','Augur Reach','Primed Flow','Cathode Current','Coil Recharge'],weaponMods:['Serration','Galvanized Chamber','Point Strike','Vital Sense','Infected Clip','Stormbringer'], arcane1: 'Arcane Energize', arcane2: 'Molt Augmented', shards: ['Crimson Ability Strength', 'Crimson Ability Strength', 'Crimson Ability Strength', 'Crimson Ability Strength', 'Crimson Ability Strength']},
      'Voruna Prime': {comp:'Panzer Vulpaphyla',prim:'Torid Incarnon',sec:'Laetum',melee:'Praedos',helminth:'Roar',mods:['Vitality','Steel Fiber','Primed Continuity','Blind Rage','Prey Of Dynar',"Ulfrun's Endurance"],weaponMods:['Primed Pressure Point','Blood Rush','Organ Shatter','Infected Clip','Cryo Rounds'], arcane1: 'Arcane Energize', arcane2: 'Molt Augmented', shards: ['Crimson Ability Strength', 'Crimson Ability Strength', 'Crimson Ability Strength', 'Crimson Ability Strength', 'Crimson Ability Strength']},
      'Ash Prime': {comp:'Panzer Vulpaphyla',prim:'Torid Incarnon',sec:'Laetum',melee:'Praedos',helminth:'Roar',mods:['Vitality','Steel Fiber','Primed Continuity','Blind Rage','Seeking Shuriken','Smoke Shadow'],weaponMods:['Serration','Galvanized Chamber','Point Strike','Vital Sense','Infected Clip','Stormbringer'], arcane1: 'Arcane Energize', arcane2: 'Molt Augmented', shards: ['Crimson Ability Strength', 'Crimson Ability Strength', 'Crimson Ability Strength', 'Crimson Ability Strength', 'Crimson Ability Strength']},
      'Nyx Prime': {comp:'Panzer Vulpaphyla',prim:'Torid Incarnon',sec:'Laetum',melee:'Praedos',helminth:'Roar',mods:['Vitality','Steel Fiber','Primed Continuity','Blind Rage','Assimilate','Chaos Sphere'],weaponMods:['Serration','Galvanized Chamber','Point Strike','Vital Sense','Infected Clip','Stormbringer'], arcane1: 'Arcane Energize', arcane2: 'Molt Augmented', shards: ['Crimson Ability Strength', 'Crimson Ability Strength', 'Crimson Ability Strength', 'Crimson Ability Strength', 'Crimson Ability Strength']},
      'Equinox Prime': {comp:'Panzer Vulpaphyla',prim:'Torid Incarnon',sec:'Laetum',melee:'Praedos',helminth:'Terrify',mods:['Blind Rage','Transient Fortitude','Primed Continuity','Stretch','Primed Flow','Umbral Intensify','Duality','Peaceful Provocation'],weaponMods:['Serration','Galvanized Chamber','Point Strike','Vital Sense','Hunter Munitions'], arcane1: 'Arcane Energize', arcane2: 'Molt Augmented', shards: ['Crimson Ability Strength', 'Crimson Ability Strength', 'Crimson Ability Strength', 'Crimson Ability Strength', 'Crimson Ability Strength']}
    },
    Support: {
      'Trinity Prime': {comp:'Panzer Vulpaphyla',prim:'Torid Incarnon',sec:'Laetum',melee:'Praedos',helminth:'Dispensary',mods:['Vitality','Steel Fiber','Primed Continuity','Blind Rage','Vampire Leech','Pool Of Life',"Champion's Blessing"],weaponMods:['Serration','Galvanized Chamber','Point Strike','Vital Sense','Infected Clip','Stormbringer'], arcane1: 'Arcane Energize', arcane2: 'Arcane Grace', shards: ['Crimson Ability Duration', 'Crimson Ability Duration', 'Crimson Ability Duration', 'Crimson Ability Duration', 'Crimson Ability Duration']},
      'Harrow Prime': {comp:'Panzer Vulpaphyla',prim:'Torid Incarnon',sec:'Laetum',melee:'Praedos',helminth:'Nourish',mods:['Vitality','Steel Fiber','Primed Continuity','Blind Rage','Primed Flow','Lasting Covenant','Warding Thurible'],weaponMods:['Serration','Galvanized Chamber','Point Strike','Vital Sense','Infected Clip','Stormbringer'], arcane1: 'Arcane Energize', arcane2: 'Arcane Avenger', shards: ['Crimson Ability Duration', 'Crimson Ability Duration', 'Crimson Ability Duration', 'Crimson Ability Duration', 'Crimson Ability Duration']},
      'Citrine': {comp:'Panzer Vulpaphyla',prim:'Torid Incarnon',sec:'Laetum',melee:'Praedos',helminth:'Roar',mods:['Vitality','Primed Continuity','Blind Rage','Stretch','Primed Flow','Recrystalize','Prismatic Companion'],weaponMods:['Serration','Galvanized Chamber','Point Strike','Vital Sense','Infected Clip','Stormbringer'], arcane1: 'Arcane Energize', arcane2: 'Molt Augmented', shards: ['Crimson Ability Duration', 'Crimson Ability Duration', 'Crimson Ability Duration', 'Crimson Ability Duration', 'Crimson Ability Duration']}
    }
  },
  arbitration: {
    Support: {
      'Wisp Prime': {comp:'Adarza Kavat',prim:'Afentis',sec:'Kuva Nukor',melee:'Praedos',helminth:'Nourish',mods:['Power Donation','Power Drift','Umbral Intensify','Umbral Vitality','Umbral Fiber','Cataclysmic Gate','Primed Continuity','Blind Rage','Energy Conversion','Transient Fortitude','Fused Reservoir','Critical Surge'],weaponMods:['Amalgam Serration','Primed Fast Hands','Primed Shred','Speed Trigger','Radiated Reload','Vigilante Fervor'], secMods:['Primed Convulsion','Primed Heated Charge','Primed Pistol Gambit','Primed Target Cracker','Lethal Torrent'], meleeMods:['Primed Fury','Drifting Contact','Magnetic Rush','Quakening','Gladiator Vice','Body Count'], arcane1: 'Molt Vigor', arcane2: 'Arcane Bellicose', arcanePrimary: 'Primary Dexterity', arcaneSecondary: 'Secondary Encumber', arcaneMelee: 'Melee Careen', shards: ['Crimson Ability Strength', 'Crimson Ability Strength', 'Crimson Ability Strength', 'Crimson Ability Strength', 'Crimson Ability Strength']},
      'Volt Prime': {comp:'Adarza Kavat',prim:'Afentis',sec:'Kuva Nukor',melee:'Praedos',helminth:'Dispensary',mods:['Power Donation','Power Drift','Shock Trooper','Precision Intensify','Narrow Minded','Augur Secrets','Primed Continuity','Blind Rage','Transient Fortitude','Stretch'],weaponMods:['Amalgam Serration','Primed Fast Hands','Primed Shred','Speed Trigger','Radiated Reload','Vigilante Fervor'], secMods:['Primed Convulsion','Primed Heated Charge','Primed Pistol Gambit','Primed Target Cracker','Lethal Torrent'], meleeMods:['Primed Fury','Drifting Contact','Magnetic Rush','Quakening','Gladiator Vice','Body Count'], arcane1: 'Arcane Concentration', arcane2: 'Arcane Bellicose', arcanePrimary: 'Primary Dexterity', arcaneSecondary: 'Secondary Encumber', arcaneMelee: 'Melee Careen', shards: ['Crimson Ability Strength', 'Crimson Ability Strength', 'Crimson Ability Strength', 'Crimson Ability Strength', 'Crimson Ability Strength']},
      'Vauban Prime': {comp:'Adarza Kavat',prim:'Afentis',sec:'Kuva Nukor',melee:'Praedos',helminth:'Nourish',mods:['Power Donation','Lightning Dash','Blind Rage','Narrow Minded','Constitution','Umbral Intensify','Stretch',"Nira's Hatred",'Augur Message','Primed Continuity'],weaponMods:['Amalgam Serration','Primed Fast Hands','Primed Shred','Speed Trigger','Radiated Reload','Vigilante Fervor'], secMods:['Primed Convulsion','Primed Heated Charge','Primed Pistol Gambit','Primed Target Cracker','Lethal Torrent'], meleeMods:['Primed Fury','Drifting Contact','Magnetic Rush','Quakening','Gladiator Vice','Body Count'], arcane1: 'Arcane Bellicose', arcane2: 'Molt Efficiency', arcanePrimary: 'Primary Dexterity', arcaneSecondary: 'Secondary Encumber', arcaneMelee: 'Melee Careen', shards: ['Crimson Ability Strength', 'Crimson Ability Strength', 'Crimson Ability Strength', 'Crimson Ability Duration', 'Crimson Ability Duration']},
      'Rhino Prime': {comp:'Adarza Kavat',prim:'Afentis',sec:'Kuva Nukor',melee:'Praedos',helminth:'Roar',mods:['Enemy Radar','Cunning Drift','Narrow Minded','Blind Rage','Primed Continuity','Umbral Intensify','Reinforcing Stomp','Transient Fortitude','Stretch','Overextended'],weaponMods:['Amalgam Serration','Primed Fast Hands','Primed Shred','Speed Trigger','Radiated Reload','Vigilante Fervor'], secMods:['Primed Convulsion','Primed Heated Charge','Primed Pistol Gambit','Primed Target Cracker','Lethal Torrent'], meleeMods:['Primed Fury','Drifting Contact','Magnetic Rush','Quakening','Gladiator Vice','Body Count'], arcane1: 'Arcane Bellicose', arcane2: 'Molt Efficiency', arcanePrimary: 'Primary Dexterity', arcaneSecondary: 'Secondary Encumber', arcaneMelee: 'Melee Careen', shards: ['Crimson Ability Strength', 'Crimson Ability Strength', 'Crimson Ability Strength', 'Crimson Ability Strength', 'Amber Parkour Velocity']},
      'Citrine': {comp:'Adarza Kavat',prim:'Afentis',sec:'Kuva Nukor',melee:'Praedos',helminth:'Nourish',mods:['Power Donation','Lightning Dash','Narrow Minded','Blind Rage','Precision Intensify','Augur Message','Archon Continuity','Archon Stretch','Constitution',"Nira's Hatred",'Recrystalize','Prismatic Companion'],weaponMods:['Amalgam Serration','Primed Fast Hands','Primed Shred','Speed Trigger','Radiated Reload','Vigilante Fervor'], secMods:['Primed Convulsion','Primed Heated Charge','Primed Pistol Gambit','Primed Target Cracker','Lethal Torrent'], meleeMods:['Primed Fury','Drifting Contact','Magnetic Rush','Quakening','Gladiator Vice','Body Count'], arcane1: 'Arcane Concentration', arcane2: 'Arcane Bellicose', arcanePrimary: 'Primary Dexterity', arcaneSecondary: 'Secondary Encumber', arcaneMelee: 'Melee Careen', shards: ['Crimson Ability Duration', 'Crimson Ability Duration', 'Crimson Ability Duration', 'Crimson Ability Duration', 'Crimson Ability Duration']},
      'Jade': {comp:'Adarza Kavat',prim:'Afentis',sec:'Kuva Nukor',melee:'Praedos',helminth:'Nourish',mods:['Growing Power','Power Donation','Cunning Drift','Primed Continuity','Umbral Intensify','Umbral Vitality','Umbral Fiber','Transient Fortitude','Blind Rage','Constitution','Augur Secrets',"Jade's Judgment"],weaponMods:['Amalgam Serration','Primed Fast Hands','Primed Shred','Speed Trigger','Radiated Reload','Vigilante Fervor'], secMods:['Primed Convulsion','Primed Heated Charge','Primed Pistol Gambit','Primed Target Cracker','Lethal Torrent'], meleeMods:['Primed Fury','Drifting Contact','Magnetic Rush','Quakening','Gladiator Vice','Body Count'], arcane1: 'Molt Vigor', arcane2: 'Molt Efficiency', arcanePrimary: 'Primary Dexterity', arcaneSecondary: 'Secondary Encumber', arcaneMelee: 'Melee Careen', shards: ['Crimson Ability Strength', 'Crimson Ability Strength', 'Crimson Ability Strength', 'Crimson Ability Strength', 'Crimson Ability Strength']}
    },
    Damage: {
      'Saryn Prime': {comp:'Sahasa Kubrow',prim:'Kuva Sobek',sec:'Akarius Prime',melee:'Praedos',helminth:'Roar',mods:['Power Donation','Toxic Flight','Primed Continuity','Primed Flow','Blind Rage','Energy Conversion','Umbral Intensify','Narrow Minded','Venom Dose','Constitution','Contagion Cloud'],weaponMods:['Galvanized Hell','Primed Point Blank','Critical Deceleration','Primed Ravage','Shotgun Elementalist','Acid Shells'], secMods:['Hornet Strike','Barrel Diffusion','Lethal Torrent','Primed Pistol Gambit','Primed Target Cracker','Primed Convulsion','Primed Heated Charge','Primed Fulmination'], meleeMods:['Primed Fury','Drifting Contact','Magnetic Rush','Quakening','Gladiator Vice','Body Count'], arcane1: 'Arcane Bellicose', arcane2: 'Arcane Battery', arcanePrimary: 'Primary Overcharge', arcaneSecondary: 'Secondary Fortifier', arcaneMelee: 'Melee Careen', shards: ['Emerald Toxin Damage', 'Emerald Toxin Damage', 'Amber Parkour Velocity', 'Amber Parkour Velocity', 'Amber Casting Speed']},
      'Cyte-09': {comp:'Sahasa Kubrow',prim:'Kuva Sobek',sec:'Akarius Prime',melee:'Praedos',helminth:'Nourish',mods:['Power Donation','Vigilante Pursuit','Blind Rage','Primed Flow','Equilibrium','Natural Talent','Ice Spring','Narrow Minded','Transient Fortitude','Umbral Intensify'],weaponMods:['Galvanized Hell','Primed Point Blank','Critical Deceleration','Primed Ravage','Shotgun Elementalist','Acid Shells'], secMods:['Hornet Strike','Barrel Diffusion','Lethal Torrent','Primed Pistol Gambit','Primed Target Cracker','Primed Convulsion','Primed Heated Charge','Primed Fulmination'], meleeMods:['Primed Fury','Drifting Contact','Magnetic Rush','Quakening','Gladiator Vice','Body Count'], arcane1: 'Arcane Concentration', arcane2: 'Arcane Bellicose', arcanePrimary: 'Primary Overcharge', arcaneSecondary: 'Secondary Fortifier', arcaneMelee: 'Melee Careen', shards: ['Violet Primary Electricity Damage', 'Violet Primary Electricity Damage', 'Violet Primary Electricity Damage', 'Amber Parkour Velocity', 'Amber Parkour Velocity']},
      'Mirage Prime': {comp:'Sahasa Kubrow',prim:'Kuva Ogris',sec:'Kuva Nukor',melee:'Praedos',helminth:'Eclipse',mods:['Power Donation','Primed Sure Footed','Narrow Minded','Energy Conversion','Stretch','Hall Of Malevolence','Blind Rage','Umbral Intensify','Primed Continuity','Total Eclipse'],weaponMods:['Galvanized Chamber','Primed Bane of Grineer','Nightwatch Napalm','Heavy Caliber','Primed Firestorm'], secMods:['Primed Convulsion','Primed Heated Charge','Primed Pistol Gambit','Primed Target Cracker','Lethal Torrent'], meleeMods:['Primed Fury','Drifting Contact','Magnetic Rush','Quakening','Gladiator Vice','Body Count'], arcane1: 'Molt Augmented', arcane2: 'Arcane Bellicose', arcanePrimary: 'Primary Overcharge', arcaneSecondary: 'Secondary Encumber', arcaneMelee: 'Melee Careen', shards: ['Amber Casting Speed', 'Amber Casting Speed', 'Amber Parkour Velocity', 'Amber Parkour Velocity', 'Violet Primary Electricity Damage']}
    },
    Weapon_Support: {
      'Wisp Prime': {comp:'Adarza Kavat',prim:'Afentis',sec:'Kuva Nukor',melee:'Praedos',helminth:'Dispensary',mods:['Power Donation','Power Drift','Umbral Intensify','Primed Continuity','Augur Secrets','Fused Reservoir','Critical Surge'],weaponMods:['Amalgam Serration','Primed Fast Hands','Primed Shred','Speed Trigger','Radiated Reload','Vigilante Fervor'], secMods:['Primed Convulsion','Primed Heated Charge','Primed Pistol Gambit','Primed Target Cracker','Lethal Torrent'], meleeMods:['Primed Fury','Drifting Contact','Magnetic Rush','Quakening','Gladiator Vice','Body Count'], arcane1: 'Molt Vigor', arcane2: 'Arcane Bellicose', arcanePrimary: 'Primary Dexterity', arcaneSecondary: 'Secondary Encumber', arcaneMelee: 'Melee Careen', shards: ['Crimson Ability Strength', 'Crimson Ability Strength', 'Crimson Ability Strength', 'Crimson Ability Strength', 'Crimson Ability Strength']},
      'Volt Prime': {comp:'Adarza Kavat',prim:'Afentis',sec:'Kuva Nukor',melee:'Praedos',helminth:'Dispensary',mods:['Power Donation','Power Drift','Shock Trooper','Precision Intensify','Narrow Minded','Augur Secrets'],weaponMods:['Amalgam Serration','Primed Fast Hands','Primed Shred','Speed Trigger','Radiated Reload','Vigilante Fervor'], secMods:['Primed Convulsion','Primed Heated Charge','Primed Pistol Gambit','Primed Target Cracker','Lethal Torrent'], meleeMods:['Primed Fury','Drifting Contact','Magnetic Rush','Quakening','Gladiator Vice','Body Count'], arcane1: 'Arcane Concentration', arcane2: 'Arcane Bellicose', arcanePrimary: 'Primary Dexterity', arcaneSecondary: 'Secondary Encumber', arcaneMelee: 'Melee Careen', shards: ['Crimson Ability Strength', 'Crimson Ability Strength', 'Crimson Ability Strength', 'Crimson Ability Strength', 'Crimson Ability Strength']}
    }
  }
};

const FRAME_MOD_TYPES = new Set([
  'Warframe','Warframe Mod','Augment','Augment Mod','Helminth','Peculiar Mod'
]);
const WEAPON_MOD_TYPES = new Set([
  'Primary Mod','Rifle Mod','Shotgun Mod','Bow Mod','Sniper Mod','Launcher Mod',
  'Secondary Mod','Pistol Mod','Dual Pistols Mod','Thrown Mod',
  'Melee Mod','Stance Mod','Arch-Gun Mod','Arch-Melee Mod','Archwing Mod',
  'Exalted Weapon Mod','Kitgun Mod','Zaw Mod'
]);
const NEVER_SHOW_TYPES = new Set([
  'Mod Set Mod','Transmutation Mod','Tektolyst Artifact Mod','Focus Way',
  'Parazon Mod','Plexus Mod','Railjack Mod','Necramech Mod',
  'Companion Mod','Sentinel Mod','Beast Mod','Posture Mod','K-Drive Mod',
  'Companion Weapon Riven Mod','Arch-Gun Riven Mod','Rifle Riven Mod',
  'Shotgun Riven Mod','Pistol Riven Mod','Melee Riven Mod',
  'Kitgun Riven Mod','Zaw Riven Mod','Arcane','Riven Mod'
]);

const SHARD_EFFECTS = {
  azure: {label: "Azure (Лазурный)", options: [
    {name: "Max Health", normal: "+150", tau: "+225"}, {name: "Max Shields", normal: "+150", tau: "+225"},
    {name: "Armor", normal: "+150", tau: "+225"}, {name: "Max Energy", normal: "+50", tau: "+75"},
    {name: "Health Regen", normal: "+5/s", tau: "+7.5/s"}
  ]},
  crimson: {label: "Crimson (Багровый)", options: [
    {name: "Ability Strength", normal: "+10%", tau: "+15%"}, {name: "Ability Duration", normal: "+10%", tau: "+15%"},
    {name: "Melee Critical Damage", normal: "+25%", tau: "+37.5%"}, {name: "Secondary Critical Chance", normal: "+25%", tau: "+37.5%"},
    {name: "Primary Status Chance", normal: "+25%", tau: "+37.5%"}
  ]},
  amber: {label: "Amber (Янтарный)", options: [
    {name: "Casting Speed", normal: "+25%", tau: "+37.5%"}, {name: "Parkour Velocity", normal: "+15%", tau: "+22.5%"},
    {name: "Health Orb Effectiveness", normal: "+50%", tau: "+75%"}, {name: "Energy Orb Effectiveness", normal: "+50%", tau: "+75%"},
    {name: "Ammo Pickup", normal: "+50%", tau: "+75%"}, {name: "Max Energy on Spawn", normal: "+30%", tau: "+45%"}
  ]},
  violet: {label: "Violet (Фиолетовый)", options: [
    {name: "Melee Critical Damage", normal: "+25%", tau: "+37.5%"}, {name: "Primary Electricity Damage", normal: "+25%", tau: "+37.5%"},
    {name: "Ability Damage on Corroded", normal: "+10%", tau: "+15%"}, {name: "Equilibrium", normal: "+50%", tau: "+75%"},
    {name: "Health Pickup", normal: "+50%", tau: "+75%"}
  ]},
  topaz: {label: "Topaz (Топазовый)", options: [
    {name: "Secondary Critical Chance", normal: "+25%", tau: "+37.5%"}, {name: "Health per Blast Kill", normal: "+1", tau: "+2"},
    {name: "Secondary Crit Chance per Heat Kill", normal: "+1% (max 50%)", tau: "+1.5% (max 75%)"},
    {name: "Ammo Efficiency", normal: "+15%", tau: "+22.5%"}, {name: "Reload Speed", normal: "+15%", tau: "+22.5%"}
  ]},
  emerald: {label: "Emerald (Изумрудный)", options: [
    {name: "Toxin Damage", normal: "+30%", tau: "+45%"}, {name: "Corrosive Stack on Status", normal: "+1 stack", tau: "+2 stacks"},
    {name: "Ability Damage on Corroded", normal: "+10%", tau: "+15%"}, {name: "Armor", normal: "+75", tau: "+112"},
    {name: "Health Regen on Toxin Kill", normal: "+5/s", tau: "+7.5/s"}
  ]}
};

const MECHANICS_CARDS = [
  {title: "Аддитивно vs Мультипликативно", color: "#e94560", lines: ["<b>Аддитивно</b> — сложение: <code>2+2=4</code>", "<b>Мультипликативно</b> — умножение: <code>2×2×2=8</code>", "Порядок критичен."]},
  {title: "Порядок сложения урона", color: "#4a8ac0", lines: ["<code>(База × {1 + Σмоды + Σотн.} + Плоские) × ΣАбсолютные</code>", "100 × (1+1.65+3) × (1+1.5) = 1412.5", "Roar (+150%) усиливает сильнее Vex Armor (+300%)."]},
  {title: "3 типа бонусов", color: "#3a9d5d", lines: ["<b>Относительные</b> — Serration, Vex Armor (аддитивно).", "<b>Абсолютные</b> — Roar, Eclipse, фракционные моды.", "<b>Плоские</b> — Iron Renewal, Covenant."]},
  {title: "4 категории снижения брони", color: "#e67e22", lines: ["<b>1. % базовой</b> — аддитивно (CP, Reckoning).", "<b>2. % текущей</b> — мультипликативно (коррозия).", "<b>3. −X ед. текущей</b> — вычитание (Polarize).", "<b>4. −X ед. базовой</b> — фикс. удары."]},
  {title: "Сопротивление урону (DR)", color: "#9b59b6", lines: ["Складывается <b>мультипликативно</b>:", "<code>1 − (1−a)(1−b)…</code>", "50% + 50% = 75%."]},
  {title: "Замедление", color: "#3498db", lines: ["Мультипликативно.", "Растягивает длительность статусов."]},
  {title: "Ускорение — 2 вида", color: "#2ecc71", lines: ["<b>Скорость бега</b> — аддитивно.", "<b>Скорость передвижения</b> — мультипликативно."]},
  {title: "Stealth-множитель", color: "#ff6b81", lines: ["<code>Множитель = 1 + 0.2 × Ранг</code>. На 30 ранге = <b>7x</b>.", "<code>Крит скрытности = 7 + Крит-множитель</code>"]},
  {title: "Заморозка / Остекленение", color: "#4a8ac0", lines: ["<b>Инстанс-ограничены</b>.", "Враг не восстанавливает щиты."]},
  {title: "Ключевые слова", color: "#e94560", lines: ["<b>Обновление</b> / <b>Продление</b> / <b>Раздельно</b> / <b>Инстанс-ограниченно</b>"]},
  {title: "Лут-способности", color: "#3a9d5d", lines: ["4 категории: при жизни / окаменении / убийстве / осквернении.", "Складываются между категориями."]},
  {title: "Невидимость", color: "#9b59b6", lines: ["Разные источники <b>раздельно</b>.", "С Roar складывается, с критом — аддитивно."]},
  {title: "Плоские аддитивные бонусы", color: "#e67e22", lines: ["Прибавляются после относительных, до абсолютных.", "<code>(База + Плоские) × Абсолютные</code>"]},
  {title: "Абсолютные множители", color: "#e94560", lines: ["Roar, Eclipse, фракционные моды.", "Умножают финал."]},
  {title: "Мультивыстрел", color: "#2ecc71", lines: ["Аддитивно с модами мультивыстрела.", "<code>Средний урон = база × (1 + Σ mult)</code>"]},
  {title: "Сложение между игроками", color: "#3498db", lines: ["Первый исп. / Последний исп. / Наиболее сильный / Аддитивно"]},
  {title: "Осколки — Tau vs обычный", color: "#f1c40f", lines: ["Tauforged ~1.5x сильнее.", "Берётся сильнейший.", "5 слотов."]},
  {title: "Формула EHP", color: "#4a8ac0", lines: ["<code>DR = броня / (броня + 300)</code>", "<code>EHP = HP / (1 − DR)</code>"]}
];

const MOD_RANKS = {
  serration: [0.15,0.30,0.45,0.60,0.75,0.90,1.05,1.20,1.35,1.50,1.65],
  split_chamber: [0.15,0.30,0.45,0.60,0.75,0.90],
  point_strike: [0.25,0.50,0.75,1.00,1.25,1.50],
  vital_sense: [0.20,0.40,0.60,0.80,1.00,1.20],
  heavy_caliber:       [0.15,0.30,0.45,0.60,0.75,0.90,1.05,1.20,1.35,1.50,1.65],
  galvanized_chamber:  [0.20,0.32,0.44,0.56,0.68,0.80],
  critical_delay:      [0.20,0.40,0.60,0.80,1.00],
  hammer_shot:         [0.10,0.20,0.30,0.40],
  
  hornet_strike: [0.40,0.60,0.80,1.00,1.20,1.40,1.60,1.80,2.00,2.20],
  barrel_diffusion: [0.20,0.40,0.60,0.80,1.00,1.20],
  pistol_gambit: [0.20,0.40,0.60,0.80,1.00,1.20],
  target_cracker: [0.20,0.40,0.60,0.80,1.00,1.20],

  pressure_point: [0.20,0.40,0.60,0.80,1.00,1.20],
  true_steel: [0.20,0.40,0.60,0.80,1.00,1.20],
  organ_shatter: [0.15,0.30,0.45,0.60,0.75,0.90]
};