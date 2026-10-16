// ============================================
// UI: ТОСТ, ТАБЫ, HEADER, RENDER
// ============================================

var toastTimer = null;
function toast(msg, tip) {
  var t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.className = 'toast show';
  if (tip == 'ok') t.style.background = '#2a5';
  else if (tip == 'err') t.style.background = '#a33';
  else if (tip == 'gold') t.style.background = '#a80';
  else t.style.background = '#444';

  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(function() { t.className = 'toast'; }, 2000);
}

function obnovitTaby() {
  var all = document.querySelectorAll('.tab');
  for (var i = 0; i < all.length; i++) {
    if (all[i].getAttribute('data-tab') == tab) all[i].classList.add('active');
    else all[i].classList.remove('active');
  }
}

function obnovitHeader() {
  document.getElementById('balance').textContent = dengi + ' 💰';
  document.getElementById('skinsCount').textContent = inv.length;
}

// ============================================
// ГЛАВНЫЙ RENDER
// ============================================
function render() {
  obnovitHeader();
  var c = document.getElementById('content');

  if (tab == 'cases') renderCases(c);
  else if (tab == 'inventory') renderInventory(c);
  else if (tab == 'battle') renderBattle(c);
}

// ============================================
// ТАБЫ
// ============================================
var vseTaby = document.querySelectorAll('.tab');
for (var ti = 0; ti < vseTaby.length; ti++) {
  vseTaby[ti].onclick = function() {
    if (spin) { toast('🎰 Подожди окончания', 'err'); return; }
    if (battleActive) { toast('⚔️ Бой идёт', 'err'); return; }
    tab = this.getAttribute('data-tab');
    obnovitTaby();
    render();
  };
}
