// Функция пересчета вместимости
function updateCapacity() {
  if (typeof modsData === 'undefined') return;

  // 1. Считаем Фрейма
  const frameMods = currentMods.frame || [];
  const framePols = currentPolarities.frame || [];
  let frameDrain = 0;
  
  frameMods.forEach((name, i) => {
    const mod = modsData.find(m => m.name === name);
    if (mod) {
      let cost = mod.baseDrain || mod.cost || 0;
      let modPol = (mod.polarity || '').toLowerCase();
      let slotPol = (framePols[i] || '').toLowerCase();
      
      frameDrain += calculateDrainCost(cost, modPol, slotPol);
    }
  });

  // 2. Считаем Оружие (берем текущий слот в калькуляторе или по умолчанию 'primary')
  const activeSlot = document.getElementById('calc_weapon_slot')?.value || 'primary';
  let weaponMods = currentMods[activeSlot] || [];
  let weaponPols = currentPolarities[activeSlot] || [];
  let weaponDrain = 0;

  weaponMods.forEach((name, i) => {
    const mod = modsData.find(m => m.name === name);
    if (mod) {
      let cost = mod.baseDrain || mod.cost || 0;
      let modPol = (mod.polarity || '').toLowerCase();
      let slotPol = (weaponPols[i] || '').toLowerCase();
      
      weaponDrain += calculateDrainCost(cost, modPol, slotPol);
    }
  });

  // 3. Обновляем UI
  const maxFrame = 60; 
  const maxWeapon = 60;

  renderCapacityBar('cap_frame', frameDrain, maxFrame);
  renderCapacityBar('cap_weapon', weaponDrain, maxWeapon);
}

// Умный расчет стоимости с учетом полярностей
function calculateDrainCost(baseCost, modPol, slotPol) {
  if (!modPol || !slotPol) return baseCost;
  if (modPol === slotPol) return Math.ceil(baseCost / 2);
  
  // Противоположные полярности (Мадурай/Нарамон и Вазарин/Зенурик)
  const opposites = {
    'madurai': 'naramon', 'naramon': 'madurai',
    'vazarin': 'zenurik', 'zenurik': 'vazarin'
  };
  
  if (opposites[modPol] === slotPol) return Math.ceil(baseCost * 1.25);
  return baseCost;
}

// Отрисовка полоски
function renderCapacityBar(idPrefix, current, max) {
  const textEl = document.getElementById(`${idPrefix}_text`);
  const barEl = document.getElementById(`${idPrefix}_bar`);
  
  if (!textEl || !barEl) return;

  textEl.textContent = `${current} / ${max}`;
  
  let percent = (current / max) * 100;
  if (percent > 100) percent = 100;

  barEl.style.width = `${percent}%`;

  barEl.className = 'capacity-bar-fill';
  if (current > max) {
    barEl.classList.add('capacity-over');
    textEl.style.color = 'var(--accent)';
  } else if (current > max * 0.8) {
    barEl.classList.add('capacity-warn');
    textEl.style.color = 'var(--warn)';
  } else {
    barEl.classList.add('capacity-ok');
    textEl.style.color = 'var(--text)';
  }
}

// Очистка всех модов
function clearAllMods(type) {
  if (type === 'frame') {
    currentMods.frame = [];
    currentPolarities.frame = [];
  } else if (type === 'primary') {
    currentMods.primary = [];
    currentPolarities.primary = [];
  } else if (type === 'secondary') {
    currentMods.secondary = [];
    currentPolarities.secondary = [];
  } else if (type === 'melee') {
    currentMods.melee = [];
    currentPolarities.melee = [];
  } else if (type === 'weapon') {
    currentMods.primary = []; currentPolarities.primary = [];
    currentMods.secondary = []; currentPolarities.secondary = [];
    currentMods.melee = []; currentPolarities.melee = [];
  }
  
  if (typeof renderModTags === 'function') renderModTags();
  updateCapacity();
}