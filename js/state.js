// ============================================
// СОСТОЯНИЕ ИГРЫ И СОХРАНЕНИЕ
// ============================================

var user = null;
var dengi = 1000;
var inv = [];
var tab = 'cases';
var spin = false;
var uidCounter = 0;
var vkLoaded = false;

// Бой
var battleActive = false;
var battlePlayers = [];
var battleHistory = [];
var selectedBetUid = null;

// ============================================
// УТИЛИТЫ
// ============================================
function naytiSkin(id) {
  for (var i = 0; i < SKINS.length; i++) if (SKINS[i].id == id) return SKINS[i];
  return null;
}

function naytiKeys(id) {
  for (var i = 0; i < CASES.length; i++) if (CASES[i].id == id) return CASES[i];
  return null;
}

function novyyUid() {
  uidCounter++;
  return Date.now() * 1000 + uidCounter;
}

function imgTag(skin) {
  return '<img src="' + skin.img + '" onerror="this.onerror=null;this.src=\'' + IMG_PLACEHOLDER + '\'">';
}

function cvetRedkosti(r) {
  return { common: '#888', rare: '#3b82f6', epic: '#a855f7', legendary: '#f59e0b' }[r] || '#fff';
}

function sluchaynayaRedkost() {
  var roll = Math.random() * 100;
  var cum = 0;
  var arr = ['common', 'rare', 'epic', 'legendary'];
  for (var i = 0; i < arr.length; i++) {
    cum += RARITY_CHANCE[arr[i]];
    if (roll <= cum) return arr[i];
  }
  return 'common';
}

function sluchaynyySkin() {
  var rar = sluchaynayaRedkost();
  var pool = [];
  for (var i = 0; i < SKINS.length; i++) if (SKINS[i].rarity == rar) pool.push(SKINS[i]);
  if (pool.length == 0) pool = SKINS;
  return pool[Math.floor(Math.random() * pool.length)];
}

// ============================================
// СОХРАНЕНИЕ / ЗАГРУЗКА
// ============================================
function dannye() {
  return { dengi: dengi, inv: inv, uidCounter: uidCounter };
}

function sohranit() {
  try { localStorage.setItem('minelagbox', JSON.stringify(dannye())); } catch(e) {}
  if (typeof vkDostupen === 'function' && vkDostupen() && user && user.id) {
    vkBridge.send('VKWebAppStorageSet', {
      key: 'save_' + user.id,
      value: JSON.stringify(dannye())
    }).catch(function() {});
  }
}

function primenit(d) {
  if (!d) return;
  if (typeof d.dengi === 'number' && d.dengi >= 0) dengi = d.dengi;
  if (d.inv && d.inv.length) inv = d.inv;
  if (typeof d.uidCounter === 'number') uidCounter = d.uidCounter;
}

function zagruzitLocal() {
  var s = localStorage.getItem('minelagbox');
  if (!s) return;
  try { primenit(JSON.parse(s)); } catch(e) {}
          }
