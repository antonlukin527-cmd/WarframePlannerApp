// build-mods.js — запуск: node build-mods.js
const Items = require('warframe-items');
const fs = require('fs');

// Тянем только категорию Mods, чтобы не грузить все данные (экономия памяти)
const items = new Items({ category: ['Mods'] });

// Маппинг в структуру, которую ожидает ваш текущий код
// В renderModPicker используются: name, type, imageName, nameRu (опционально)
const mods = items.map(m => ({
  name: m.name,
  type: m.type,
  imageName: m.imageName || null,
  // Необязательные поля для расширения — оставьте по необходимости
  polarity: m.polarity || null,
  rarity: m.rarity || null,
  baseDrain: m.baseDrain ?? null,
  fusionLimit: m.fusionLimit ?? null,
}));

// Дедупликация (одинаковые моды могут повторяться из-за разных рангов)
const seen = new Set();
const unique = mods.filter(m => {
  if (seen.has(m.name)) return false;
  seen.add(m.name);
  return true;
});

fs.writeFileSync(
  'mods_data.js',
  `window.WF_MODS = ${JSON.stringify(unique)};`,
  'utf8'
);

console.log(`✅ Сгенерирован mods_data.js: ${unique.length} модов`);