// fetch_meta_builds.mjs
// Запуск: node fetch_meta_builds.mjs

import fs from 'node:fs/promises';

const MCP_URL = 'http://127.0.0.1:3000/mcp';
const OUTPUT_FILE = 'meta_builds.js';
const DELAY_MS = 4000; // 4 секунды — безопасная задержка

// ==== СПИСОК АКТУАЛЬНОЙ МЕТЫ ====
// Здесь только самое популярное. Можешь дописать свои варианты.
const TARGETS = [
  // Топовые Варфреймы
  { item: 'Saryn Prime', category: 'Warframe' },
  { item: 'Revenant Prime', category: 'Warframe' },
  { item: 'Dante', category: 'Warframe' },
  { item: 'Mesa Prime', category: 'Warframe' },
  { item: 'Kullervo', category: 'Warframe' },
  { item: 'Wisp Prime', category: 'Warframe' },
  { item: 'Khora Prime', category: 'Warframe' },
  { item: 'Octavia Prime', category: 'Warframe' },
  { item: 'Volt Prime', category: 'Warframe' },
  { item: 'Protea', category: 'Warframe' },
  { item: 'Dante', category: 'Warframe' },
  { item: 'Nova Prime', category: 'Warframe' },
  { item: 'Nekros Prime', category: 'Warframe' },
  { item: 'Ash Prime', category: 'Warframe' },
  { item: 'Frost Prime', category: 'Warframe' },
  { item: 'Uriel', category: 'Warframe' }, // Новый фрейм

  // Основное оружие (Primary)
  { item: 'Torid Incarnon', category: 'Weapon' },
  { item: 'Phenmor', category: 'Weapon' },
  { item: 'Felarx', category: 'Weapon' },
  { item: 'Latron Incarnon', category: 'Weapon' },
  { item: 'Strun Prime', category: 'Weapon' },
  { item: 'Burston Prime', category: 'Weapon' },
  { item: 'Braton Incarnon', category: 'Weapon' },
  { item: 'Boltor Incarnon', category: 'Weapon' },
  { item: 'Nataruk', category: 'Weapon' },

  // Вторичное оружие (Secondary)
  { item: 'Laetum', category: 'Weapon' },
  { item: 'Kuva Nukor', category: 'Weapon' },
  { item: 'Dual Toxocyst Incarnon', category: 'Weapon' },
  { item: 'Epitaph', category: 'Weapon' },
  { item: 'Tenet Cycron', category: 'Weapon' },
  { item: 'Lex Incarnon', category: 'Weapon' },

  // Ближний бой (Melee)
  { item: 'Kronen Prime', category: 'Weapon' },
  { item: 'Glaive Prime', category: 'Weapon' },
  { item: 'Praedos', category: 'Weapon' },
  { item: 'Dual Ichor Incarnon', category: 'Weapon' },
  { item: 'Ceramic Dagger Incarnon', category: 'Weapon' },
  { item: 'Furax Incarnon', category: 'Weapon' },
  { item: 'Hate', category: 'Weapon' },
  { item: 'Xoris', category: 'Weapon' }
];

let rpcId = 1;
let sessionId = null;

async function rpc(method, params = null, isNotification = false) {
  const body = { jsonrpc: '2.0', method };
  if (params !== null) body.params = params;
  if (!isNotification) body.id = rpcId++;

  const headers = { 'Content-Type': 'application/json', 'Accept': 'application/json, text/event-stream' };
  if (sessionId) headers['Mcp-Session-Id'] = sessionId;

  const res = await fetch(MCP_URL, { method: 'POST', headers, body: JSON.stringify(body) });
  const sid = res.headers.get('mcp-session-id'); if (sid) sessionId = sid;
  if (isNotification) return null;
  if (!res.ok) throw new Error(`RPC ${method} failed: ${res.status}`);

  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('text/event-stream')) return parseSseForResult(await res.text());
  const json = await res.json();
  if (json.error) throw new Error(JSON.stringify(json.error));
  return json.result;
}

function parseSseForResult(raw) {
  const lines = raw.split(/\r?\n/); let last = null;
  for (const line of lines) {
    if (line.startsWith('data:')) {
      const payload = line.slice(5).trim();
      if (!payload || payload === '[DONE]') continue;
      try { const obj = JSON.parse(payload); if (obj.result !== undefined) last = obj; } catch {}
    }
  }
  if (!last) throw new Error('SSE без result');
  return last.result;
}

async function connect() {
  await rpc('initialize', { protocolVersion: '2025-06-18', capabilities: {}, clientInfo: { name: 'warframe-meta', version: '1.0.0' } });
  await rpc('notifications/initialized', null, true);
  console.log(`✓ Подключено к MCP\n`);
}

function extractTextFromToolResult(result) {
  if (!result || !Array.isArray(result.content)) return '';
  return result.content.filter(c => c.type === 'text').map(c => c.text).join('\n');
}

function normalizeBuild(itemName, category, rawText) {
  const parsed = (() => { try { return JSON.parse(rawText); } catch { return null; } })();
  let builds = Array.isArray(parsed) ? parsed : (parsed?.builds || parsed?.results || []);
  
  if (!builds.length) return [];

  // Берем только 1 лучший билд на предмет
  return builds.slice(0, 1).map((b, idx) => {
    const name = b.name || b.title || `${itemName} build`;
    const mods = Array.isArray(b.mods) ? b.mods.map(m => m.name || m).join(', ') : (b.mods || '—');
    return {
      id: `of-${itemName.toLowerCase().replace(/\s+/g, '-')}`,
      name: `${name} (${itemName})`,
      category,
      source: 'Overframe',
      note: `Автор: ${b.author || '—'}. Голосов: ${b.votes || b.score || '—'}.`,
      frame: category === 'Warframe' ? itemName : '—',
      role: '—', task: 'Steel Path',
      weapon: category === 'Weapon' ? itemName : '—',
      companion: '—',
      modsFrame: category === 'Warframe' ? mods : '—',
      modsWeapon: category === 'Weapon' ? mods : '—',
      modsComp: '—',
      arcFrame: '—', arcWeap: '—', helminth: '—',
      focus: '—', amp: '—', modsAmp: '—', arcOp: '—', arcAmp: '—', intrinsics: '—'
    };
  });
}

async function main() {
  console.log('=== Сбор актуальной меты ===\n');
  await connect();

  console.log(`Предметов в списке: ${TARGETS.length}`);
  console.log(`Примерное время работы: ~${Math.ceil((TARGETS.length * DELAY_MS) / 60000)} мин (пауза ${DELAY_MS/1000} сек).\n`);

  const out = [];
  let ok = 0, fail = 0;

  for (let i = 0; i < TARGETS.length; i++) {
    const { item, category } = TARGETS[i];
    process.stdout.write(`[${i+1}/${TARGETS.length}] ${item} ... `);
    
    try {
      const result = await rpc('tools/call', {
        name: 'lookup_builds',
        arguments: { item_names: [item], category, limit: 1 }
      });
      const text = extractTextFromToolResult(result);
      const normalized = normalizeBuild(item, category, text);
      
      if (normalized.length) {
        out.push(...normalized);
        console.log(`✓`);
        ok++;
      } else {
        console.log(`— (нет)`);
        fail++;
      }
    } catch (e) {
      console.log(`✗ (${e.message.slice(0, 30)})`);
      fail++;
    }
    
    // Ждем 4 секунды перед следующим запросом
    await new Promise(r => setTimeout(r, DELAY_MS));
  }

  const header = `// Сгенерировано: ${new Date().toLocaleString('ru-RU')}\n// Всего: ${out.length} (успешно: ${ok}, ошибок: ${fail})\n\n`;
  await fs.writeFile(OUTPUT_FILE, header + 'window.WF_META_BUILDS = ' + JSON.stringify(out, null, 2) + ';\n', 'utf8');

  console.log(`\n✅ Готово! Файл ${OUTPUT_FILE} создан. Билдов: ${out.length}`);
  console.log('Обнови builds.html (Ctrl+F5) — они появятся во вкладке «Мета».');
}

main().catch(err => { console.error(err); process.exit(1); });