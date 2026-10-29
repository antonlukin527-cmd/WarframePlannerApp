const FOCUS_SCHOOLS = [
  { name: 'Zenurik', icon: '🔵', desc: 'Управление энергией. Wellspring даёт +5 энергии/сек для всей команды.', waybound: 'Inner Might (бесплатное использование способности)' },
  { name: 'Madurai', icon: '🔴', desc: 'Увеличение урона. Sling Strength даёт +40% силы способностей после пращи.', waybound: 'Mind Sprint (скорость пращи)' },
  { name: 'Naramon', icon: '🟡', desc: 'Сосредоточен на ближнем бое. Power Spike сохраняет комбо-счетчик.', waybound: 'Executing Dash (рывок сквозь врагов)' },
  { name: 'Unairu', icon: '🟤', desc: 'Защита и броня. Basilisk Scales даёт +200% брони Оператору.', waybound: 'Vengeful Rush (энергия от полученного урона)' },
  { name: 'Vazarin', icon: '⚪', desc: 'Поддержка и защита. Protective Sling делает Оператора неуязвимым.', waybound: 'Enduring Tides (+200% HP Оператора)' }
];

const AMP_PARTS = {
  prisms: [
    { name: 'Rahn', dmg: 300, crit: 20, stat: 20, type: 'Автоматическая' },
    { name: 'Shwaak', dmg: 1400, crit: 10, stat: 10, type: 'Дробовик' },
    { name: 'Granmu', dmg: 1000, crit: 20, stat: 20, type: 'Граната' },
    { name: 'Klamora', dmg: 600, crit: 20, stat: 20, type: 'Огнемет' },
    { name: 'Cantic', dmg: 200, crit: 15, stat: 15, type: 'Автоматическая' },
    { name: 'Lega', dmg: 300, crit: 10, stat: 10, type: 'Луч' }
  ],
  scaffolds: [
    { name: 'Pencha', dmg: 3000, crit: 20, stat: 20, type: 'Луч' },
    { name: 'Shraksun', dmg: 2500, crit: 20, stat: 20, type: 'Взрыв' },
    { name: 'Klebrik', dmg: 1000, crit: 10, stat: 10, type: 'Самонаведение' },
    { name: 'Phahd', dmg: 1500, crit: 20, stat: 20, type: 'Глефа' },
    { name: 'Exard', dmg: 2000, crit: 15, stat: 15, type: 'Взрыв' },
    { name: 'Certus', dmg: 1000, crit: 20, stat: 20, type: 'Залп' }
  ],
  braces: [
    { name: 'Clapkra', bonus: 'Боекомплект +80', statBonus: 0 },
    { name: 'Juttni', bonus: 'Быстрая перезарядка', statBonus: 0 },
    { name: 'Lohrin', bonus: 'Крит +12%, Статус +12%', statBonus: 12 },
    { name: 'Anspatha', bonus: 'Перезарядка Ампа +20', statBonus: 0 },
    { name: 'Certus', bonus: 'Крит +20%', statBonus: 20 }
  ]
};

// РАЗДЕЛЕННЫЕ МОДЫ И АРКАНЫ
const OPERATOR_MODS = [
  // Моды для Ампов (Vox Solaris)
  { name: 'Eternal Logistics', type: 'Амп', rank: 'Max', effect: 'Амп перезаряжается, пока Оператор использует способности.', source: 'Vox Solaris' },
  { name: 'Eternal Onslaught', type: 'Амп', rank: 'Max', effect: 'При убийстве из Ампа: +60% урона Ампа на 4 сек (стакается).', source: 'Vox Solaris' },
  { name: 'Eternal Eradicate', type: 'Амп', rank: 'Max', effect: 'При убийстве из Ампа: +60% урона способностей Оператора на 4 сек.', source: 'Vox Solaris' },
  { name: 'Eternal Sustain', type: 'Амп', rank: 'Max', effect: 'Убийства из Ампа восстанавливают 30 HP Оператору.', source: 'Vox Solaris' },
  
  // Арканы Оператора (Quills / Vox Solaris)
  { name: 'Magus Lockdown', type: 'Аркан', rank: 'Max', effect: 'Рывок Оператора оставляет мину, парализующую врагов.', source: 'Vox Solaris' },
  { name: 'Magus Repair', type: 'Аркан', rank: 'Max', effect: 'Войдя в Войд (Void Mode), Оператор лечит Варфрейма (25% HP/сек).', source: 'Vox Solaris' },
  { name: 'Magus Elevate', type: 'Аркан', rank: 'Max', effect: 'При переключении на Оператора: 95% шанс восстановить 300 HP Варфрейму.', source: 'Quills' },
  { name: 'Magus Melt', type: 'Аркан', rank: 'Max', effect: 'Рывок Оператора дает +30% урона Огнем на 5 сек (до 7 стаков).', source: 'Quills' },
  { name: 'Magus Anomaly', type: 'Аркан', rank: 'Max', effect: 'При входе в Войд Оператор притягивает врагов к себе.', source: 'Quills' }
];

function renderOperator() {
  renderFocusSchools();
  initAmpBuilder();
  renderOperatorMods();
}

function switchOperatorTab(id, btn) {
  document.querySelectorAll('#panel-operator .itab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('#panel-operator .itab-panel').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('op-tab-' + id).classList.add('active');
}

function renderFocusSchools() {
  const el = document.getElementById('focusGrid');
  if (!el) return;
  
  el.innerHTML = FOCUS_SCHOOLS.map(school => `
    <div class="ref-card" style="padding:15px;">
      <h4 style="color:var(--accent); margin:0 0 10px 0; display:flex; align-items:center; gap:8px;">
        <span style="font-size:20px;">${school.icon}</span> ${school.name}
      </h4>
      <p style="font-size:12px; color:var(--text); margin-bottom:8px; line-height:1.4;">${school.desc}</p>
      <div style="font-size:11px; color:var(--dim); background:var(--panel); padding:5px; border-radius:4px;">
        <b>Waybound:</b> ${school.waybound}
      </div>
    </div>
  `).join('');
}

function initAmpBuilder() {
  const pSel = document.getElementById('amp_prism');
  const sSel = document.getElementById('amp_scaffold');
  const bSel = document.getElementById('amp_brace');
  
  if (!pSel || !sSel || !bSel) return;

  pSel.innerHTML = AMP_PARTS.prisms.map(p => `<option value="${p.name}">${p.name} (${p.type})</option>`).join('');
  sSel.innerHTML = AMP_PARTS.scaffolds.map(s => `<option value="${s.name}">${s.name} (${s.type})</option>`).join('');
  bSel.innerHTML = AMP_PARTS.braces.map(b => `<option value="${b.name}">${b.name} (${b.bonus})</option>`).join('');
  
  calculateAmp();
}

function calculateAmp() {
  const pName = document.getElementById('amp_prism').value;
  const sName = document.getElementById('amp_scaffold').value;
  const bName = document.getElementById('amp_brace').value;
  
  const prism = AMP_PARTS.prisms.find(p => p.name === pName);
  const scaffold = AMP_PARTS.scaffolds.find(s => s.name === sName);
  const brace = AMP_PARTS.braces.find(b => b.name === bName);
  
  if (!prism || !scaffold || !brace) return;

  let finalCrit = prism.crit + brace.statBonus;
  let finalStatus = prism.stat + brace.statBonus;
  const totalDamage = prism.dmg + scaffold.dmg;

  document.getElementById('amp_result').innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
      <h4 style="color:var(--accent2); margin:0;">Амп: ${prism.name} / ${scaffold.name} / ${brace.name}</h4>
    </div>
    
    <div class="calc-grid" style="grid-template-columns: repeat(4, 1fr); text-align:center; margin-bottom:15px;">
      <div style="background:var(--panel3); padding:10px; border-radius:6px;">
        <div style="font-size:11px; color:var(--dim);">Суммарный урон</div>
        <b style="font-size:18px; color:var(--warn)">${totalDamage}</b>
      </div>
      <div style="background:var(--panel3); padding:10px; border-radius:6px;">
        <div style="font-size:11px; color:var(--dim);">Шанс крита</div>
        <b style="font-size:18px; color:var(--accent)">${finalCrit}%</b>
      </div>
      <div style="background:var(--panel3); padding:10px; border-radius:6px;">
        <div style="font-size:11px; color:var(--dim);">Шанс статуса</div>
        <b style="font-size:18px; color:var(--accent2)">${finalStatus}%</b>
      </div>
      <div style="background:var(--panel3); padding:10px; border-radius:6px;">
        <div style="font-size:11px; color:var(--dim);">Тип Призмы</div>
        <b style="font-size:14px;">${prism.type}</b>
      </div>
    </div>
    
    <div style="background:var(--panel3); padding:10px; border-radius:6px; font-size:12px;">
      <b>Бонус от браслета:</b> ${brace.bonus} <br>
      <small style="color:var(--dim)">*Урон указан без учета модов и фокуса.</small>
    </div>
  `;
}

function renderOperatorMods() {
  const tbody = document.getElementById('tectolistTable');
  if (!tbody) return;
  
  tbody.innerHTML = OPERATOR_MODS.map(mod => {
    // Красим бейджи в зависимости от типа
    const badgeColor = mod.type === 'Амп' ? 'var(--info)' : 'var(--aug)';
    
    return `
    <tr>
      <td><b>${mod.name}</b><br><span style="font-size:10px; color:#fff; background:${badgeColor}; padding:2px 4px; border-radius:3px; margin-top:4px; display:inline-block;">${mod.type}</span></td>
      <td style="text-align:center">${mod.rank}</td>
      <td style="font-size:12px">${mod.effect}</td>
      <td style="color:var(--dim); font-size:12px">${mod.source}</td>
    </tr>
    `;
  }).join('');
}