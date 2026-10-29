// ==========================================
// 1. ХЕЛМИНТ (Helminth)
// ==========================================
const HELMINTH_ABILITIES = [
  { name: 'Roar', effect: 'Увеличивает урон оружия и способностей на 30% (базово).', cost: 'Bile 50%', synergy: 'Идеально для любого билда на урон. Стакается с фракционными модами.' },
  { name: 'Eclipse', effect: 'Увеличивает урон оружия до 200% (в тени) или дает DR (на свету).', cost: 'Pheromones 50%', synergy: 'Лучший выбор для оружия с высоким базовым уроном.' },
  { name: 'Gloom', effect: 'Замедляет врагов и восстанавливает HP при нанесении урона.', cost: 'Bile 75%', synergy: 'Мета для выживания на Стальном Пути.' },
  { name: 'Nourish', effect: 'Увеличивает энергию от сфер и добавляет Вирусный урон к атакам.', cost: 'Bile 50%', synergy: 'Лучший выбор для энергозависимых фреймов.' },
  { name: 'Pillage', effect: 'Снимает щиты/броню врагов и восстанавливает щиты Варфрейма.', cost: 'Bile 75%', synergy: 'Контр-пик против Корпуса и Гринир.' }
];

function openHelminthGuide() {
  const list = document.getElementById('helminth_list_container');
  if (!list) return;
  list.innerHTML = HELMINTH_ABILITIES.map(a => `
    <div class="ref-card" style="margin-bottom:10px; border-left: 3px solid var(--accent);">
      <h4 style="color:var(--accent); margin:0 0 5px 0;">${a.name}</h4>
      <p style="font-size:12px; margin-bottom:8px;"><b>Эффект:</b> ${a.effect}</p>
      <span style="background:var(--panel3); padding:2px 6px; border-radius:4px; font-size:11px;">💧 ${a.cost}</span>
      <div style="background:var(--panel); padding:8px; border-radius:4px; font-size:11px; color:var(--dim); margin-top:8px;">
        <b>Синергия:</b> ${a.synergy}
      </div>
    </div>
  `).join('');
  document.getElementById('modal_helminth').classList.add('active');
}

// ==========================================
// 2. ИНКАРНОН (Incarnon)
// ==========================================
const INCARNON_DATA = {
  'Torid': ['1: Survivor\'s Edge (+Dmg, +Reload)', '2: Commodore\'s Fortune (+Multishot)', '3: Extended Volley (+Mag Capacity)', '4: Elemental Balance (+Status Chance)', '5: Devouring Attrition (+Crit Chance)'],
  'Lex': ['1: Deathtrap Trigger (+Crit on reload)', '2: Lethal Ardor (+Multishot)', '3: Extended Magazine', '4: Elemental Balance', '5: Absolute Zero (+Crit Dmg)'],
  'Burston': ['1: Fortress Salvo (+Impact)', '2: Reaver\'s Rapture (+Multishot)', '3: Extended Volley', '4: Elemental Balance', '5: Devouring Attrition']
};

function initIncarnonTracker() {
  const sel = document.getElementById('incarnon_weapon_select');
  if (!sel) return;
  sel.innerHTML = Object.keys(INCARNON_DATA).map(w => `<option value="${w}">${w}</option>`).join('');
  renderIncarnonEvolutions();
}

function renderIncarnonEvolutions() {
  const wp = document.getElementById('incarnon_weapon_select').value;
  const res = document.getElementById('incarnon_result');
  if (!INCARNON_DATA[wp] || !res) return;

  res.innerHTML = `
    <h4 style="color:var(--accent2); margin-top:0;">Рекомендуемые эволюции для ${wp}</h4>
    <ul style="margin-left:20px; line-height:1.8; font-size:13px;">
      ${INCARNON_DATA[wp].map(evo => `<li>${evo}</li>`).join('')}
    </ul>
  `;
}

// ==========================================
// 3. ЗО И КИТГАНЫ (Zaws & Kitguns)
// ==========================================
const ZAW_PARTS = {
  strikes: [
    { name: 'Balla', type: 'Dagger', dmg: 120, crit: 20, stat: 20 },
    { name: 'Cyath', type: 'Machete', dmg: 180, crit: 10, stat: 30 },
    { name: 'Dokrahm', type: 'Heavy Blade', dmg: 250, crit: 15, stat: 25 }
  ],
  grips: [
    { name: 'Peye', type: 'One-Handed', speed: 1.0, dmgMod: 1.0 },
    { name: 'Seekalla', type: 'Two-Handed', speed: 0.8, dmgMod: 1.2 }
  ],
  links: [
    { name: 'Vargeet Jai II', crit: 20, stat: -10 },
    { name: 'Ekwana Jai II', crit: 10, stat: 20 }
  ]
};

function initZawBuilder() {
  const sSel = document.getElementById('zaw_strike');
  const gSel = document.getElementById('zaw_grip');
  const lSel = document.getElementById('zaw_link');
  if (!sSel || !gSel || !lSel) return;

  sSel.innerHTML = ZAW_PARTS.strikes.map(s => `<option value="${s.name}">${s.name} (${s.type})</option>`).join('');
  gSel.innerHTML = ZAW_PARTS.grips.map(g => `<option value="${g.name}">${g.name} (${g.type})</option>`).join('');
  lSel.innerHTML = ZAW_PARTS.links.map(l => `<option value="${l.name}">${l.name}</option>`).join('');
  
  calculateZaw();
}

function calculateZaw() {
  const sName = document.getElementById('zaw_strike').value;
  const gName = document.getElementById('zaw_grip').value;
  const lName = document.getElementById('zaw_link').value;
  const res = document.getElementById('zaw_result');

  const strike = ZAW_PARTS.strikes.find(s => s.name === sName);
  const grip = ZAW_PARTS.grips.find(g => g.name === gName);
  const link = ZAW_PARTS.links.find(l => l.name === lName);

  if (!strike || !grip || !link || !res) return;

  const finalDmg = Math.round(strike.dmg * grip.dmgMod);
  const finalCrit = strike.crit + link.crit;
  const finalStat = strike.stat + link.stat;

  res.innerHTML = `
    <h4 style="color:var(--warn); margin-top:0;">${strike.name} / ${grip.name} / ${link.name}</h4>
    <div style="display:grid; grid-template-columns: 1fr 1fr 1fr; gap:10px; text-align:center; margin-top:10px;">
      <div style="background:var(--panel3); padding:8px; border-radius:6px;">
        <div style="font-size:11px; color:var(--dim);">Урон</div>
        <b style="font-size:18px;">${finalDmg}</b>
      </div>
      <div style="background:var(--panel3); padding:8px; border-radius:6px;">
        <div style="font-size:11px; color:var(--dim);">Крит</div>
        <b style="font-size:18px;">${finalCrit}%</b>
      </div>
      <div style="background:var(--panel3); padding:8px; border-radius:6px;">
        <div style="font-size:11px; color:var(--dim);">Статус</div>
        <b style="font-size:18px;">${finalStat}%</b>
      </div>
    </div>
  `;
}

// ==========================================
// 4. КОМПАНЬОНЫ (Companions)
// ==========================================
function renderCompanionMods() {
  const name = document.getElementById('comp_builder_name').value;
  const tags = document.getElementById('tags_companion');
  if (!tags) return;

  if (!name) {
    tags.innerHTML = '<div style="color:var(--dim); padding:10px;">Выберите компаньона для добавления модов</div>';
    return;
  }

  tags.innerHTML = `<div style="color:var(--dim); padding:10px;">Моды для ${name} скоро появятся в базе...</div>`;
}

// Вспомогательная функция для переключения вкладок Инструментов
function switchToolsTab(id, btn) {
  document.querySelectorAll('#panel-tools .itab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('#panel-tools .itab-panel').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('tools-tab-' + id).classList.add('active');
}