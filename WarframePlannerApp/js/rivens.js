// Заполнение списка оружия для ривейнов
function initRivenWeaponList() {
  const dl = document.getElementById('riven_weapon_list');
  if (!dl || typeof allWeapons === 'undefined') return;
  
  const validTypes = ['primary', 'secondary', 'melee'];
  const weapons = allWeapons.filter(w => {
    const t = (w.type || '').toLowerCase();
    const c = (w.category || '').toLowerCase();
    const pc = (w.productCategory || '').toLowerCase();
    return validTypes.includes(t) || validTypes.includes(c) || validTypes.includes(pc);
  });

  const uniqueWeapons = new Map();
  weapons.forEach(w => uniqueWeapons.set(w.name, w));
  
  dl.innerHTML = Array.from(uniqueWeapons.values())
    .sort((a,b) => a.name.localeCompare(b.name))
    .map(w => `<option value="${w.name}">`).join('');
}

function analyzeWeaponForRiven() {
  const name = document.getElementById('riven_weapon_search').value;
  const resEl = document.getElementById('riven_analysis_result');
  
  const wp = allWeapons.find(w => w.name.toLowerCase() === name.toLowerCase());
  if (!wp) {
    resEl.style.display = 'none';
    return;
  }

  const getStat = (obj, keys) => {
    for (let key of keys) {
      if (obj[key] !== undefined && obj[key] !== null) {
        if (typeof obj[key] === 'object' && obj[key].total !== undefined) return obj[key].total;
        return obj[key];
      }
    }
    return 0;
  };

  let crit = getStat(wp, ['critChance', 'Crit', 'critical_chance']);
  let stat = getStat(wp, ['statusChance', 'status_chance']);
  let dmg = getStat(wp, ['damage', 'Damage', 'totalDamage']);
  let multishot = getStat(wp, ['multishot', 'multishot_chance']); 

  if (crit > 0 && crit <= 1) crit *= 100;
  if (stat > 0 && stat <= 1) stat *= 100;
  
  let archetype = '', color = '', pos1 = '', pos2 = '', pos3 = '', neg = '';

  // Умный подбор идеальных статов
  if (crit >= 20 && stat < 15) {
    archetype = 'Критовое оружие';
    color = '#e94560';
    pos1 = 'critdmg'; 
    pos2 = 'crit';    
    pos3 = 'multi';   
    neg = 'zoom';     
  } 
  else if (stat >= 25 && crit < 15) {
    archetype = 'Статусное оружие';
    color = '#3498db';
    pos1 = 'multi';   
    pos2 = 'status';  
    pos3 = 'toxin';   
    neg = 'crit';     
  } 
  else {
    archetype = 'Гибридное оружие (Мета)';
    color = '#2ecc71';
    pos1 = 'multi';   
    pos2 = 'critdmg'; 
    pos3 = 'status';  
    neg = 'zoom';     
  }

  if ((wp.subType && wp.subType.includes('Shotgun')) || (wp.type && wp.type.includes('Shotgun'))) {
    pos1 = 'multi';
  }

  const getStatName = (key) => {
     const names = {
       dmg: 'Урон', multi: 'Мультивыстрел', crit: 'Шанс крита', critdmg: 'Крит урон',
       status: 'Шанс статуса', toxin: 'Токсин', zoom: 'Приближение'
     };
     return names[key] || key;
  }

  resEl.style.display = 'block';
  resEl.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
      <h4 style="color:${color}; margin:0;">${wp.name}</h4>
      <span style="background:${color}; color:#fff; padding:4px 8px; border-radius:4px; font-weight:bold; font-size:12px;">${archetype}</span>
    </div>
    
    <div style="display:grid; grid-template-columns: 1fr 1fr 1fr; gap:10px; margin-bottom:20px; text-align:center;">
      <div style="background:var(--panel3); padding:8px; border-radius:6px;">
        <div style="font-size:11px; color:var(--dim);">Базовый урон</div>
        <b style="font-size:18px;">${Number(dmg).toFixed(0)}</b>
      </div>
      <div style="background:var(--panel3); padding:8px; border-radius:6px;">
        <div style="font-size:11px; color:var(--dim);">Крит / Статус</div>
        <b style="font-size:18px;">${crit.toFixed(1)}% / ${stat.toFixed(1)}%</b>
      </div>
      <div style="background:var(--panel3); padding:8px; border-radius:6px;">
        <div style="font-size:11px; color:var(--dim);">Мультивыстрел</div>
        <b style="font-size:18px;">${multishot > 0 ? multishot.toFixed(2) : '1.00'}</b>
      </div>
    </div>

    <div style="background:var(--panel2); padding:15px; border-radius:8px; border-left:3px solid var(--warn);">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
        <h5 style="color:var(--warn); margin:0;">Идеальный Ривейн:</h5>
        <button class="btn-p" onclick="applyRivenToCalc('${pos1}', '${pos2}', '${pos3}', '${neg}')" style="font-size:11px; padding:4px 8px;">⬇️ В калькулятор</button>
      </div>
      <ul style="margin-left:20px; line-height:1.8; font-size:13px;">
        <li style="color:var(--ok)"><b>+ ${getStatName(pos1)}</b></li>
        <li style="color:var(--ok)"><b>+ ${getStatName(pos2)}</b></li>
        <li style="color:var(--ok)"><b>+ ${getStatName(pos3)}</b></li>
        <li style="color:var(--accent); margin-top:5px;"><b>- ${getStatName(neg)}</b> (Негатив)</li>
      </ul>
    </div>
  `;
}

// Функция отправки статов из вкладки Ривинов в Калькулятор
function applyRivenToCalc(pos1, pos2, pos3, neg) {
  const calcTabBtn = document.querySelector('.main-tabs .tab:nth-child(3)'); // Кнопка Калькулятора
  if(calcTabBtn) switchTab('calc', calcTabBtn);

  const mapToSlot = (slotId, statKey, val) => {
    const typeEl = document.getElementById(`riven_slot_${slotId}_type`);
    const valEl = document.getElementById(`riven_slot_${slotId}_val`);
    if (typeEl && valEl) {
      typeEl.value = statKey;
      valEl.value = val;
    }
  };

  // Примерные значения для идеального ролла
  mapToSlot(1, pos1, 150);
  mapToSlot(2, pos2, 120);
  mapToSlot(3, pos3, 90);
  mapToSlot(4, neg, -60); 

  calculate();
}