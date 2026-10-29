// ============================================================
// Копировать для чата Warframe
// ============================================================
function copyBuildToChat(){
  const all = [
    ...currentMods.frame,
    ...currentMods.primary,
    ...currentMods.secondary,
    ...currentMods.melee
  ];
  if (!all.length) { alert('Сначала добавь моды в билд.'); return; }
  const text = all.map(m => `[${m}]`).join(' ');
  const done = () => alert(`Скопировано ${all.length} модов.\n\nВставь в чат Warframe (T) — моды станут кликабельными.`);
  if (navigator.clipboard && navigator.clipboard.writeText){
    navigator.clipboard.writeText(text).then(done).catch(() => fallbackCopy(text, done));
  } else {
    fallbackCopy(text, done);
  }
}

function fallbackCopy(text, done){
  try {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed'; ta.style.top = '-9999px';
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(ta);
    if (ok) done(); else prompt('Скопируй вручную:', text);
  } catch(e){ prompt('Скопируй вручную:', text); }
}

// ============================================================
// Сохранить/загрузить билд через URL
// ============================================================
function encodeToUrl(obj){
  const json = JSON.stringify(obj);
  const bytes = new TextEncoder().encode(json);
  const binary = Array.from(bytes, b => String.fromCharCode(b)).join('');
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function decodeFromUrl(str){
  let b64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (b64.length % 4) b64 += '=';
  const binary = atob(b64);
  const bytes = Uint8Array.from(binary, c => c.charCodeAt(0));
  return JSON.parse(new TextDecoder().decode(bytes));
}

function saveToUrl(){
  const payload = {
    f: document.getElementById('edit_frame').value,
    r: document.getElementById('edit_role').value,
    mt: document.getElementById('edit_mission_type').value,
    c: document.getElementById('edit_comp').value,
    p: document.getElementById('edit_prim').value,
    s: document.getElementById('edit_sec').value,
    m: document.getElementById('edit_melee').value,
    h: document.getElementById('edit_helminth').value,
    
    // АРКАНЫ (добавили af, af2 и арканы оружия)
    af: document.getElementById('edit_arcane_frame').value,
    af2: document.getElementById('edit_arcane_frame2').value,
    ap: document.getElementById('edit_arcane_primary').value,
    asc: document.getElementById('edit_arcane_secondary').value,
    am: document.getElementById('edit_arcane_melee').value,

    mf: currentMods.frame,
    mp: currentMods.primary,
    ms: currentMods.secondary,
    mm: currentMods.melee,
    
    // ОСКОЛКИ (добавили 4 и 5)
    sh: [
      document.getElementById('edit_shard1').value,
      document.getElementById('edit_shard2').value,
      document.getElementById('edit_shard3').value,
      document.getElementById('edit_shard4').value,
      document.getElementById('edit_shard5').value
    ].filter(Boolean)
  };
  const encoded = encodeToUrl(payload);
  history.replaceState(null, '', '#' + encoded);
  alert('✅ Состояние сохранено в URL.\n\nСкопируйте ссылку из адресной строки для бэкапа или шаринга.');
}

function loadFromUrl(){
  const hash = location.hash.slice(1);
  if (!hash) return false;
  try {
    const data = decodeFromUrl(hash);
    const setVal = (id, val) => {
      const el = document.getElementById(id);
      if (el && val !== undefined) el.value = val;
    };
    
    setVal('edit_frame', data.f);
    setVal('edit_role', data.r);
    setVal('edit_mission_type', data.mt || 'normal');
    setVal('edit_comp', data.c);
    setVal('edit_prim', data.p);
    setVal('edit_sec', data.s);
    setVal('edit_melee', data.m);
    setVal('edit_helminth', data.h);
    
    // Загружаем арканы
    setVal('edit_arcane_frame', data.af);
    setVal('edit_arcane_frame2', data.af2);
    setVal('edit_arcane_primary', data.ap);
    setVal('edit_arcane_secondary', data.asc);
    setVal('edit_arcane_melee', data.am);

    currentMods.frame = data.mf || [];
    currentMods.primary = data.mp || [];
    currentMods.secondary = data.ms || [];
    currentMods.melee = data.mm || [];
    
    // Загружаем осколки
    const shards = data.sh || [];
    setVal('edit_shard1', shards[0] || '');
    setVal('edit_shard2', shards[1] || '');
    setVal('edit_shard3', shards[2] || '');
    setVal('edit_shard4', shards[3] || '');
    setVal('edit_shard5', shards[4] || '');
    
    renderModTags();
    return true;
  } catch(e){
    console.warn('Не удалось разобрать данные из URL', e);
    return false;
  }
}

function copyCalcToClipboard(){
  const el = document.getElementById('calc_result');
  if (!el) return;
  const text = (el.innerText || el.textContent || '').trim();
  if (!text) { alert('Пока нечего копировать — сначала посчитай.'); return; }
  const done = () => alert('✅ Расчёт скопирован в буфер обмена.');
  if (navigator.clipboard && navigator.clipboard.writeText){
    navigator.clipboard.writeText(text).then(done).catch(() => fallbackCopy(text, done));
  } else {
    fallbackCopy(text, done);
  }
}