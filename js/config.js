// ============================================
// НАСТРОЙКИ ИГРЫ
// ============================================

// СКИНЫ — добавь свои: кинь фото в папку skins/
// и добавь строчку в массив ниже
var SKINS = [
  { id: 'default',  name: 'Новичок',    img: 'skins/default.png',  rarity: 'common' },
  { id: 'soldier',  name: 'Солдат',     img: 'skins/soldier.png',  rarity: 'common' },
  { id: 'sniper',   name: 'Снайпер',    img: 'skins/sniper.png',   rarity: 'rare' },
  { id: 'commando', name: 'Коммандос',  img: 'skins/commando.png', rarity: 'rare' },
  { id: 'ghost',    name: 'Призрак',    img: 'skins/ghost.png',    rarity: 'epic' },
  { id: 'cyber',    name: 'Кибер-воин', img: 'skins/cyber.png',    rarity: 'epic' },
  { id: 'golden',   name: 'Золотой',    img: 'skins/golden.png',   rarity: 'legendary' }

  // 👇 СВОИ СКИНЫ ДОБАВЛЯЙ СЮДА:
  // { id: 'my_skin', name: 'Мой', img: 'skins/my_photo.png', rarity: 'epic' },
];

var RARITY_CHANCE = { common: 60, rare: 25, epic: 12, legendary: 3 };
var RARITY_NAME = { common: 'Обычный', rare: 'Редкий', epic: 'Эпический', legendary: 'Легендарный' };
var RARITY_PRICE = { common: 50, rare: 150, epic: 400, legendary: 1200 };
var RARITY_WEIGHT = { common: 10, rare: 20, epic: 35, legendary: 60 };

var CASES = [
  { id: 'starter', name: 'Стартовый', icon: '📦', price: 100 },
  { id: 'warrior', name: 'Воин',      icon: '🎖️', price: 300 },
  { id: 'elite',   name: 'Элитный',   icon: '💎', price: 700 },
  { id: 'legend',  name: 'Легенда',   icon: '👑', price: 1500 }
];

var BOT_NAMES = [
  { name: 'Танкист',    avatar: '🤖' },
  { name: 'Пулемётчик', avatar: '👾' },
  { name: 'Снайпер',    avatar: '🎯' },
  { name: 'Мародёр',    avatar: '💀' },
  { name: 'Генерал',    avatar: '👹' },
  { name: 'Наёмник',    avatar: '🥷' },
  { name: 'Кибер',      avatar: '🦾' },
  { name: 'Призрак',    avatar: '👻' }
];

// Заглушка-картинка (base64 SVG)
var IMG_PLACEHOLDER = "data:image/svg+xml;base64," + btoa(
  '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100">' +
  '<rect width="100" height="100" fill="#333"/>' +
  '<text x="50" y="60" font-size="40" text-anchor="middle" fill="#666">?</text>' +
  '</svg>'
);
