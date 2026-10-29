// Умный авто-оптимизатор билдов
function autoOptimizeBuild() {
  const slot = document.getElementById('opt_target_slot').value;
  const fieldId = slot === 'primary' ? 'edit_prim' : slot === 'secondary' ? 'edit_sec' : 'edit_melee';
  const wpName = document.getElementById(fieldId).value;
  
  if (!wpName) {
    alert(`Сначала выберите оружие в слоте "${slot === 'primary' ? 'Основное' : slot === 'secondary' ? 'Вторичное' : 'Ближний бой'}"!`);
    return;
  }

  const wp = allWeapons.find(w => w.name === wpName);
  if (!wp) {
    alert("Оружие не найдено в базе данных.");
    return;
  }

  // Извлекаем базовые статы
  const getStat = (obj, keys) => {
    for (let key of keys) {
      if (obj[key] !== undefined && obj[key] !== null) {
        if (typeof obj[key] === 'object' && obj[key].total !== undefined) return obj[key].total;
        return obj[key];
      }
    }
    return 0;
  };

  let crit = getStat(wp, ['critChance', 'criticalChance', 'Crit', 'critical_chance']);
  let stat = getStat(wp, ['statusChance', 'status_chance', 'proc_chance']);
  
  if (crit > 0 && crit <= 1) crit *= 100;
  if (stat > 0 && stat <= 1) stat *= 100;

  const isMelee = slot === 'melee';
  const isShotgun = (wp.subType && wp.subType.includes('Shotgun')) || (wp.type && wp.type.includes('Shotgun'));
  const isPistol = slot === 'secondary';

  let archetype = 'hybrid';
  if (crit >= 20 && stat < 15) archetype = 'crit';
  else if (stat >= 25 && crit < 15) archetype = 'status';
  else if (crit < 10 && stat < 10) archetype = 'raw';

  let mods = [];

  if (isMelee) {
    mods.push('Primed Pressure Point');
    if (archetype !== 'status') mods.push('Sacrificial Steel');
  } else {
    mods.push(isPistol ? 'Hornet Strike' : 'Serration');
    
    if (isShotgun) {
      mods.push('Primed Point Blank', 'Galvanized Hell');
    } else {
      mods.push('Split Chamber');
      if (isPistol) mods.push('Lethal Torrent'); 
    }
  }

  if (archetype === 'crit' || archetype === 'hybrid') {
    if (isMelee) {
      mods.push('Blood Rush', 'Organ Shatter', 'Gladiator Might');
    } else {
      mods.push(isPistol ? 'Primed Pistol Gambit' : 'Point Strike');
      mods.push(isPistol ? 'Primed Target Cracker' : 'Vital Sense');
      if (slot === 'primary' && !isShotgun) mods.push('Hunter Munitions');
    }
  }

  if (archetype === 'status' || archetype === 'hybrid') {
    mods.push('Infected Clip', 'Cryo Rounds');
    if (isShotgun) mods.push('Galvanized Savvy');
    else if (!isMelee) mods.push('Galvanized Aptitude');
  } else {
    mods.push('Stormbringer', 'Infected Clip');
  }

  if (isMelee) {
    mods.push('Berserker Fury', 'Primed Reach');
  } else {
    mods.push(isPistol ? 'Anemic Agility' : 'Vile Acceleration');
  }

  if (document.getElementById('edit_bane') && document.getElementById('edit_bane').checked) {
    mods.push(isMelee ? 'Primed Smite Grineer' : 'Primed Bane of Grineer');
  }

  mods = mods.slice(0, 8);

  currentMods[slot] = mods;
  if (typeof currentPolarities !== 'undefined' && currentPolarities[slot]) {
    currentPolarities[slot] = new Array(mods.length).fill('');
  }
  
  if (typeof renderModTags === 'function') renderModTags();
  
  alert(`✨ Билд успешно оптимизирован!\nАрхетип: ${archetype.toUpperCase()}\nСобрано модов: ${mods.length}`);
}