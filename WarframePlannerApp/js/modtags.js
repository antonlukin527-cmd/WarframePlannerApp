let draggedMod = { slot: null, index: null };

function renderModTags(){
  const slots = ['frame', 'primary', 'secondary', 'melee'];
  
  slots.forEach(slot => {
    const el = document.getElementById('tags_' + slot);
    if (!el) return;

    // Инициализация массивов, если их нет
    if (!currentPolarities[slot]) currentPolarities[slot] = [];
    const mods = currentMods[slot] || [];
    const pols = currentPolarities[slot];
    
    let html = '';
    const maxSlots = 8; // Стандартное количество слотов

    for (let i = 0; i < maxSlots; i++) {
      const modName = mods[i];
      let pol = pols[i] || '';
      
      // Если слот занят, но полярность не задана, берем базовую полярность мода
      if (modName && !pol && typeof modsData !== 'undefined') {
        const mData = modsData.find(m => m.name === modName);
        if (mData && mData.polarity) pol = mData.polarity.toLowerCase();
      }

      const polIcon = POLARITY_ICONS[pol] || '•';
      
      if (modName) {
        const aug = typeof KNOWN_AUGMENTS !== 'undefined' && KNOWN_AUGMENTS.has(modName) ? ' aug' : '';
        html += `
          <div class="mod-slot filled${aug}" draggable="true" 
               ondragstart="dragStart(event, '${slot}', ${i})" 
               ondragover="dragOver(event)" 
               ondragleave="dragLeave(event)"
               ondrop="drop(event, '${slot}', ${i})" 
               ondragend="dragEnd(event)">
            <span class="polarity-icon ${pol}" onclick="cyclePolarity('${slot}', ${i})" title="Полярность: ${pol || 'Нет'}">${polIcon}</span>
            <span class="mod-name" style="flex:1; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;" title="${modName}">${modName}</span>
            <span class="remove-mod" onclick="removeMod('${slot}', ${i})" title="Удалить">×</span>
          </div>`;
      } else {
        html += `
          <div class="mod-slot empty" 
               ondragover="dragOver(event)" 
               ondragleave="dragLeave(event)"
               ondrop="drop(event, '${slot}', ${i})">
            <span class="polarity-icon ${pol}" onclick="cyclePolarity('${slot}', ${i})" title="Полярность: ${pol || 'Нет'}">${polIcon}</span>
            <span class="mod-name" style="opacity:0.3">Пусто</span>
          </div>`;
      }
    }
    el.innerHTML = html;
  });

  if (typeof updateCapacity === 'function') updateCapacity();
  if (typeof renderMarketSummaryUI === 'function') renderMarketSummaryUI();
}

// Смена полярности по клику
function cyclePolarity(slot, index) {
  if (!currentPolarities[slot]) currentPolarities[slot] = [];
  
  const order = ['', 'madurai', 'vazarin', 'naramon', 'zenurik', 'umbral', 'unairu', 'penjaga'];
  let current = currentPolarities[slot][index] || '';
  let nextIdx = (order.indexOf(current) + 1) % order.length;
  currentPolarities[slot][index] = order[nextIdx];
  
  renderModTags();
}

function removeMod(type, idx){
  currentMods[type].splice(idx, 1);
  if (currentPolarities[type]) currentPolarities[type].splice(idx, 1);
  
  renderModTags();
  if (document.getElementById('modal_mods').classList.contains('active')) renderModPicker();
}

// ==========================================
// ЛОГИКА DRAG & DROP
// ==========================================
function dragStart(event, slot, index) {
  draggedMod = { slot, index };
  event.dataTransfer.effectAllowed = 'move';
  event.dataTransfer.setData('text/plain', ''); 
  event.target.classList.add('dragging');
}

function dragOver(event) {
  event.preventDefault();
  event.dataTransfer.dropEffect = 'move';
  const target = event.target.closest('.mod-slot');
  if (target) target.classList.add('drag-over');
}

function dragLeave(event) {
  const target = event.target.closest('.mod-slot');
  if (target) target.classList.remove('drag-over');
}

function drop(event, targetSlot, targetIndex) {
  event.preventDefault();
  const targetEl = event.target.closest('.mod-slot');
  if (targetEl) targetEl.classList.remove('drag-over');

  if (draggedMod.slot !== targetSlot) return; // Перетаскиваем только внутри одного слота
  if (draggedMod.index === targetIndex) return;

  const mods = currentMods[targetSlot];
  if (!mods) return;
  if (!currentPolarities[targetSlot]) currentPolarities[targetSlot] = [];
  const pols = currentPolarities[targetSlot];

  // Достаем мод из старой позиции
  const modToMove = mods.splice(draggedMod.index, 1)[0];
  const polToMove = pols.splice(draggedMod.index, 1)[0];

  if (!modToMove) return;

  // Вставляем в новую позицию
  if (targetIndex >= mods.length) {
    // Если бросили в пустой слот, просто добавляем в конец
    mods.push(modToMove);
    pols.push(polToMove || '');
  } else {
    mods.splice(targetIndex, 0, modToMove);
    pols.splice(targetIndex, 0, polToMove || '');
  }

  draggedMod = { slot: null, index: null };
  renderModTags();
}

function dragEnd(event) {
  event.target.classList.remove('dragging');
  document.querySelectorAll('.mod-slot').forEach(el => el.classList.remove('drag-over'));
}

// ==========================================
// АВТО-ПОДБОР (оставлен без изменений)
// ==========================================
function autoPickFrameMods(){
  const role = document.getElementById('edit_role').value;
  let mods = [];
  
  const survivability = ['Vitality', 'Steel Fiber', 'Adaptation', 'Rolling Guard'];
  const casting = ['Primed Continuity', 'Blind Rage', 'Primed Flow', 'Streamline'];

  if (role === 'Tank') {
    mods = [...survivability, 'Hunter Adrenaline', 'Primed Continuity', 'Umbral Vitality', 'Umbral Fiber'];
  } else if (role === 'Support') {
    mods = ['Primed Continuity', 'Stretch', 'Augur Reach', 'Natural Talent', 'Primed Flow', 'Adaptation', 'Energy Siphon'];
  } else {
    mods = ['Blind Rage', 'Transient Fortitude', 'Primed Continuity', 'Stretch', 'Primed Flow', 'Umbral Intensify', 'Archon Vitality'];
  }

  currentMods.frame = mods.filter(m => !excludedAutoMods.includes(m));
  currentPolarities.frame = new Array(currentMods.frame.length).fill(''); // Сбрасываем полярности
  renderModTags();
  alert(`Универсальные моды для роли "${role}" подобраны!`);
}

function autoPickMods(slot = 'primary'){
  const fieldId = slot === 'primary' ? 'edit_prim' : slot === 'secondary' ? 'edit_sec' : 'edit_melee';
  const wpName = document.getElementById(fieldId).value;
  const wp = allWeapons.find(w => w.name === wpName);
  const weaponType = document.getElementById('edit_weapon_type').value;
  
  if (!wp) { alert('Сначала выберите оружие в этом слоте!'); return; }
  
  let mods = [];
  if (weaponType === 'support'){
    mods = ['Galvanized Shot', 'Lethal Torrent', 'Primed Heated Charge', 'Infected Clip'];
  } else {
    const isMelee = wp.type === 'Melee';
    if (isMelee) mods.push('Primed Pressure Point');
    else mods.push('Serration', 'Split Chamber');

    if ((wp.critChance || 0) > 15) {
      if (isMelee) mods.push('Blood Rush', 'Organ Shatter');
      else mods.push('Point Strike', 'Vital Sense');
    }
    
    if ((wp.statusChance || 0) > 20) {
      mods.push('Infected Clip', 'Cryo Rounds');
    } else {
      mods.push('Infected Clip', 'Stormbringer');
    }
    
    if (isMelee) mods.push('Berserker Fury', 'Primed Reach');
    else mods.push('Primed Shred', 'Vile Acceleration');
  }
  
  currentMods[slot] = mods.filter(m => !excludedAutoMods.includes(m));
  currentPolarities[slot] = new Array(currentMods[slot].length).fill(''); // Сбрасываем полярности
  renderModTags();
  alert(`Универсальные моды подобраны для ${wp.name}!`);
}