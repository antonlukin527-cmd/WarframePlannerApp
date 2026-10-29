// Глобальное состояние. Все модули пишут в эти переменные.
let allWeapons = [];
let warframesData = [];
let companionsData = [];
let modsData = [];

let builds = JSON.parse(localStorage.getItem('wf_builds_v15')) || [];
let excludedAutoMods = JSON.parse(localStorage.getItem('wf_excluded_mods')) || [];

let editIndex = -1;
let currentMods = { frame: [], primary: [], secondary: [], melee: [] };

// Хранилище полярностей слотов (1 к 1 с модами)
let currentPolarities = { frame: [], primary: [], secondary: [], melee: [] };

let pickerType = '';
let activeModType = 'frame';
let currentCalcBuildIndex = -1;
let isEditingCalcMods = false;

// Символы для отображения полярностей
const POLARITY_ICONS = {
  'madurai': 'V',
  'vazarin': 'D',
  'naramon': '-',
  'zenurik': '=',
  'umbral': 'U',
  'penjaga': 'P',
  'unairu': 'O',
  'universal': 'A'
};