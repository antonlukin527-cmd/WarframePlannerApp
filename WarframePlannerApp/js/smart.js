function updateSmartRoles(){
  const mode = document.getElementById('edit_smart_mode').value;
  const roleSel = document.getElementById('edit_smart_role');
  const frameSel = document.getElementById('edit_smart_frame');
  roleSel.innerHTML = '<option value="">-- Роль --</option>';
  frameSel.innerHTML = '<option value="">-- Фрейм --</option>';
  if (!mode) return;
  Object.keys(SMART_BUILD_DB[mode]).forEach(r => { roleSel.innerHTML += `<option value="${r}">${r}</option>`; });
}

function updateSmartFrames(){
  const mode = document.getElementById('edit_smart_mode').value;
  const role = document.getElementById('edit_smart_role').value;
  const frameSel = document.getElementById('edit_smart_frame');
  frameSel.innerHTML = '<option value="">-- Фрейм --</option>';
  if (!mode || !role) return;
  Object.keys(SMART_BUILD_DB[mode][role]).forEach(f => { frameSel.innerHTML += `<option value="${f}">${f}</option>`; });
}

function applySmartPreset(){
  const mode = document.getElementById('edit_smart_mode').value;
  const role = document.getElementById('edit_smart_role').value;
  const frame = document.getElementById('edit_smart_frame').value;
  if (!mode || !role || !frame) { alert('Выберите режим, роль и варфрейма!'); return; }
  
  const p = SMART_BUILD_DB[mode][role][frame];
  if (!p) return;

  // Заполняем текстовые поля (фрейм, оружие, компаньон)
  document.getElementById('edit_frame').value = frame;
  document.getElementById('edit_comp').value = p.comp || '';
  document.getElementById('edit_prim').value = p.prim || '';
  document.getElementById('edit_sec').value = p.sec || '';
  document.getElementById('edit_melee').value = p.melee || '';
  
  // Гельминт
  document.getElementById('edit_helminth').value = p.helminth || '';
  
  // Режим игры
  const missionSelect = document.getElementById('edit_mission_type');
  if (missionSelect) {
    if (mode === 'cascade') missionSelect.value = 'sp_9999';
    else if (mode === 'arbitration') missionSelect.value = 'arbitration';
    else missionSelect.value = 'normal';
  }

  // Моды (фрейм, основное, вторичное, ближний бой)
  currentMods.frame = (p.mods || []).filter(m => !excludedAutoMods.includes(m));
  currentMods.primary = (p.weaponMods || []).filter(m => !excludedAutoMods.includes(m));
  currentMods.secondary = (p.secMods || []).filter(m => !excludedAutoMods.includes(m));
  currentMods.melee = (p.meleeMods || []).filter(m => !excludedAutoMods.includes(m));

  // Фракция и фракционный мод
  if (mode === 'arbitration') {
    document.getElementById('edit_faction').value = '1.5';
    document.getElementById('edit_bane').checked = true;
  } else {
    document.getElementById('edit_faction').value = '1.0';
    document.getElementById('edit_bane').checked = false;
  }

  // === АРКАНЫ ВАРФРЕЙМА ===
  document.getElementById('edit_arcane_frame').value = p.arcane1 || '';
  document.getElementById('edit_arcane_frame2').value = p.arcane2 || '';

  // === АРКАНЫ ОРУЖИЯ (НОВОЕ) ===
  document.getElementById('edit_arcane_primary').value = p.arcanePrimary || '';
  document.getElementById('edit_arcane_secondary').value = p.arcaneSecondary || '';
  document.getElementById('edit_arcane_melee').value = p.arcaneMelee || '';

  // === ОСКОЛКИ ===
  if (p.shards && p.shards.length > 0) {
    for (let i = 1; i <= 5; i++) {
      const shardSelect = document.getElementById('edit_shard' + i);
      if (shardSelect) {
        shardSelect.value = p.shards[i-1] || '';
      }
    }
  } else {
    for (let i = 1; i <= 5; i++) {
      const shardSelect = document.getElementById('edit_shard' + i);
      if (shardSelect) shardSelect.value = '';
    }
  }

  renderModTags();
  alert(`✅ Билд "${mode.toUpperCase()} / ${role} / ${frame}" загружен!\nПодтянуты: Моды (все), Арканы (все), Осколки.`);
}

function autoPickArcanes(slotType) {
  if (slotType === 'frame') {
    const role = document.getElementById('edit_role').value;
    const frameName = document.getElementById('edit_frame').value;
    const frameData = warframesData.find(f => f.name === frameName) || {};
    const modsFrame = currentMods.frame.join(' ').toLowerCase();
    const baseArmor = frameData.armor || 300;

    let a1 = '', a2 = '';

    if (modsFrame.includes('blind rage') || role === 'Support') {
      a1 = 'Arcane Energize'; a2 = 'Arcane Steadfast';
      alert(`Выбраны арканы: ${a1}, ${a2}\nПричина: Высокий расход энергии.`);
    } else if (baseArmor < 200 && role === 'Tank') {
      a1 = 'Arcane Grace'; a2 = 'Arcane Guardian';
      alert(`Выбраны арканы: ${a1}, ${a2}\nПричина: Низкая броня, нужна выживаемость.`);
    } else if (role === 'Damage') {
      a1 = 'Molt Augmented'; a2 = 'Arcane Avenger';
      alert(`Выбраны арканы: ${a1}, ${a2}\nПричина: Максимальный урон.`);
    } else {
      a1 = 'Arcane Energize'; a2 = 'Arcane Guardian';
      alert(`Выбраны арканы: ${a1}, ${a2}\nПричина: Универсальный баланс.`);
    }

    document.getElementById('edit_arcane_frame').value = a1;
    document.getElementById('edit_arcane_frame2').value = a2;
    return;
  }
  
  // ... Остальной код для оружия оставляем без изменений ...

  const fieldId = slotType === 'primary' ? 'edit_prim' : slotType === 'secondary' ? 'edit_sec' : 'edit_melee';
  const wpName = document.getElementById(fieldId).value;
  const wp = allWeapons.find(w => w.name === wpName);
  
  if (!wp) { alert('Сначала выберите оружие в этом слоте!'); return; }

  const crit = wp.critChance || 0;
  const stat = wp.statusChance || 0;
  
  if (slotType === 'melee') {
    if (stat > crit) { pickedName = 'Melee Influence'; reason = 'У оружия высокий статус.'; }
    else { pickedName = 'Melee Exposure'; reason = 'Аркан даст коррозию.'; }
    document.getElementById('edit_arcane_melee').value = pickedName;
  } else if (slotType === 'primary') {
    if (stat > 25 && crit < 20) { pickedName = 'Primary Frostbite'; reason = 'Статусное оружие.'; }
    else { pickedName = 'Primary Merciless'; reason = 'Универсальный урон.'; }
    document.getElementById('edit_arcane_primary').value = pickedName;
  } else if (slotType === 'secondary') {
    const role = document.getElementById('edit_role').value;
    if (stat > 25) { pickedName = 'Secondary Encumber'; reason = 'Статусный пистолет.'; }
    else if (role === 'Tank') { pickedName = 'Secondary Fortifier'; reason = 'Дает оверщиты.'; }
    else { pickedName = 'Secondary Merciless'; reason = 'Для критового пистолета.'; }
    document.getElementById('edit_arcane_secondary').value = pickedName;
  }

  alert(`Для ${wp.name} (Крит: ${crit}%, Статус: ${stat}%) выбран аркан: ${pickedName}\n\nПричина: ${reason}`);
}

function autoPickShards() {
  const role = document.getElementById('edit_role').value;
  const frame = document.getElementById('edit_frame').value;
  const shards = ['edit_shard1', 'edit_shard2', 'edit_shard3', 'edit_shard4', 'edit_shard5'];
  shards.forEach(id => document.getElementById(id).value = '');

  if (role === 'Tank') {
    document.getElementById('edit_shard1').value = 'Azure Armor';
    document.getElementById('edit_shard2').value = 'Azure Armor';
    document.getElementById('edit_shard3').value = 'Azure Max Health';
    document.getElementById('edit_shard4').value = 'Azure Health Regen';
    document.getElementById('edit_shard5').value = 'Azure Max Health';
    alert(`Для Танка (${frame || 'Фрейм'}) подобраны 5 Лазурных осколков на выживаемость.`);
  } else if (role === 'Support') {
    document.getElementById('edit_shard1').value = 'Amber Casting Speed';
    document.getElementById('edit_shard2').value = 'Amber Casting Speed';
    document.getElementById('edit_shard3').value = 'Amber Max Energy on Spawn';
    document.getElementById('edit_shard4').value = 'Crimson Ability Duration';
    document.getElementById('edit_shard5').value = 'Crimson Ability Duration';
    alert(`Для Саппорта (${frame || 'Фрейм'}) подобраны осколки на каст и энергию.`);
  } else {
    document.getElementById('edit_shard1').value = 'Crimson Ability Strength';
    document.getElementById('edit_shard2').value = 'Crimson Ability Strength';
    document.getElementById('edit_shard3').value = 'Crimson Ability Strength';
    document.getElementById('edit_shard4').value = 'Crimson Ability Strength';
    document.getElementById('edit_shard5').value = 'Crimson Ability Strength';
    alert(`Для Урона (${frame || 'Фрейм'}) подобраны 5 Багровых осколков на силу.`);
  }
}