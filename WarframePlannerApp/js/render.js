// Вспомогательная функция для поиска статов под разными именами (включая новые из WFCD)
function getStat(obj, keys) {
  for (let key of keys) {
    if (obj[key] !== undefined && obj[key] !== null) {
      // Если это объект (например, damage: { total: 100 }), берем поле total
      if (typeof obj[key] === 'object' && obj[key].total !== undefined) {
        return obj[key].total;
      }
      return obj[key];
    }
  }
  return '?';
}

function renderDatabase(){
  const qEl = document.getElementById('db_search');
  const typeEl = document.getElementById('db_type');
  const subTypeEl = document.getElementById('db_subtype');
  const gridEl = document.getElementById('dbGrid');
  
  if (!qEl || !gridEl) return;

  const q = qEl.value.toLowerCase();
  const type = typeEl.value;
  const subType = subTypeEl.value;
  
  let list = [];
  if (type === 'Warframe' && typeof warframesData !== 'undefined') {
    list = warframesData;
  } else if (type === 'Arcane' && typeof ALL_ARCANES !== 'undefined') {
    list = ALL_ARCANES;
  } else if (typeof allWeapons !== 'undefined') {
    // УМНЫЙ ФИЛЬТР ОРУЖИЯ (учитывает type, category и productCategory)
    const normType = type.toLowerCase();
    list = allWeapons.filter(w => {
      const wType = (w.type || '').toLowerCase();
      const wCat = (w.category || '').toLowerCase();
      const wProd = (w.productCategory || '').toLowerCase();
      return wType === normType || wCat === normType || wProd === normType;
    });
  }

  const filtered = list.filter(i => {
    const mq = !q || (i.name && i.name.toLowerCase().includes(q));
    const ms = !subType || i.subType === subType || (type === 'Arcane' && i.name.includes(subType)); 
    return mq && ms;
  }).slice(0, 100);

  if (filtered.length === 0) {
    gridEl.innerHTML = '<div style="grid-column: 1/-1; text-align:center; padding:20px; color:var(--dim)">Ничего не найдено.</div>';
    return;
  }

  gridEl.innerHTML = filtered.map(i => {
    // В новых данных картинка может называться imageName или image
    const imgName = i.imageName || i.image;
    const url = imgName ? `https://cdn.warframestat.us/img/${imgName}` : '';
    
    // УМНЫЙ ПОИСК СТАТОВ
    let briefStats = '';
    if (type === 'Warframe') {
      const hp = getStat(i, ['health', 'Health', 'hp', 'HP']);
      const armor = getStat(i, ['armor', 'Armor']);
      briefStats = `❤️ Hp: ${hp} | 🛡️ Броня: ${armor}`;
    } else if (type === 'Arcane') {
      briefStats = i.desc || i.description || '';
    } else {
      const dmg = getStat(i, ['damage', 'Damage', 'totalDamage']);
      const crit = getStat(i, ['critChance', 'criticalChance', 'Crit', 'critical_chance', 'crit_chance']);
      const stat = getStat(i, ['statusChance', 'status_chance', 'proc_chance']);
      briefStats = `💥 Урон: ${dmg} | 🎯 Крит: ${crit}% | 🧪 Статус: ${stat}%`;
    }

    // Получаем инфу о крафте и дропе
    const info = getItemInfo(i, type);

    // Формируем скрытую часть карточки
    let bodyContent = '';
    if (type === 'Arcane') {
      bodyContent = `
        <div style="margin-bottom:10px; background:var(--panel3); padding:8px; border-radius:4px;">
          <b style="color:var(--accent2);">📍 Точный источник:</b> <br>
          ${i.source || 'Информация уточняется'}
        </div>
      `;
    } else {
      bodyContent = `
        <div style="margin-bottom:10px; background:var(--panel3); padding:8px; border-radius:4px;">
          <b style="color:var(--accent2);">📍 Где достать:</b> <br>
          ${info.drop}
        </div>
        <div style="margin-bottom:12px; background:var(--panel3); padding:8px; border-radius:4px;">
          <b style="color:var(--accent2);">🔨 Как создать:</b> <br>
          ${info.craft}
        </div>
      `;
    }

    return `<div class="db-card" onclick="this.classList.toggle('expanded')">
      <div class="db-card-header">
        ${url ? `<img src="${url}" class="item-icon" style="width:40px; height:40px;" onerror="this.style.display='none'">` : 
          (type === 'Arcane' ? '<div style="width:40px; height:40px; display:flex; align-items:center; justify-content:center; font-size:24px;">💠</div>' : '')}
        <div>
          <h4 class="db-card-title">${i.name}</h4>
          <p class="db-card-type">${i.type || i.category || 'Warframe'}${i.subType && type !== 'Arcane' ? ' · ' + i.subType : ''}</p>
        </div>
      </div>
      
      <div style="margin-top: 8px; font-size: 11px; color: var(--dim); line-height: 1.4;">
        ${briefStats}
      </div>

      <!-- Скрытая инфа -->
      <div class="db-card-body" onclick="event.stopPropagation()">
        ${bodyContent}
        <button class="btn-sm btn-p" style="width:100%;" onclick="quickAddFromDb('${i.name.replace(/'/g, "\\'")}', '${type}', '${i.subType || ''}')">+ В билд</button>
      </div>
    </div>`;
  }).join('');
}

// Умная функция для определения источника получения
function getItemInfo(item, type) {
  let drop = '';
  let craft = '';
  const name = item.name.trim();

  // === ПОИСК В РЕЛИКВИЯХ ===
  if (name.includes('Prime') && typeof window.WF_RELICS !== 'undefined') {
    const foundRelics = [];
    
    let relicsArray = [];
    if (Array.isArray(window.WF_RELICS)) {
      relicsArray = window.WF_RELICS;
    } else if (typeof window.WF_RELICS === 'object' && window.WF_RELICS !== null) {
      relicsArray = Object.values(window.WF_RELICS);
    }

    relicsArray.forEach(relic => {
      if (!relic || !relic.rewards) return;
      
      const matchingRewards = relic.rewards.filter(r => {
        if (typeof r.item === 'string') {
          return r.item.toLowerCase().startsWith(name.toLowerCase());
        }
        return false;
      });

      if (matchingRewards.length > 0) {
        const isVaulted = relic.vaulted;
        const vaultStatus = isVaulted ? ' <span style="color:#e67e22;">(В хранилище)</span>' : '';
        
        const rewardsStr = matchingRewards.map(r => {
          const chancePercent = (r.chance * 100).toFixed(2);
          return `<span style="color:${r.type === 'Rare' ? '#e94560' : (r.type === 'Uncommon' ? '#f1c40f' : '#3498db')}">${r.type} ${chancePercent}%</span>`;
        }).join(', ');

        foundRelics.push(`• <b>${relic.name}</b> — ${rewardsStr}${vaultStatus}`);
      }
    });

    if (foundRelics.length > 0) {
      drop = `📦 Выпадает из реликвий:<br><div style="margin-top:5px; font-size:11px;">${foundRelics.join('<br>')}</div>`;
      craft = 'Требуется Чертеж и 3-4 компонента (Нейрооптика, Каркас, Системы).';
    } else {
      drop = '📦 Прайм-предмет. <b>В загруженной базе реликвий совпадений нет.</b>';
      craft = 'Требуется Чертеж и компоненты.';
    }
  } 
  else if (name.includes('Kuva')) {
    drop = '👹 Выпадает с <b>Личей Кувы</b>.';
    craft = 'Не требует крафта.';
  }
  else if (name.includes('Tenet')) {
    drop = '👩‍🦰 Выпадает с <b>Сестер Парвоса</b>.';
    craft = 'Не требует крафта.';
  }
  else if (['Ignis', 'Opticor', 'Amprex', 'Volt'].some(w => name.includes(w))) {
    drop = '🏰 Исследуется в <b>Лаборатории Додзё</b>.';
    craft = 'Купите чертеж в Додзё.';
  }
  else if (type === 'Warframe') {
    drop = '👑 Выбивается с <b>боссов планет</b>, за квесты или в Додзё.';
    craft = 'Чертеж (Магазин) + Нейрооптика, Каркас, Системы.';
  }
  else {
    drop = '🛒 Покупается в <b>Магазине</b> за кредиты (чертеж).';
    craft = 'Скрафтите в Кузнице.';
  }

  return { drop, craft };
}

function quickAddFromDb(name, type, subType) {
  const modal = document.getElementById('modal_edit');
  if (!modal.classList.contains('active')) {
    openEditModal();
  }

  if (type === 'Arcane') {
    if (subType === 'frame') {
      document.getElementById('edit_arcane_frame').value = name;
      document.querySelector('#modal_edit .itab').click();
    } else if (subType === 'primary') {
      document.getElementById('edit_arcane_primary').value = name;
      document.querySelectorAll('#modal_edit .itab')[1].click();
    } else if (subType === 'secondary') {
      document.getElementById('edit_arcane_secondary').value = name;
      document.querySelectorAll('#modal_edit .itab')[1].click();
    } else if (subType === 'melee') {
      document.getElementById('edit_arcane_melee').value = name;
      document.querySelectorAll('#modal_edit .itab')[1].click();
    }
    alert(`✅ Аркан ${name} добавлен в билд!`);
    return;
  }

  if (type === 'Warframe') {
    document.getElementById('edit_frame').value = name;
    document.querySelector('#modal_edit .itab').click();
  } else if (type === 'Primary') {
    document.getElementById('edit_prim').value = name;
    document.querySelectorAll('#modal_edit .itab')[1].click();
  } else if (type === 'Secondary') {
    document.getElementById('edit_sec').value = name;
    document.querySelectorAll('#modal_edit .itab')[1].click();
  } else if (type === 'Melee') {
    document.getElementById('edit_melee').value = name;
    document.querySelectorAll('#modal_edit .itab')[1].click();
  }
  
  alert(`✅ ${name} добавлен в билд!`);
}

function renderShards(){
  const tableEl = document.getElementById('shardsTable');
  if (!tableEl) return;
  if (typeof SHARD_EFFECTS === 'undefined') return;

  const rows = [];
  Object.entries(SHARD_EFFECTS).forEach(([color, data]) => {
    rows.push(`<tr><td colspan="4" style="background:var(--panel3); font-weight:bold; color:var(--accent); padding:10px;">${data.label}</td></tr>`);
    data.options.forEach(o => {
      rows.push(`<tr>
        <td><span class="shard-badge shard-${color}" style="width:100%; text-align:center;">${color.toUpperCase()}</span></td>
        <td style="font-weight:bold;">${o.name}</td>
        <td style="color:var(--ok)">${o.normal}</td>
        <td style="color:var(--accent2)">${o.tau}</td>
      </tr>`);
    });
  });
  tableEl.innerHTML = rows.join('');
}

function renderMechanics(){
  const mechGrid = document.getElementById('mechanicsGrid');
  if(mechGrid) {
    mechGrid.innerHTML = MECHANICS_CARDS.map(c => `
      <div class="ref-card" style="border-top:3px solid ${c.color}">
        <h4 style="color:${c.color}">${c.title}</h4>
        ${c.lines.map(l => `<p>${l}</p>`).join('')}
      </div>
    `).join('');
  }
}