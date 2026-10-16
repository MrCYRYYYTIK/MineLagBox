// ============================================
// ИНВЕНТАРЬ
// ============================================

function renderInventory(c) {
  if (inv.length == 0) {
    c.innerHTML = '<div class="empty">🎒 Инвентарь пуст<br><br>Открывай кейсы!</div>';
    return;
  }
  var hi = '<div class="card"><div class="card-row">';
  hi += '<div class="card-info"><div class="card-name">Всего: ' + inv.length + '</div>';
  hi += '<div class="card-meta">👆 Тапни скин чтобы продать</div></div>';
  hi += '<button class="btn red small" onclick="prodatVse()">💸 Продать всё</button>';
  hi += '</div></div>';
  hi += '<div class="inv-grid">';
  for (var j = 0; j < inv.length; j++) {
    var it = inv[j];
    var sk = naytiSkin(it.skinId);
    if (!sk) continue;
    hi += '<div class="inv-item ' + sk.rarity + '" onclick="prodatSkin(' + it.uid + ')">';
    hi += imgTag(sk);
    hi += '<div class="inv-name">' + sk.name + '</div>';
    hi += '<div class="inv-rar" style="color:' + cvetRedkosti(sk.rarity) + '">' + RARITY_NAME[sk.rarity] + '</div>';
    hi += '</div>';
  }
  hi += '</div>';
  c.innerHTML = hi;
}

function prodatSkin(uid) {
  var idx = -1;
  for (var i = 0; i < inv.length; i++) if (inv[i].uid == uid) idx = i;
  if (idx == -1) return;
  var s = naytiSkin(inv[idx].skinId);
  if (!s) { inv.splice(idx, 1); sohranit(); render(); return; }

  if (s.rarity == 'epic' || s.rarity == 'legendary') {
    if (!confirm('Продать "' + s.name + '" за ' + RARITY_PRICE[s.rarity] + ' 💰?')) return;
  }
  var cena = RARITY_PRICE[s.rarity] || 50;
  dengi += cena;
  inv.splice(idx, 1);
  sohranit();
  toast('💰 +' + cena + ' за ' + s.name, 'ok');
  obnovitHeader();
  render();
}

function prodatVse() {
  if (inv.length == 0) { toast('Инвентарь пуст', 'err'); return; }
  var sum = 0;
  for (var i = 0; i < inv.length; i++) {
    var s = naytiSkin(inv[i].skinId);
    if (!s) continue;
    sum += RARITY_PRICE[s.rarity] || 50;
  }
  if (!confirm('Продать все скины за ' + sum + ' 💰?')) return;
  dengi += sum;
  inv = [];
  sohranit();
  toast('💰 Продано всё: +' + sum, 'gold');
  obnovitHeader();
  render();
                 }
