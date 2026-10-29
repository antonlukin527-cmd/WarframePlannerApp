let marketPricesCache = JSON.parse(localStorage.getItem('wf_market_prices') || '{}');
let collectionState = JSON.parse(localStorage.getItem('wf_collection') || '{}');
const MARKET_CACHE_TTL = 1000 * 60 * 30;

function getItemUrlSlug(name) {
  if (!name) return '';
  return name.toLowerCase().replace(/\s+/g, '_').replace(/['.]/g, '');
}

async function fetchItemMarketPrice(itemName) {
  const slug = getItemUrlSlug(itemName);
  const now = Date.now();

  if (marketPricesCache[slug] && (now - marketPricesCache[slug].timestamp < MARKET_CACHE_TTL)) {
    return marketPricesCache[slug].price;
  }

  try {
    const res = await fetch(`https://api.warframe.market/v1/items/${slug}/orders`, {
      headers: { 'Accept': 'application/json' }
    });
    
    if (!res.ok) return null;
    const json = await res.json();
    
    const orders = json.payload?.orders || [];
    const sellOrders = orders.filter(o => o.order_type === 'sell' && o.user?.status === 'ingame');

    if (sellOrders.length > 0) {
      const lowest = Math.min(...sellOrders.map(o => o.platinum));
      marketPricesCache[slug] = { price: lowest, timestamp: now };
      localStorage.setItem('wf_market_prices', JSON.stringify(marketPricesCache));
      return lowest;
    }
  } catch (e) {
    console.warn(`Не удалось загрузить цену для ${itemName}:`, e);
  }
  return marketPricesCache[slug]?.price || null;
}

function isItemOwned(name) {
  return !!collectionState[name];
}

function toggleItemOwned(name) {
  collectionState[name] = !collectionState[name];
  localStorage.setItem('wf_collection', JSON.stringify(collectionState));
  
  if (typeof renderModTags === 'function') renderModTags();
  if (typeof updateBuildMarketSummary === 'function') updateBuildMarketSummary();
}

async function updateBuildMarketSummary() {
  const sumEl = document.getElementById('build_market_summary');
  if (!sumEl) return;

  const allMods = [
    ...(currentMods.frame || []).map(m => ({ name: m, slot: 'frame' })),
    ...(currentMods.primary || []).map(m => ({ name: m, slot: 'primary' })),
    ...(currentMods.secondary || []).map(m => ({ name: m, slot: 'secondary' })),
    ...(currentMods.melee || []).map(m => ({ name: m, slot: 'melee' }))
  ];

  let totalPrice = 0;
  let missingCount = 0;
  let pricedCount = 0;

  for (const item of allMods) {
    if (isItemOwned(item.name)) continue;
    missingCount++;

    const price = await fetchItemMarketPrice(item.name);
    if (price !== null) {
      totalPrice += price;
      pricedCount++;
    }
  }

  sumEl.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center;">
      <span>📦 Не хватает модов: <b>${missingCount}</b></span>
      <span style="color:var(--warn); font-size:14px; font-weight:bold;">
        Стоимость докупки: <b>~${pricedCount > 0 ? totalPrice : '—'} пл.</b>
      </span>
    </div>
  `;
}

function renderMarketSummaryUI() {
  const toolbar = document.getElementById('build_market_toolbar');
  if (!toolbar) return;
  
  toolbar.innerHTML = `
    <div style="font-size:12px; color:var(--dim);">
      💡 Отмечайте галочкой моды, которые <b>уже есть в инвентаре</b>, чтобы калькулятор считал стоимость только недостающих.
    </div>
    <div id="build_market_summary" style="font-size:12px; color:var(--text);">Загрузка цен...</div>
  `;

  updateBuildMarketSummary();
}