function renderBuilds(){
  const tbody = document.getElementById('tbody_builds');
  tbody.innerHTML = builds.map((b, i) => {
    const shards = [b.shard1, b.shard2, b.shard3, b.shard4, b.shard5].filter(Boolean).map(s => {
      const color = s.split(' ')[0].toLowerCase() || 'violet';
      return `<span class="shard-badge shard-${color}" title="${s}" style="margin:1px;">${s.split(' ')[0]}</span>`;
    }).join('');
    
    const arcanes = [b.arcaneFrame,b.arcaneFrame2, b.arcanePrimary, b.arcaneSecondary, b.arcaneMelee].filter(Boolean).map(a => 
      `<span style="display:inline-block; background:var(--panel3); padding:2px 6px; border-radius:4px; font-size:10px; margin:2px 0; border:1px solid var(--border);">${a}</span>`
    ).join('<br>');

    const helminthHtml = b.helminth ? `<span class="helminth-badge">${b.helminth}</span>` : '—';

    let modeBadge = '';
    const mode = b.mission_type || 'normal';
    if (mode === 'sp_9999') {
      modeBadge = `<span style="background:#e94560; color:#fff; padding:2px 6px; border-radius:4px; font-size:10px; font-weight:bold;">CAP 9999</span>`;
    } else if (mode === 'steel_path') {
      modeBadge = `<span style="background:#9b59b6; color:#fff; padding:2px 6px; border-radius:4px; font-size:10px;">Стальной</span>`;
    } else if (mode === 'arbitration') {
      modeBadge = `<span style="background:#e67e22; color:#fff; padding:2px 6px; border-radius:4px; font-size:10px;">Арбитраж</span>`;
    } else {
      modeBadge = `<span style="color:var(--dim); font-size:11px;">Обычка</span>`;
    }

    return `<tr>
      <td><b>${b.frame || '—'}</b></td><td>${b.role || '—'}</td>
      <td>${modeBadge}</td>
      <td>${helminthHtml}</td>
      <td>${arcanes || '—'}</td>
      <td>${b.prim || '—'}</td><td>${b.sec || '—'}</td><td>${b.melee || '—'}</td>
      <td>${shards}</td>
      <td><button class="btn-sm" onclick="openEditModal(${i})">✏</button>
          <button class="btn-sm btn-red" onclick="deleteBuild(${i})">X</button></td>
    </tr>`;
  }).join('');
  document.getElementById('count').textContent = builds.length;
  populateCalcSelect();
}

function deleteBuild(idx){
  if (confirm('Удалить?')){
    builds.splice(idx, 1);
    localStorage.setItem('wf_builds_v15', JSON.stringify(builds));
    renderBuilds();
    if (currentCalcBuildIndex == idx) {
      document.getElementById('calc_build_select').value = '-1';
      loadBuildForCalc();
    }
  }
}

function openEditModal(idx = -1){
  editIndex = idx;
  isEditingCalcMods = false;
  currentMods = { frame: [], primary: [], secondary: [], melee: [] };
  populateShardSelects();
  if (idx >= 0){
    const b = builds[idx];
        ['frame','role','comp','prim','sec','melee','faction','weapon_type','helminth','arcane_frame','arcane_frame2','arcane_primary','arcane_secondary','arcane_melee','mission_type'].forEach(k => {
      const el = document.getElementById('edit_' + k);
      if (el) el.value = b[k] || (k === 'weapon_type' ? 'damage' : (k === 'mission_type' ? 'normal' : ''));
    });
    document.getElementById('edit_bane').checked = b.bane || false;
    ['shard1','shard2','shard3','shard4','shard5'].forEach(k => {
      const el = document.getElementById('edit_' + k);
      if (el) el.value = b[k] || '';
    });
    if (b.modsFrame) currentMods.frame = b.modsFrame.split(', ');
    const ps = b.modsPrimary !== undefined ? b.modsPrimary : (b.modsWeapon || '');
    if (ps) currentMods.primary = ps.split(', ');
    if (b.modsSecondary) currentMods.secondary = b.modsSecondary.split(', ');
    if (b.modsMelee) currentMods.melee = b.modsMelee.split(', ');
  } else {
    document.querySelectorAll('#modal_edit input[type="text"]').forEach(i => i.value = '');
    document.getElementById('edit_bane').checked = false;
    document.getElementById('edit_faction').value = '1.0';
    document.getElementById('edit_weapon_type').value = 'damage';
    document.getElementById('edit_smart_mode').value = '';
    document.getElementById('edit_smart_role').innerHTML = '<option value="">-- Роль --</option>';
    document.getElementById('edit_smart_frame').innerHTML = '<option value="">-- Фрейм --</option>';
    document.getElementById('edit_mission_type').value = 'normal';
    ['edit_shard1','edit_shard2','edit_shard3','edit_shard4','edit_shard5'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });
  }
  renderModTags();
  loadFromUrl();
  document.getElementById('modal_edit').classList.add('active');
}

function saveBuild(){
  const b = {
    frame: document.getElementById('edit_frame').value,
    role: document.getElementById('edit_role').value,
    mission_type: document.getElementById('edit_mission_type').value,
    comp: document.getElementById('edit_comp').value,
    prim: document.getElementById('edit_prim').value,
    sec: document.getElementById('edit_sec').value,
    melee: document.getElementById('edit_melee').value,
    faction: document.getElementById('edit_faction').value,
    bane: document.getElementById('edit_bane').checked,
    weapon_type: document.getElementById('edit_weapon_type').value,
    helminth: document.getElementById('edit_helminth').value,
    
        arcaneFrame: document.getElementById('edit_arcane_frame').value,
    arcaneFrame2: document.getElementById('edit_arcane_frame2').value, // <--- НОВАЯ СТРОКА
    arcanePrimary: document.getElementById('edit_arcane_primary').value,
    arcaneSecondary: document.getElementById('edit_arcane_secondary').value,
    arcaneMelee: document.getElementById('edit_arcane_melee').value,

    shard1: document.getElementById('edit_shard1').value,
    shard2: document.getElementById('edit_shard2').value,
    shard3: document.getElementById('edit_shard3').value,
    shard4: document.getElementById('edit_shard4').value,
    shard5: document.getElementById('edit_shard5').value,
    
    modsFrame: currentMods.frame.join(', '),
    modsPrimary: currentMods.primary.join(', '),
    modsSecondary: currentMods.secondary.join(', '),
    modsMelee: currentMods.melee.join(', ')
  };
  if (editIndex >= 0) builds[editIndex] = b; else builds.push(b);
  localStorage.setItem('wf_builds_v15', JSON.stringify(builds));
  renderBuilds();
  closeModal('modal_edit');
  if (currentCalcBuildIndex >= 0) loadBuildForCalc();
}