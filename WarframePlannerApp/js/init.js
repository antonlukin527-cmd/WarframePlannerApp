// Мы оборачиваем всё в асинхронную функцию, чтобы сначала загрузить данные
document.addEventListener('DOMContentLoaded', async () => {
  
  // Функция для безопасной загрузки JSON
  const fetchJson = async (filename) => {
    try {
      const response = await fetch(`data/json/${filename}.json`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (e) {
      console.error(`❌ Ошибка загрузки ${filename}.json:`, e);
      return []; // Возвращаем пустой массив, чтобы приложение не упало
    }
  };

  console.log("⏳ Загрузка баз данных...");

  // Загружаем все файлы (имена должны совпадать с теми, что в папке data/json)
  window.WF_PRIMARY = await fetchJson('primary_data');
  window.WF_SECONDARY = await fetchJson('secondary_data');
  window.WF_MELEE = await fetchJson('melee_data');
  window.WF_SENTINELWEAPONS = await fetchJson('sentinelweapons_data');
  window.WF_ARCHGUN = await fetchJson('archgun_data');
  window.WF_ARCHMELEE = await fetchJson('archmelee_data');
  window.WF_AMPS = await fetchJson('amps_data');
  window.WF_NECRAMECH = await fetchJson('necramech_data');
  window.WF_WARFRAMES = await fetchJson('warframes_data');
  window.WF_MODS = await fetchJson('mods_data');
  window.WF_PETS = await fetchJson('pets_data');
  window.WF_SENTINELS = await fetchJson('sentinels_data');
  window.WF_ARCANES = await fetchJson('arcanes_data');
  window.WF_RELICS = await fetchJson('relics_data');

  console.log("✅ Данные загружены. Запуск приложения...");

  // === ДАЛЬШЕ ИДЕТ ВАШ СТАРЫЙ КОД ИЗ INIT.JS ===
  // (То, что раньше было внутри DOMContentLoaded)
  
  const pushData = (t, s) => { if (!s) return; if (Array.isArray(s)) t.push(...s); else t.push(s); };
  pushData(allWeapons, window.WF_PRIMARY);
  pushData(allWeapons, window.WF_SECONDARY);
  pushData(allWeapons, window.WF_MELEE);
  pushData(allWeapons, window.WF_SENTINELWEAPONS);
  pushData(allWeapons, window.WF_ARCHGUN);
  pushData(allWeapons, window.WF_ARCHMELEE);
  pushData(allWeapons, window.WF_AMPS);
  pushData(allWeapons, window.WF_NECRAMECH);
  
  if (window.WF_WARFRAMES) warframesData = window.WF_WARFRAMES;
  if (window.WF_MODS) modsData = window.WF_MODS;
  pushData(companionsData, window.WF_PETS);
  pushData(companionsData, window.WF_SENTINELS);

  // Ручное добавление оружия (если нужно)
  const manualWeapons = [
    {name:"Vinquibus",type:"Primary",subType:"Bayonet",tier:"A",desc:"Оружие Уриила.",imageName:"Vinquibus.png",masteryRank:14,damage:400,critChance:40.0,statusChance:20.0},
    {name:"Catchmoon",type:"Secondary",subType:"Kitgun",tier:"A",desc:"Китган.",imageName:"Catchmoon.png",masteryRank:0,damage:260,critChance:26.0,statusChance:14.0},
    {name:"Gaze",type:"Secondary",subType:"Kitgun",tier:"A",desc:"Китган.",imageName:"Gaze.png",masteryRank:0,damage:25,critChance:20.0,statusChance:34.0},
    {name:"Rattleguts",type:"Secondary",subType:"Kitgun",tier:"A",desc:"Китган.",imageName:"Rattleguts.png",masteryRank:0,damage:30,critChance:17.0,statusChance:19.0},
    {name:"Sporelacer",type:"Secondary",subType:"Kitgun",tier:"A",desc:"Китган.",imageName:"Sporelacer.png",masteryRank:0,damage:300,critChance:29.0,statusChance:21.0},
    {name:"Tombfinger",type:"Secondary",subType:"Kitgun",tier:"A",desc:"Китган.",imageName:"Tombfinger.png",masteryRank:0,damage:200,critChance:24.0,statusChance:14.0},
    {name:"Vermisplicer",type:"Secondary",subType:"Kitgun",tier:"A",desc:"Китган.",imageName:"Vermisplicer.png",masteryRank:0,damage:22,critChance:15.0,statusChance:31.0},
    {name:"Balla",type:"Melee",subType:"Zaw",tier:"A",desc:"Зо.",imageName:"Balla.png",masteryRank:0,damage:120,critChance:20.0,statusChance:20.0},
    {name:"Cyath",type:"Melee",subType:"Zaw",tier:"A",desc:"Зо.",imageName:"Cyath.png",masteryRank:0,damage:180,critChance:10.0,statusChance:30.0},
    {name:"Dokrahm",type:"Melee",subType:"Zaw",tier:"A",desc:"Зо.",imageName:"Dokrahm.png",masteryRank:0,damage:250,critChance:15.0,statusChance:25.0},
    {name:"Kronsh",type:"Melee",subType:"Zaw",tier:"A",desc:"Зо.",imageName:"Kronsh.png",masteryRank:0,damage:220,critChance:15.0,statusChance:15.0},
    {name:"Mewan",type:"Melee",subType:"Zaw",tier:"A",desc:"Зо.",imageName:"Mewan.png",masteryRank:0,damage:160,critChance:20.0,statusChance:20.0},
    {name:"Ooltha",type:"Melee",subType:"Zaw",tier:"A",desc:"Зо.",imageName:"Ooltha.png",masteryRank:0,damage:140,critChance:15.0,statusChance:25.0},
    {name:"Plague Keewar",type:"Melee",subType:"Zaw",tier:"A",desc:"Зо.",imageName:"Plague_Keewar.png",masteryRank:0,damage:230,critChance:15.0,statusChance:30.0},
    {name:"Plague Kripath",type:"Melee",subType:"Zaw",tier:"A",desc:"Зо.",imageName:"Plague_Kripath.png",masteryRank:0,damage:150,critChance:20.0,statusChance:30.0},
    {name:"Rabvee",type:"Melee",subType:"Zaw",tier:"A",desc:"Зо.",imageName:"Rabvee.png",masteryRank:0,damage:240,critChance:10.0,statusChance:25.0},
    {name:"Sepfahn",type:"Melee",subType:"Zaw",tier:"A",desc:"Зо.",imageName:"Sepfahn.png",masteryRank:0,damage:180,critChance:20.0,statusChance:20.0},
    {name:"Voidrig",type:"Necramech",subType:"Necramech",tier:"A",desc:"Некрамех.",imageName:"Voidrig.png",masteryRank:0,damage:0,critChance:0,statusChance:0},
    {name:"Bonewidow",type:"Necramech",subType:"Necramech",tier:"A",desc:"Некрамех.",imageName:"Bonewidow.png",masteryRank:0,damage:0,critChance:0,statusChance:0},
    {name:"Mausolon",type:"Arch-Gun",subType:"Necramech Gun",tier:"A",desc:"Оружие Некрамеха.",imageName:"Mausolon.png",masteryRank:0,damage:150,critChance:20.0,statusChance:20.0},
    {name:"Cortege",type:"Arch-Gun",subType:"Necramech Gun",tier:"A",desc:"Оружие Некрамеха.",imageName:"Cortege.png",masteryRank:0,damage:80,critChance:15.0,statusChance:25.0},
    {name:"Morgha",type:"Arch-Gun",subType:"Necramech Gun",tier:"A",desc:"Оружие Некрамеха.",imageName:"Morgha.png",masteryRank:0,damage:300,critChance:25.0,statusChance:15.0}
  ];

  const wKey = w => `${w.type || w.category || 'unknown'}::${w.name}`;
  const existing = new Set(allWeapons.map(wKey));
  const toAdd = manualWeapons.filter(w => !existing.has(wKey(w)));
  allWeapons.unshift(...toAdd);

  const mc = document.getElementById('modsCount');
  if (mc) mc.textContent = modsData.length;

  // Безопасный запуск
  try { populateShardSelects(); } catch(e) { console.error('Ошибка осколков', e); }
  try { renderBuilds(); } catch(e) { console.error('Ошибка билдов', e); }
  try { renderOperator(); } catch(e) { console.error('Ошибка оператора', e); }
  try { renderShards(); } catch(e) { console.error('Ошибка рендера осколков', e); }
  try { renderDatabase(); } catch(e) { console.error('Ошибка базы данных', e); }
  try { renderMechanics(); } catch(e) { console.error('Ошибка механик', e); }
  try { populateCalcSelect(); } catch(e) { console.error('Ошибка калькулятора', e); }
  try { initRivenWeaponList(); } catch(e) { console.error('Ошибка списка ривейнов', e); }
  
  if (document.getElementById('calc_riven_builder')) {
      try { renderCalcRivenBuilder(); } catch(e) { console.error('Ошибка Riven Builder', e); }
  }

  // Инициализация новых модулей (Инструменты, Компаньоны)
  if (typeof initIncarnonTracker === 'function') initIncarnonTracker();
  if (typeof initZawBuilder === 'function') initZawBuilder();
  if (typeof renderCompanionMods === 'function') renderCompanionMods();
  if (typeof renderRelics === 'function') { try { renderRelics(); } catch(e) { console.error('Ошибка рендера реликвий', e); } }
  if (typeof applyThemeSettings === 'function') applyThemeSettings();

  try { calculate(); } catch(e) { console.error(e); }
  try { calculateArmor(); } catch(e) { console.error(e); }
  try { calculateSurvivability(); } catch(e) { console.error(e); }
  
  try { updateCapacity(); } catch(e) { console.error('Ошибка Capacity', e); }

  console.log('✅ WF Planner loaded. Weapons:', allWeapons.length, 'Warframes:', warframesData.length, 'Mods:', modsData.length);
});
