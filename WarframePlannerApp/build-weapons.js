// build-weapons.js — запуск: node build-weapons.js
const Items = require('warframe-items');
const fs = require('fs');

// Хелпер: безопасно достать поле из объекта предмета
const pick = (obj, key, fallback = null) => (obj[key] !== undefined && obj[key] !== null ? obj[key] : fallback);

// Хелпер: нормализовать числовое поле (Warframe API иногда отдаёт строки)
const num = (val) => {
  if (val === undefined || val === null) return 0;
  const n = parseFloat(val);
  return isNaN(n) ? 0 : n;
};

// Хелпер: маппинг одного предмета в структуру вашего HTML
function mapItem(item, forcedType) {
  return {
    name: item.name,
    type: forcedType || item.type || '',
    subType: item.type || item.subType || '',   // для оружия type = подтип (Rifle, Shotgun...)
    imageName: item.imageName || null,
    masteryRank: num(item.masteryReq),
    damage: num(item.damage),
    critChance: num(item.criticalChance),
    statusChance: num(item.statusChance),
    fireRate: num(item.fireRate),
    // опционально: можно добавить больше полей, если понадобятся
    // critMultiplier: num(item.criticalMultiplier),
    // reloadTime: num(item.reloadTime),
  };
}

// Хелпер: записать файл в формате window.WF_XXX = [...]
function writeDataFile(varname, filename, items) {
  const content = `window.${varname} = ${JSON.stringify(items, null, 0)};`;
  fs.writeFileSync(filename, content, 'utf8');
  console.log(`✅ ${filename}: ${items.length} записей`);
}

// ---------- Primary ----------
const primaryItems = new Items({ category: ['Primary'] });
const primary = primaryItems.map(i => mapItem(i, 'Primary'));
writeDataFile('WF_PRIMARY', 'primary_data.js', primary);

// ---------- Secondary ----------
const secondaryItems = new Items({ category: ['Secondary'] });
const secondary = secondaryItems.map(i => mapItem(i, 'Secondary'));
writeDataFile('WF_SECONDARY', 'secondary_data.js', secondary);

// ---------- Melee ----------
const meleeItems = new Items({ category: ['Melee'] });
const melee = meleeItems.map(i => mapItem(i, 'Melee'));
writeDataFile('WF_MELEE', 'melee_data.js', melee);

// ---------- Warframes ----------
const warframeItems = new Items({ category: ['Warframes'] });
const warframes = warframeItems.map(i => ({
  name: i.name,
  type: 'Warframe',
  imageName: i.imageName || null,
  masteryRank: num(i.masteryReq),
  // для варфреймов поля damage/crit не нужны — оставляем только имя и картинку
}));
writeDataFile('WF_WARFRAMES', 'warframes_data.js', warframes);

console.log('\n🎉 Готово. Все четыре файла обновлены.');