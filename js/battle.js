// ============================================
// БОЙ 4 ИГРОКА — ты + 3 бота
// ============================================

function renderBattle(c) {
  var hb = '';

  // Если идёт бой — показываем арену
  if (battleActive) {
    hb += '<div class="card"><div class="card-name" style="text-align:center">⚔️ БОЙ ИДЁТ</div></div>';
    hb += '<div class="battle-arena">';
    for (var bi = 0; bi < battlePlayers.length; bi++) {
      var p = battlePlayers[bi];
      var cls = 'battle-slot';
      if (p.isMe) cls += ' me';
      if (p.skin) cls += ' ' + p.skin.rarity;
      if (p.isWinner === true) cls += ' winner';
      if (p.isWinner === false) cls += ' loser';
      hb += '<div class="' + cls + '">';
      hb += '<div class="slot-avatar">' + p.avatar + '</div>';
      hb += '<div class="slot-name">' + p.name + (p.isMe ? ' (ты)' : '') + '</div>';
      if (p.skin) {
        hb += imgTag(p.skin).replace('<img', '<img class="slot-skin"');
      } else {
        hb += '<div class="slot-skin"></div>';
      }
      hb += '<div class="slot-chance">' + p.chance + '%</div>';
      hb += '<div class="slot-status">' + (p.status || '') + '</div>';
      hb += '</div>';
    }
    hb += '</div>';
    c.innerHTML = hb;
    return;
  }

  // История боёв
  if (battleHistory.length > 0) {
    hb += '<div class="card"><div class="card-name" style="margin-bottom:8px">📜 Последние бои</div>';
    for (var bh = 0; bh < battleHistory.length; bh++) {
      var hist = battleHistory[bh];
      hb += '<div class="battle-history-item">';
      hb += '<div>' + (hist.win ? '🏆 Победа' : '💀 Проигрыш') + ' · ' + hist.mySkin + '</div>';
      hb += '<div class="' + (hist.win ? 'bh-win' : 'bh-lose') + '">' + (hist.win ? '+' + hist.gain + ' скин.' : '-' + hist.gain) + '</div>';
      hb += '</div>';
    }
    hb += '</div>';
  }

  // Если нет скинов — нельзя играть
  if (inv.length === 0) {
    hb += '<div class="card gold">';
    hb += '<div class="card-name" style="margin-bottom:8px">⚔️ Бой 4 игрока</div>';
    hb += '<div class="card-meta">Ты + 3 бота. Победитель забирает все скины.</div>';
    hb += '<div class="card-meta" style="color:#ff6666;margin-top:8px">⚠️ Нужен хотя бы 1 скин в инвентаре</div>';
    hb += '<button class="btn full" style="margin-top:10px" disabled>Открывай кейсы</button>';
    hb += '</div>';
    c.innerHTML = hb;
    return;
  }

  // Выбор ставки
  hb += '<div class="card gold">';
  hb += '<div class="card-name" style="margin-bottom:6px">⚔️ Бой 4 игрока</div>';
  hb += '<div class="card-meta">Ты + 3 бота. Победитель забирает все 4 скина.</div>';
  hb += '</div>';

  hb += '<div class="card">';
  hb += '<div class="card-name" style="margin-bottom:8px">🎯 Выбери скин для ставки</div>';
  hb += '<div class="bet-picker">';
  for (var bk = 0; bk < inv.length; bk++) {
    var bit = inv[bk];
    var bsk = naytiSkin(bit.skinId);
    if (!bsk) continue;
    var selCls = (selectedBetUid == bit.uid) ? ' selected' : '';
    hb += '<div class="bet-item' + selCls + '" onclick="vybratStavku(' + bit.uid + ')">';
    hb += imgTag(bsk);
    hb += '<div class="bet-name">' + bsk.name + '</div>';
    hb += '</div>';
  }
  hb += '</div>';
  hb += '</div>';

  if (selectedBetUid === null) {
    hb += '<button class="btn full" disabled>👆 Выбери скин для ставки</button>';
  } else {
    hb += '<button class="btn gold full" onclick="startBoy()">⚔️ В БОЙ</button>';
  }

  c.innerHTML = hb;
}

function vybratStavku(uid) {
  selectedBetUid = uid;
  render();
}

function startBoy() {
  if (battleActive) return;
  if (selectedBetUid === null) { toast('Выбери скин', 'err'); return; }

  var myIdx = -1;
  for (var i = 0; i < inv.length; i++) if (inv[i].uid == selectedBetUid) myIdx = i;
  if (myIdx === -1) { toast('Скин не найден', 'err'); return; }

  var mySkin = naytiSkin(inv[myIdx].skinId);
  if (!mySkin) { toast('Ошибка скина', 'err'); return; }

  // Собираем 3 случайных ботов
  var botPool = BOT_NAMES.slice();
  for (var sh = botPool.length - 1; sh > 0; sh--) {
    var rr = Math.floor(Math.random() * (sh + 1));
    var tmp = botPool[sh]; botPool[sh] = botPool[rr]; botPool[rr] = tmp;
  }

  var bots = [];
  for (var b = 0; b < 3; b++) {
    bots.push({
      name: botPool[b].name,
      avatar: botPool[b].avatar,
      skin: sluchaynyySkin(),
      isMe: false
    });
  }

  battlePlayers = [
    {
      name: (user && user.first_name) ? user.first_name : 'Ты',
      avatar: '😎',
      skin: mySkin,
      isMe: true
    }
  ].concat(bots);

  // Считаем шансы по редкости
  var totalWeight = 0;
  for (var w = 0; w < battlePlayers.length; w++) {
    battlePlayers[w].weight = RARITY_WEIGHT[battlePlayers[w].skin.rarity] || 10;
    totalWeight += battlePlayers[w].weight;
  }
  for (var p = 0; p < battlePlayers.length; p++) {
    battlePlayers[p].chance = Math.round(battlePlayers[p].weight / totalWeight * 100);
    battlePlayers[p].status = '';
    battlePlayers[p].isWinner = null;
  }

  battleActive = true;
  render();

  // Анимация по слотам
  var delay = 500;
  for (var slot = 0; slot < 4; slot++) {
    (function(idx, d) {
      setTimeout(function() {
        battlePlayers[idx].status = '🎰 ...';
        render();
      }, d);
    })(slot, delay * (slot + 1));
  }

  // Определяем победителя
  var roll = Math.random() * totalWeight;
  var cum = 0;
  var winIdx = 0;
  for (var win = 0; win < battlePlayers.length; win++) {
    cum += battlePlayers[win].weight;
    if (roll <= cum) { winIdx = win; break; }
  }

  setTimeout(function() {
    var winner = battlePlayers[winIdx];
    var iWin = winner.isMe;

    if (iWin) {
      // Удаляем мой скин из инвентаря
      var myRealIdx = -1;
      for (var m = 0; m < inv.length; m++) if (inv[m].uid == selectedBetUid) myRealIdx = m;
      if (myRealIdx !== -1) inv.splice(myRealIdx, 1);

      // Забираем все 4 скина
      for (var k = 0; k < battlePlayers.length; k++) {
        inv.push({ uid: novyyUid(), skinId: battlePlayers[k].skin.id, time: Date.now() });
      }
      battleHistory.unshift({ win: true, mySkin: mySkin.name, gain: 4 });
    } else {
      // Проиграл — скин уходит
      var myRealIdx2 = -1;
      for (var m2 = 0; m2 < inv.length; m2++) if (inv[m2].uid == selectedBetUid) myRealIdx2 = m2;
      if (myRealIdx2 !== -1) inv.splice(myRealIdx2, 1);

      battleHistory.unshift({ win: false, mySkin: mySkin.name, gain: 1 });
    }

    if (battleHistory.length > 5) battleHistory = battleHistory.slice(0, 5);

    for (var f = 0; f < battlePlayers.length; f++) {
      battlePlayers[f].status = '';
      battlePlayers[f].isWinner = (f == winIdx);
    }

    sohranit();
    obnovitHeader();
    render();

    setTimeout(function() {
      if (iWin) {
        toast('🏆 Победа! Забрал 4 скина!', 'gold');
      } else {
        toast('💀 Проигрыш. Скин ушёл боту ' + winner.name, 'err');
      }

      setTimeout(function() {
        battleActive = false;
        battlePlayers = [];
        selectedBetUid = null;
        tab = 'inventory';
        obnovitTaby();
        render();
      }, 1500);
    }, 2000);

  }, 3000);
    }
