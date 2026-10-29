function buildShardOptionsHtml(){
  let html = '<option value="">-- Нет --</option>';
  Object.entries(SHARD_EFFECTS).forEach(([color, data]) => {
    const cap = color.charAt(0).toUpperCase() + color.slice(1);
    html += `<optgroup label="${data.label}">`;
    data.options.forEach(o => {
      html += `<option value="${cap} ${o.name}">${o.name} — ${o.normal} (Tau: ${o.tau})</option>`;
    });
    html += '</optgroup>';
  });
  return html;
}

function populateShardSelects(){
  const html = buildShardOptionsHtml();
  ['edit_shard1','edit_shard2','edit_shard3','edit_shard4','edit_shard5'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = html;
  });
}

function updateDbSubTypes(){
  const type = document.getElementById('db_type').value;
  const sel = document.getElementById('db_subtype');
  sel.innerHTML = '<option value="">Все подтипы</option>';
  if (type === 'Warframe' || type === 'Arcane') return;
  const subTypes = [...new Set(allWeapons.filter(w => w.type === type).map(w => w.subType).filter(Boolean))];
  subTypes.sort().forEach(st => { sel.innerHTML += `<option value="${st}">${st}</option>`; });
}

function closeModal(id){
  document.getElementById(id).classList.remove('active');
  isEditingCalcMods = false;
}