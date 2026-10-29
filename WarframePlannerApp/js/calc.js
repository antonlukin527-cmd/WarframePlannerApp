const RIVEN_STATS = [
  { key: 'dmg', name: 'Урон (Damage)' },
  { key: 'multi', name: 'Мультивыстрел (Multishot)' },
  { key: 'crit', name: 'Шанс крита (Crit Chance)' },
  { key: 'critdmg', name: 'Крит урон (Crit Damage)' },
  { key: 'fireRate', name: 'Скорострельность (Fire Rate)' },
  { key: 'status', name: 'Шанс статуса (Status Chance)' },
  { key: 'elec', name: 'Электро (Electric)' },
  { key: 'heat', name: 'Огонь (Heat)' },
  { key: 'cold', name: 'Холод (Cold)' },
  { key: 'toxin', name: 'Токсин (Toxin)' },
  { key: 'impact', name: 'Удар (Impact)' },
  { key: 'puncture', name: 'Пронзание (Puncture)' },
  { key: 'slash', name: 'Разрез (Slash)' },
  { key: 'mag', name: 'Размер магазина' },
  { key: 'reload', name: 'Скорость перезарядки' },
  { key: 'zoom', name: 'Приближение' },
  { key: 'recoil', name: 'Отдача' },
  { key: 'flight', name: 'Скорость полёта' },
  { key: 'factionGrineer', name: 'Урон Гринир' },
  { key: 'factionCorpus', name: 'Урон Корпус' },
  { key: 'factionInfested', name: 'Урон Заражённым' }
];

// БАЗА ДАННЫХ ВРАГОВ
const ENEMY_DB = {
  // Grineer
  heavy_gunner: { name: 'Heavy Gunner', faction: 'Grineer', baseLevel: 8, hp: 300, armor: 500, shield: 0 },
  bombard: { name: 'Bombard', faction: 'Grineer', baseLevel: 4, hp: 300, armor: 500, shield: 0 },
  napalm: { name: 'Napalm', faction: 'Grineer', baseLevel: 8, hp: 350, armor: 600, shield: 0 },
  butcher: { name: 'Butcher', faction: 'Grineer', baseLevel: 1, hp: 50, armor: 5, shield: 0 },
  // Corpus
  tech: { name: 'Tech', faction: 'Corpus', baseLevel: 15, hp: 200, armor: 0, shield: 500 },
  crewman: { name: 'Crewman', faction: 'Corpus', baseLevel: 1, hp: 60, armor: 0, shield: 150 },
  moa: { name: 'Moa', faction: 'Corpus', baseLevel: 1, hp: 80, armor: 0, shield: 100 },
  nullifier: { name: 'Nullifier', faction: 'Corpus', baseLevel: 10, hp: 350, armor: 0, shield: 600 },
  // Infested
  ancient_healer: { name: 'Ancient Healer', faction: 'Infested', baseLevel: 5, hp: 400, armor: 0, shield: 0 },
  charger: { name: 'Charger', faction: 'Infested', baseLevel: 1, hp: 80, armor: 0, shield: 0 },
  // Murmur
  murmur_warden: { name: 'Severed Warden', faction: 'Murmur', baseLevel: 1, hp: 500, armor: 200, shield: 0 },
  murmur_fragment: { name: 'Fragment', faction: 'Murmur', baseLevel: 1, hp: 300, armor: 0, shield: 0 },
  // Scaldra
  scaldra_dedicant: { name: 'Dedicant', faction: 'Scaldra', baseLevel: 5, hp: 400, armor: 300, shield: 0 }
};

function renderCalcRivenBuilder() {
  const container = document.getElementById('calc_riven_builder');
  if(!container) return;
  const slots = [
    { id: 1, label: 'Позитив 1', color: 'var(--ok)' },
    { id: 2, label: 'Позитив 2', color: 'var(--ok)' },
    { id: 3, label: 'Позитив 3', color: 'var(--ok)' },
    { id: 4, label: 'Негатив', color: 'var(--accent)' }
  ];
  
  container.innerHTML = slots.map(slot => `
    <div>
      <label style="font-size:10px; color:${slot.color}; margin-bottom:2px; display:block;">${slot.label}</label>
      <div style="display:flex; gap:5px;">
        <select id="riven_slot_${slot.id}_type" style="flex:1; padding:4px; font-size:12px;" onchange="calculate()">
          <option value="">-- Нет стата --</option>
          ${RIVEN_STATS.map(s => `<option value="${s.key}">${s.name}</option>`).join('')}
        </select>
        <input type="number" id="riven_slot_${slot.id}_val" placeholder="0" style="width:65px; padding:4px; font-size:12px;" oninput="calculate()">
      </div>
    </div>
  `).join('');
}

function clearRivenCalc() {
  for (let i = 1; i <= 4; i++) {
    document.getElementById(`riven_slot_${i}_type`).value = '';
    document.getElementById(`riven_slot_${i}_val`).value = '';
  }
  calculate();
}

function populateCalcSelect(){
  const sel = document.getElementById('calc_build_select');
  if (!sel) return;
  sel.innerHTML = '<option value="-1">-- Ручной ввод --</option>' + builds.map((b, i) => `<option value="${i}">${b.frame || 'Без имени'} (${b.prim || b.sec || b.melee || ''})</option>`).join('');
}

function loadBuildForCalc(){
  currentCalcBuildIndex = parseInt(document.getElementById('calc_build_select').value);
  const slot = document.getElementById('calc_weapon_slot').value;
  
  if (currentCalcBuildIndex == -1){
    document.getElementById('calc_mods_group').style.display = 'none';
    calculate();
    return;
  }

  const b = builds[currentCalcBuildIndex];

  // Подгружаем статы Варфрейма для EHP
  const frameData = warframesData.find(f => f.name === (b.frame || ''));
  if (frameData) {
    let hp = frameData.health || 370;
    let sh = frameData.shield || 370;
    let ar = frameData.armor || 300;
    let drAb = 0;
    
    const frameMods = b.modsFrame ? b.modsFrame.split(', ') : [];

    if (frameMods.includes('Vitality') || frameMods.includes('Umbral Vitality')) hp *= 2;
    if (frameMods.includes('Redirection')) sh *= 2;
    if (frameMods.includes('Steel Fiber') || frameMods.includes('Umbral Fiber')) ar += (ar * 1.1);
    if (frameMods.includes('Adaptation')) drAb = 90;

    const arcaneText = (b.arcaneFrame || '') + ' ' + (b.arcaneFrame2 || '');
    if (arcaneText.includes('Guardian')) ar += 900;
    if (arcaneText.includes('Blessing')) hp += 1200;

    document.getElementById('surv_health').value = Math.round(hp);
    document.getElementById('surv_shields').value = Math.round(sh);
    document.getElementById('surv_armor').value = Math.round(ar);
    document.getElementById('surv_dr').value = drAb;
    
    calculateSurvivability();
  }
  
  const wpName = slot === 'primary' ? b.prim : slot === 'secondary' ? b.sec : b.melee;
  const wp = allWeapons.find(w => w.name === wpName);
  
  if (wp){
    const getWpStat = (obj, keys) => {
      for (let key of keys) {
        if (obj[key] !== undefined && obj[key] !== null) {
          if (typeof obj[key] === 'object' && obj[key].total !== undefined) return obj[key].total;
          return obj[key];
        }
      }
      return 0;
    };

    let dmgVal = getWpStat(wp, ['damage', 'Damage', 'totalDamage']) || 100;
    let fireRate = getWpStat(wp, ['fireRate', 'fire_rate', 'speed']) || 5;
    let critVal = getWpStat(wp, ['critChance', 'criticalChance', 'Crit', 'critical_chance']) || 0;
    let critDmg = getWpStat(wp, ['critMultiplier', 'criticalMultiplier', 'CritDmg']) || 2.0;
    let statusVal = getWpStat(wp, ['statusChance', 'status_chance', 'proc_chance']) || 20;

    if (critVal > 0 && critVal <= 1) critVal *= 100;
    if (statusVal > 0 && statusVal <= 1) statusVal *= 100;

    document.getElementById('calc_base').value = Number(dmgVal.toFixed(1));
    document.getElementById('calc_speed').value = Number(fireRate.toFixed(2));
    document.getElementById('calc_base_crit').value = Number(critVal.toFixed(2));
    document.getElementById('calc_base_critdmg').value = Number(critDmg.toFixed(2));
    document.getElementById('calc_base_status').value = Number(statusVal.toFixed(2));
  }
  
  let modsStr = '';
  if (slot === 'primary') modsStr = b.modsPrimary !== undefined ? b.modsPrimary : (b.modsWeapon || '');
  else if (slot === 'secondary') modsStr = b.modsSecondary || '';
  else if (slot === 'melee') modsStr = b.modsMelee || '';
  const modsArr = modsStr ? modsStr.split(', ').filter(Boolean) : [];
  
  document.getElementById('calc_viral').checked = modsArr.includes('Infected Clip') && modsArr.includes('Cryo Rounds');
  document.getElementById('calc_corrosive').checked = (modsArr.includes('Infected Clip') && modsArr.includes('Stormbringer')) || modsArr.includes('Virulent Scourge');

  document.getElementById('rank_dmg').value        = modsArr.includes('Serration') ? 10 : 0;
  document.getElementById('rank_multi').value      = modsArr.includes('Split Chamber') ? 5 : 0;
  document.getElementById('rank_crit').value       = modsArr.includes('Point Strike') ? 5 : 0;
  document.getElementById('rank_critdmg').value    = modsArr.includes('Vital Sense') ? 5 : 0;
  document.getElementById('rank_heavy_cal').value  = modsArr.includes('Heavy Caliber') ? 10 : 0;
  document.getElementById('rank_galv_cham').value  = modsArr.includes('Galvanized Chamber') ? 5 : 0;
  document.getElementById('rank_crit_delay').value = modsArr.includes('Critical Delay') ? 4 : 0;
  document.getElementById('rank_hammer_shot').value= modsArr.includes('Hammer Shot') ? 3 : 0;
  
  document.getElementById('calc_mods_group').style.display = 'block';
  document.getElementById('calc_mods_tags').innerHTML = modsArr.length ? modsArr.map(m => `<div class="mod-tag">${m}</div>`).join('') : '<div style="color:var(--dim)">Модов нет</div>';
  document.getElementById('calc_faction').value = b.faction || '1.0';
  document.getElementById('calc_bane').checked = b.bane || false;
  
  calculate();
}

function calculate(){
  const base       = parseFloat(document.getElementById('calc_base').value) || 0;
  const speed      = parseFloat(document.getElementById('calc_speed').value) || 1;
  const baseCrit   = (parseFloat(document.getElementById('calc_base_crit').value) || 0) / 100;
  const baseCritDmg= parseFloat(document.getElementById('calc_base_critdmg').value) || 1;
  const baseStatus = (parseFloat(document.getElementById('calc_base_status').value) || 0) / 100;

  const rDmg     = parseInt(document.getElementById('rank_dmg').value) || 0;
  const rMulti   = parseInt(document.getElementById('rank_multi').value) || 0;
  const rCrit    = parseInt(document.getElementById('rank_crit').value) || 0;
  const rCritDmg = parseInt(document.getElementById('rank_critdmg').value) || 0;
  const rHeavyCal= parseInt(document.getElementById('rank_heavy_cal').value) || 0;
  const rGalvCham= parseInt(document.getElementById('rank_galv_cham').value) || 0;
  const rCritDly = parseInt(document.getElementById('rank_crit_delay').value) || 0;
  const rHammer  = parseInt(document.getElementById('rank_hammer_shot').value) || 0;
  
  let rivenDmg = 0, rivenMulti = 0, rivenCrit = 0, rivenCritDmg = 0, rivenFireRate = 0, rivenStatus = 0, rivenElem = 0;

  for (let i = 1; i <= 4; i++) {
    const typeEl = document.getElementById(`riven_slot_${i}_type`);
    const valEl = document.getElementById(`riven_slot_${i}_val`);
    if (typeEl && valEl) {
      const type = typeEl.value;
      const val = (parseFloat(valEl.value) || 0) / 100;
      
      if (type === 'dmg') rivenDmg += val;
      else if (type === 'multi') rivenMulti += val;
      else if (type === 'crit') rivenCrit += val;
      else if (type === 'critdmg') rivenCritDmg += val;
      else if (type === 'fireRate') rivenFireRate += val;
      else if (type === 'status') rivenStatus += val;
      else if (['elec', 'heat', 'cold', 'toxin', 'impact', 'puncture', 'slash'].includes(type)) {
        rivenElem += val;
      }
    }
  }

  const dmgMod     = MOD_RANKS.serration[rDmg]        + MOD_RANKS.heavy_caliber[rHeavyCal] + rivenDmg + rivenElem;
  const multiMod   = MOD_RANKS.split_chamber[rMulti]  + MOD_RANKS.galvanized_chamber[rGalvCham] + rivenMulti;
  const critMod    = MOD_RANKS.point_strike[rCrit]    + MOD_RANKS.critical_delay[rCritDly] + rivenCrit;
  const critDmgMod = MOD_RANKS.vital_sense[rCritDmg]  + MOD_RANKS.hammer_shot[rHammer] + rivenCritDmg;
  
  const finalSpeed = speed * (1 + rivenFireRate);
  const finalBaseStatus = baseStatus + rivenStatus;

  const viral       = document.getElementById('calc_viral').checked ? 3.25 : 1;
  const corr        = document.getElementById('calc_corrosive').checked ? 0.8 : 0;
  const factionMult = parseFloat(document.getElementById('calc_faction').value) || 1.0;
  const bane        = document.getElementById('calc_bane').checked ? 0.55 : 0;
  const isStealth   = document.getElementById('calc_stealth').checked;
  const headshot    = document.getElementById('calc_headshot').checked ? 2.0 : 1.0;

  const roar    = document.getElementById('calc_roar').checked ? 0.50 : 0;
  const eclipse = document.getElementById('calc_eclipse').checked ? 2.00 : 0;
  const vex     = document.getElementById('calc_vex').checked ? 3.00 : 0;

  const totalDmgMod   = 1 + dmgMod + vex;
  const totalMultiMod = 1 + multiMod;

  const finalCritChance = baseCrit + critMod;
  const finalCritDmg    = baseCritDmg + critDmgMod;

  const critTier = Math.floor(finalCritChance);
  const critRem  = finalCritChance - critTier;
  const tierNames = ['жёлтый', 'оранжевый', 'красный', 'красный+'];
  let critTierText;
  if (finalCritChance < 0.01) {
    critTierText = 'нет крита';
  } else if (finalCritChance < 1) {
    critTierText = `${(finalCritChance * 100).toFixed(0)}% жёлтый`;
  } else {
    const c = Math.min(critTier, tierNames.length - 1);
    const n = Math.min(critTier + 1, tierNames.length - 1);
    if (critRem < 0.01) {
      critTierText = `100% ${tierNames[c]}`;
    } else {
      critTierText = `${((1 - critRem) * 100).toFixed(0)}% ${tierNames[c]} + ${(critRem * 100).toFixed(0)}% ${tierNames[n]}`;
    }
  }

  let critAvg;
  if (isStealth) {
    critAvg = 1 + finalCritChance * (finalCritDmg + 7 - 1);
  } else {
    critAvg = 1 + finalCritChance * (finalCritDmg - 1);
  }

  const absoluteMult = 1 + bane + roar + eclipse;

  // ==========================================
  // РАСЧЕТ ВРАГА (Система фракций и скейлинг)
  // ==========================================
  const enemyType = document.getElementById('enemy_type').value;
  let enemyLevel = parseInt(document.getElementById('enemy_level').value) || 1;
  const isSteelPath = document.getElementById('enemy_steel_path').checked;

  const enemyData = ENEMY_DB[enemyType] || ENEMY_DB.heavy_gunner;
  let baseHp = enemyData.hp;
  let baseArmor = enemyData.armor;
  let baseShield = enemyData.shield;
  let baseLevel = enemyData.baseLevel;

  const lvlDiff = Math.max(0, enemyLevel - baseLevel);
  let scaledHp = baseHp;
  let scaledArmor = baseArmor;
  let scaledShield = baseShield;

  if (lvlDiff > 0) {
    const hpMult = 1 + 0.015 * Math.pow(lvlDiff, 2.12);
    const armorMult = 1 + 0.005 * Math.pow(lvlDiff, 1.75);
    const shieldMult = 1 + 0.05 * Math.pow(lvlDiff, 1.5);
    
    scaledHp = baseHp * hpMult;
    scaledArmor = baseArmor * armorMult;
    scaledShield = baseShield * shieldMult;
  }

  if (isSteelPath) {
    scaledHp *= 2.5;
    scaledArmor *= 2.5;
    scaledShield *= 2.5;
  }

  if (corr > 0) {
    scaledArmor *= (1 - corr);
  }

  const enemyDR = scaledArmor / (scaledArmor + 300);
  const finalDamageTaken = 1 - enemyDR;

  const rawFinalHit = base * totalDmgMod * totalMultiMod * critAvg * absoluteMult * headshot * viral * factionMult;
  const damageToEnemy = rawFinalHit * finalDamageTaken;
  const dpsToEnemy = damageToEnemy * finalSpeed;

  const ttk = scaledHp / dpsToEnemy;

  document.getElementById('enemy_stats_display').innerHTML = `
    <div style="background:var(--panel); padding:5px; border-radius:4px;">
      <span style="font-size:10px;">Фракция:</span> <b style="color:var(--accent2)">${enemyData.faction}</b>
    </div>
    <div style="background:var(--panel); padding:5px; border-radius:4px;">
      <span style="font-size:10px;">HP:</span> <b>${Math.round(scaledHp)}</b>
    </div>
    <div style="background:var(--panel); padding:5px; border-radius:4px;">
      <span style="font-size:10px;">Броня:</span> <b>${Math.round(scaledArmor)}</b> (<span style="color:var(--accent)">DR: ${(enemyDR*100).toFixed(1)}%</span>)
    </div>
    <div style="background:var(--panel); padding:5px; border-radius:4px;">
      <span style="font-size:10px;">Щиты:</span> <b>${Math.round(scaledShield)}</b>
    </div>
  `;

  const equation = `${base} × (1+${dmgMod.toFixed(2)}+${vex.toFixed(2)}) × (1+${multiMod.toFixed(2)}) × ${critAvg.toFixed(3)}[крит] × (1+${bane.toFixed(2)}+${roar.toFixed(2)}+${eclipse.toFixed(2)}) × ${headshot.toFixed(1)}[хэдшот] × ${finalDamageTaken.toFixed(2)}[броня врага] × ${viral.toFixed(2)}[вирус] × ${factionMult.toFixed(2)}[фракция]`;

  document.getElementById('calc_result').innerHTML = `
    <div style="margin-bottom:12px;padding:10px;background:var(--panel3);border-radius:6px;font-size:12px;overflow-x:auto;white-space:nowrap;">
      <b style="color:var(--dim);">Уравнение:</b><br>
      <code style="color:var(--accent2);font-size:12px;">${equation}</code>
    </div>

    <b>Урон без модов:</b> ${base.toFixed(0)}<br>
    <b>С модами (крит/мульти):</b> ${(base * totalDmgMod * totalMultiMod * critAvg).toFixed(0)}<br>
    <b>Тиры крита:</b> ${critTierText}<br>
    <b>Средний крит-множитель:</b> ×${critAvg.toFixed(3)}<br>
    <hr style="border-color:var(--border);margin:10px 0">
    
    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
      <div>
        <b style="font-size:16px;color:var(--warn)">Урон по врагу: ${damageToEnemy.toFixed(0)}</b><br>
        <b style="font-size:16px;color:var(--warn)">ДПС по врагу: ${dpsToEnemy.toFixed(0)}</b>
      </div>
      <div style="text-align:right;">
        <b style="font-size:16px;color:var(--accent)">Время убийства (TTK):</b><br>
        <b style="font-size:20px;color:var(--accent)">${ttk > 60 ? (ttk/60).toFixed(1) + ' мин' : ttk.toFixed(1) + ' сек'}</b>
      </div>
    </div>
    
    <hr style="border-color:var(--border);margin:10px 0">
    <b style="font-size:14px;color:var(--text)">Финальный удар (в вакууме): ${rawFinalHit.toFixed(0)}</b><br>
    <b style="font-size:12px;color:var(--dim)">Slash DoT (средний): ${(0.35 * base * totalDmgMod * 7 / 6 * finalBaseStatus * viral * factionMult * absoluteMult).toFixed(0)}/сек</b>
  `;
}

function calculateArmor(){
  const base = parseFloat(document.getElementById('armor_base').value) || 0;
  const type = document.getElementById('armor_type').value;
  const val = parseFloat(document.getElementById('armor_value').value) || 0;
  const apps = Math.max(1, parseInt(document.getElementById('armor_applications').value) || 1);
  
  let remaining = base, extra = '';
  
  if (type === 'base_percent'){
    const totalPct = Math.min(100, val * apps);
    remaining = base * (1 - totalPct / 100);
    if (val * apps >= 100) extra = '🟢 <b>Полный снос брони!</b> (100%)';
  } else if (type === 'current_percent'){
    remaining = base * Math.pow(1 - val / 100, apps);
    extra = 'ℹ️ Каждый каст режет % от <i>текущей</i> брони.';
  } else if (type === 'current_flat'){
    remaining = Math.max(0, base - val * apps);
  } else if (type === 'base_flat'){
    remaining = Math.max(0, base - val * apps);
    extra = `ℹ️ Ударов до 0 брони: <b>${Math.ceil(base / val)}</b>`;
  }

  const drBefore = base / (base + 300);
  const drAfter = remaining / (remaining + 300);
  const relative = (((1 - drBefore) / (1 - drAfter)) - 1) * 100;
  
  window.lastArmorMultiplier = (1 - drAfter) / (1 - drBefore); 

  let html = `
    <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:10px;">
      <div style="background:var(--panel3); padding:10px; border-radius:6px; border-left:3px solid var(--dim)">
        <div style="font-size:11px; color:var(--dim); margin-bottom:5px;">ДО СНИЖЕНИЯ</div>
        <b>Броня:</b> ${base.toFixed(0)}<br>
        <b>DR:</b> ${(drBefore * 100).toFixed(1)}%
      </div>
      <div style="background:var(--panel3); padding:10px; border-radius:6px; border-left:3px solid var(--accent)">
        <div style="font-size:11px; color:var(--accent); margin-bottom:5px;">ПОСЛЕ СНИЖЕНИЯ</div>
        <b>Остаток:</b> ${remaining.toFixed(0)}<br>
        <b>DR:</b> ${(drAfter * 100).toFixed(1)}%
      </div>
    </div>
  `;

  if (remaining > 0) {
    html += `
      <div style="text-align:center; margin-top:15px; padding:15px; background:rgba(60, 157, 93, 0.1); border:1px solid var(--ok); border-radius:6px;">
        <div style="font-size:12px; color:var(--ok); text-transform:uppercase; letter-spacing:1px;">Прирост урона по цели</div>
        <div style="font-size:28px; font-weight:bold; color:var(--ok)">+${relative.toFixed(1)}%</div>
      </div>`;
  } else {
    html += `
      <div style="text-align:center; margin-top:15px; padding:15px; background:rgba(233, 69, 96, 0.1); border:1px solid var(--accent); border-radius:6px;">
        <div style="font-size:16px; font-weight:bold; color:var(--accent)">Броня полностью уничтожена!<br>Урон наносится на 100%</div>
      </div>`;
  }

  if (extra) html += `<div style="margin-top:10px; font-size:12px; color:var(--dim); text-align:center;">${extra}</div>`;
  
  document.getElementById('armor_result').innerHTML = html;
}

function calculateSurvivability(){
  const hp = parseFloat(document.getElementById('surv_health').value) || 0;
  const sh = parseFloat(document.getElementById('surv_shields').value) || 0;
  const ar = parseFloat(document.getElementById('surv_armor').value) || 0;
  const drAb = Math.min(0.999, (parseFloat(document.getElementById('surv_dr').value) / 100) || 0);
  
  const drArmor = ar / (ar + 300);
  const drTotal = 1 - (1 - drArmor) * (1 - drAb);
  
  const ehpHP = hp / (1 - drTotal);
  const ehpSh = sh / (1 - drAb);
  const ehpTotal = ehpHP + ehpSh;

  let html = `
    <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:10px; margin-bottom:15px;">
      <div style="background:var(--panel3); padding:10px; border-radius:6px; text-align:center;">
        <div style="font-size:11px; color:var(--dim);">DR от брони</div>
        <b style="font-size:16px; color:var(--text)">${(drArmor * 100).toFixed(1)}%</b>
      </div>
      <div style="background:var(--panel3); padding:10px; border-radius:6px; text-align:center;">
        <div style="font-size:11px; color:var(--dim);">DR от способностей</div>
        <b style="font-size:16px; color:var(--text)">${(drAb * 100).toFixed(1)}%</b>
      </div>
      <div style="background:var(--panel3); padding:10px; border-radius:6px; text-align:center; border:1px solid var(--accent);">
        <div style="font-size:11px; color:var(--accent);">Итоговый DR</div>
        <b style="font-size:16px; color:var(--accent)">${(drTotal * 100).toFixed(1)}%</b>
      </div>
    </div>
  `;

  html += `
    <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:15px; font-size:12px;">
      <div style="background:var(--panel3); padding:10px; border-radius:6px;">
        <b>EHP по здоровью:</b> <span style="float:right">${ehpHP.toFixed(0)}</span><br>
        <small style="color:var(--dim)">(${hp} HP защищены бронёй и способностями)</small>
      </div>
      <div style="background:var(--panel3); padding:10px; border-radius:6px;">
        <b>EHP по щитам:</b> <span style="float:right">${ehpSh.toFixed(0)}</span><br>
        <small style="color:var(--dim)">(${sh} Щитов защищены только способностями)</small>
      </div>
    </div>
    
    <div style="text-align:center; padding:15px; background:rgba(74, 138, 192, 0.1); border:1px solid #4a8ac0; border-radius:6px;">
      <div style="font-size:12px; color:#4a8ac0; text-transform:uppercase; letter-spacing:1px;">Общее эффективное здоровье (EHP)</div>
      <div style="font-size:32px; font-weight:bold; color:#4a8ac0; line-height:1.2;">${ehpTotal.toFixed(0)}</div>
    </div>
  `;

  document.getElementById('surv_result').innerHTML = html;

  const ehpInput = document.getElementById('surv_current_ehp');
  if (ehpInput) {
    ehpInput.value = Math.round(ehpTotal);
    calculateSurvivalNeeds(); 
  }
}

function calculateSurvivalNeeds() {
  const level = parseInt(document.getElementById('surv_level').value) || 1;
  const ehp = parseInt(document.getElementById('surv_current_ehp').value) || 0;

  const estimatedDps = Math.pow(level / 10, 2.5) * 50; 
  
  let advice = '';
  let statusColor = 'var(--ok)';
  let title = 'Выживание в норме';

  if (ehp < estimatedDps * 0.5) {
    statusColor = 'var(--accent)';
    title = '⚠️ Критическая уязвимость';
    advice = `
      <p>На уровне <b>${level}</b> враги наносят примерно <b>${estimatedDps.toFixed(0)}</b> урона в секунду (DPS).</p>
      <p>Вашего EHP (<b>${ehp}</b>) не хватит даже на секунду. Вас убьют мгновенно (One-shot).</p>
      <hr style="border-color:var(--border);margin:10px 0">
      <b>Что вам нужно:</b>
      <ul style="margin-left:20px; font-size:13px; line-height:1.6;">
        <li>🔴 <b>Shield Gating:</b> Используйте <i>Brief Respite</i> и моды <i>Augur</i>.</li>
        <li>🟡 <b>Неуязвимость:</b> <i>Rolling Guard</i>.</li>
        <li>🔵 <b>Огромный DR:</b> Способность с 90% снижением урона (Gloom, Blessing).</li>
      </ul>
    `;
  } else if (ehp < estimatedDps * 2) {
    statusColor = '#e67e22';
    title = 'Внимание: Нужна поддержка';
    advice = `
      <p>На уровне <b>${level}</b> входящий урон составляет ~<b>${estimatedDps.toFixed(0)}</b> DPS.</p>
      <p>Ваше EHP (<b>${ehp}</b>) позволит выжить пару секунд под фокусом.</p>
      <hr style="border-color:var(--border);margin:10px 0">
      <b>Рекомендации:</b>
      <ul style="margin-left:20px; font-size:13px; line-height:1.6;">
        <li>Вам нужен <b>постоянный отхил</b> (Gloom, Dispensary).</li>
        <li>Добавьте в билд <b>Adaptation</b>.</li>
      </ul>
    `;
  } else {
    advice = `
      <p>На уровне <b>${level}</b> входящий урон составляет ~<b>${estimatedDps.toFixed(0)}</b> DPS.</p>
      <p>Ваше EHP (<b>${ehp}</b>) позволяет вам уверенно танковать этот урон!</p>
    `;
  }

  document.getElementById('surv_mechanics_result').innerHTML = `
    <div style="background:rgba(255,255,255,0.03); padding:15px; border-radius:8px; border-left:4px solid ${statusColor}">
      <h4 style="color:${statusColor}; margin-top:0; font-size:16px;">${title}</h4>
      <div style="font-size:13px; color:var(--text);">
        ${advice}
      </div>
    </div>
  `;
}

function switchCalcTab(id, btn) {
  document.querySelectorAll('#panel-calc .itab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('#panel-calc .itab-panel').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('calc-tab-' + id).classList.add('active');
}

function applyArmorToDamage() {
  if (!window.lastArmorMultiplier) return;
  const mult = window.lastArmorMultiplier.toFixed(2);
  document.getElementById('calc_armor_mult').value = mult;
  calculate();
  const dmgTabBtn = document.querySelector('#panel-calc .itab');
  switchCalcTab('dmg', dmgTabBtn);
}