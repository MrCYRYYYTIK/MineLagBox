// ============================================
// КЕЙСЫ — открытие с рулеткой
// ============================================

function renderCases(c) {
  var h = '<div class="card"><div class="card-name">📦 Кейсы</div>' +
          '<div class="card-meta">Открывай кейсы и получай скины</div></div>';
  h += '<div class="cases-grid">';
  for (var i = 0; i < CASES.length; i++) {
    var cs = CASES[i];
    h += '<div class="card"><div class="card-row">';
    h += '<div class="card-info">';
    h += '<div class="card-name">' + cs.icon + ' ' + cs.name + '</div>';
    h += '<div class="card-meta">Обычные → легендарные</div>';
    h += '</div>';
    h += '<div class="card-price">' + cs.price + ' 💰</div>';
    if (dengi < cs.price) {
      h += '<button class="btn" disabled>Мало</button>';
    } else {
      h += '<button class="btn gold" onclick="otkrytKeys(\'' + cs.id + '\')">Открыть</button>';
    }
    h += '</div></div>';
  }
  h += '</div>';
  h += '<div class="card" style="margin-top:8px"><div class="card-name" style="margin-bottom:6px">📊 Шансы</div>';
  h += '<div class="card-meta">Обычный — 60% · Редкий — 25% · Эпический — 12% · Легендарный — 3%</div>';
  h += '</div>';
  c.innerHTML = h;
}

function otkrytKeys(caseId) {
  if (spin) return;
  var cs = naytiKeys(caseId);
  if (!cs) return;
  if (dengi < cs.price) { toast('💸 Мало денег', 'err'); return; }

  dengi -= cs.price;
  spin = true;
  sohranit();
  obnovitHeader();

  var WIN_INDEX = 42;
  var strip = [];
  for (var i = 0; i < 50; i++) strip.push(sluchaynyySkin());
  var winSkin = sluchaynyySkin();
  strip[WIN_INDEX] = winSkin;

  document.getElementById('spinTitle').textContent = cs.icon + ' ' + cs.name + ' — открытие...';
  var stripEl = document.getElementById('spinStrip');
  var closeBtn = document.getElementById('spinCloseBtn');
  closeBtn.style.display = 'none';

  var html = '';
  for (var k = 0; k < strip.length; k++) {
    html += '<div class="spin-item">';
    html += imgTag(strip[k]);
    html += '<div class="rarity-bar rarity-' + strip[k].rarity + '"></div>';
    html += '</div>';
  }
  stripEl.innerHTML = html;

  stripEl.style.transition = 'none';
  stripEl.style.transform = 'translateX(0)';

  document.getElementById('spinModal').classList.add('show');
  void stripEl.offsetWidth;

  var itemW = 110;
  var winW = stripEl.parentElement.offsetWidth;
  if (winW <= 0) winW = 400;
  var offset = WIN_INDEX * itemW + itemW / 2 - winW / 2;

  requestAnimationFrame(function() {
    requestAnimationFrame(function() {
      stripEl.style.transition = 'transform 5s cubic-bezier(0.15, 0.9, 0.2, 1)';
      stripEl.style.transform = 'translateX(-' + offset + 'px)';
    });
  });

  setTimeout(function() {
    inv.push({ uid: novyyUid(), skinId: winSkin.id, time: Date.now() });
    spin = false;
    sohranit();
    document.getElementById('spinTitle').innerHTML =
      '🎉 <span style="color:' + cvetRedkosti(winSkin.rarity) + '">' + winSkin.name + '</span>' +
      ' <span style="color:#888;font-size:12px">(' + RARITY_NAME[winSkin.rarity] + ')</span>';
    closeBtn.style.display = 'block';
    obnovitHeader();
    toast('🎉 ' + winSkin.name + ' (' + RARITY_NAME[winSkin.rarity] + ')', 'gold');
  }, 5200);
}

function zakrytModal() {
  if (spin) return;
  document.getElementById('spinModal').classList.remove('show');
  render();
      }
