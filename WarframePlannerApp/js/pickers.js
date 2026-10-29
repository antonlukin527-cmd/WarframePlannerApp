function openPicker(type){
  pickerType = type;
  document.getElementById('picker_search').value = '';
  renderPicker();
  document.getElementById('modal_picker').classList.add('active');
}

function renderPicker(){
  const q = document.getElementById('picker_search').value.toLowerCase();
  let list = [];
  
  if (pickerType === 'frame') {
    list = warframesData;
  } else if (pickerType === 'companion') {
    list = companionsData;
  } else if (typeof allWeapons !== 'undefined') {
    list = allWeapons.filter(w => {
      const t = (w.type || '').toLowerCase();
      const c = (w.category || '').toLowerCase();
      const pc = (w.productCategory || '').toLowerCase();
      const search = pickerType.toLowerCase();
      return t === search || c === search || pc === search || t.includes(search) || c.includes(search);
    });
  }
  
  const filtered = list.filter(i => i.name.toLowerCase().includes(q)).slice(0, 100);
  
  document.getElementById('picker_list').innerHTML = filtered.map(i => {
    const url = i.imageName ? `https://cdn.warframestat.us/img/${i.imageName}` : '';
    const safeName = i.name.replace(/'/g, "\\'");
    return `<div class="pick-item" onclick="selectItem('${safeName}')">
      ${url ? `<img src="${url}" style="width:32px;height:32px;object-fit:contain" onerror="this.style.display='none'">` : ''}
      <div class="name">${i.name}</div>
      <button class="btn-sm btn-p">Выбрать</button>
    </div>`;
  }).join('');
}

function selectItem(name){
  let targetId = '';
  if (pickerType === 'frame') targetId = 'edit_frame';
  else if (pickerType === 'companion') targetId = 'edit_comp';
  else if (pickerType === 'primary') targetId = 'edit_prim';
  else if (pickerType === 'secondary') targetId = 'edit_sec';
  else if (pickerType === 'melee') targetId = 'edit_melee';
  document.getElementById(targetId).value = name;
  closeModal('modal_picker');
}

function openModPicker(type){
  activeModType = type;
  document.getElementById('mod_search').value = '';
  const cb = document.getElementById('mod_only_relevant');
  if (cb) cb.checked = true;
  renderModPicker();
  document.getElementById('modal_mods').classList.add('active');
}

function editCalcMods(){
  if (currentCalcBuildIndex < 0) return;
  isEditingCalcMods = true;
  editIndex = currentCalcBuildIndex;
  const b = builds[editIndex];
  const slot = document.getElementById('calc_weapon_slot').value;
  activeModType = slot;
  currentMods = {
    frame: b.modsFrame ? b.modsFrame.split(', ') : [],
    primary: (b.modsPrimary !== undefined ? b.modsPrimary : (b.modsWeapon || '')).split(', ').filter(Boolean),
    secondary: b.modsSecondary ? b.modsSecondary.split(', ') : [],
    melee: b.modsMelee ? b.modsMelee.split(', ') : []
  };
  document.getElementById('mod_search').value = '';
  renderModPicker();
  document.getElementById('modal_mods').classList.add('active');
}

function renderModPicker(){
  const q = (document.getElementById('mod_search').value || '').toLowerCase().trim();
  const relCb = document.getElementById('mod_only_relevant');
  const onlyRelevant = relCb ? relCb.checked : true;
  const isFrame = activeModType === 'frame';
  const isRelevantMod = m => isFrame ? FRAME_MOD_TYPES.has(m.type) : WEAPON_MOD_TYPES.has(m.type);

  let filtered = modsData.filter(m => {
    if (!m || !m.name) return false;
    if (NEVER_SHOW_TYPES.has(m.type)) return false;
    if (onlyRelevant && !isRelevantMod(m)) return false;
    if (q) {
      const hay = ((m.name || '') + ' ' + (m.nameRu || '') + ' ' + (m.nameDe || '')).toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });

  filtered.sort((a, b) => {
    const aR = isRelevantMod(a) ? 0 : 1;
    const bR = isRelevantMod(b) ? 0 : 1;
    if (aR !== bR) return aR - bR;
    return (a.name || '').localeCompare(b.name || '');
  });

  const LIMIT = 1500;
  const total = filtered.length;
  const shown = filtered.slice(0, LIMIT);
  const stats = `<div class="mod-picker-stats">
    Найдено: <b>${total}</b>${total > LIMIT ? ` · показано: <b>${shown.length}</b>` : ''}
    ${onlyRelevant ? ' · фильтр по слоту включён' : ' · <span style="color:var(--warn)">показаны ВСЕ типы</span>'}
  </div>`;

  if (!shown.length){
    document.getElementById('mod_list').innerHTML = stats + '<div style="color:var(--dim);text-align:center;padding:20px">Ничего не найдено.</div>';
    return;
  }

  document.getElementById('mod_list').innerHTML = stats + shown.map(m => {
    const isSel = currentMods[activeModType].includes(m.name);
    const isExc = excludedAutoMods.includes(m.name);
    const isAug = KNOWN_AUGMENTS.has(m.name) || (m.imageName && String(m.imageName).includes('Augment'));
    const relevant = isRelevantMod(m);
    const nameEsc = m.name.replace(/'/g, "\\'");
    const augBadge = isAug ? '<span class="badge-aug">AUG</span>' : '';
    const typeBadge = (m.type && !['Warframe Mod','Primary Mod','Secondary Mod','Melee Mod'].includes(m.type))
      ? `<span class="badge-type">${m.type}</span>` : '';
    return `<div class="pick-item" style="border-color:${isSel ? 'var(--accent)' : 'transparent'};${relevant ? '' : 'opacity:0.55;'}">
      <div class="name" style="color:${isSel ? 'var(--accent)' : 'var(--text)'}">${m.name}${augBadge}${typeBadge}</div>
      <button class="btn-sm ${isExc ? 'btn-red' : ''}" onclick="toggleExclude('${nameEsc}')">${isExc ? 'В ч.с.' : 'В Авто'}</button>
      <button class="btn-sm ${isSel ? 'btn-red' : 'btn-ok'}" onclick="toggleMod('${nameEsc}')">${isSel ? 'Убрать' : 'Добавить'}</button>
    </div>`;
  }).join('');
}

function toggleExclude(name){
  const idx = excludedAutoMods.indexOf(name);
  if (idx >= 0) excludedAutoMods.splice(idx, 1); else excludedAutoMods.push(name);
  localStorage.setItem('wf_excluded_mods', JSON.stringify(excludedAutoMods));
  renderModPicker();
}

function toggleMod(name){
  const arr = currentMods[activeModType];
  if (!arr) return;
  const idx = arr.indexOf(name);
  if (idx >= 0) arr.splice(idx, 1); else arr.push(name);
  renderModPicker();
  if (isEditingCalcMods){
    const b = builds[editIndex];
    if (activeModType === 'frame') b.modsFrame = currentMods.frame.join(', ');
    if (activeModType === 'primary') b.modsPrimary = currentMods.primary.join(', ');
    if (activeModType === 'secondary') b.modsSecondary = currentMods.secondary.join(', ');
    if (activeModType === 'melee') b.modsMelee = currentMods.melee.join(', ');
    localStorage.setItem('wf_builds_v15', JSON.stringify(builds));
    loadBuildForCalc();
  } else {
    renderModTags();
  }
}