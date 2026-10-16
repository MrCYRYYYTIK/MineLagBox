// ============================================
// ИНТЕГРАЦИЯ С VK MINI APPS
// ============================================

function vkDostupen() {
  return typeof vkBridge !== 'undefined' && vkBridge && typeof vkBridge.send === 'function';
}

function initVK() {
  if (!vkDostupen()) {
    user = { id: 0, first_name: 'Гость', last_name: '' };
    document.getElementById('playerName').textContent = 'Гость';
    zagruzitLocal();
    render();
    return;
  }

  vkBridge.send('VKWebAppInit').catch(function() {});

  vkBridge.send('VKWebAppGetUserInfo')
    .then(function(u) {
      user = u;
      document.getElementById('playerName').textContent = u.first_name || 'Игрок';
      return zagruzitVK();
    })
    .catch(function() {
      user = { id: 0, first_name: 'Гость', last_name: '' };
      document.getElementById('playerName').textContent = 'Гость';
      zagruzitLocal();
    })
    .then(function() {
      vkLoaded = true;
      render();
    });
}

function zagruzitVK() {
  if (!user || !user.id) {
    zagruzitLocal();
    return Promise.resolve();
  }
  return vkBridge.send('VKWebAppStorageGet', { keys: ['save_' + user.id] })
    .then(function(res) {
      var v = res.keys[0] && res.keys[0].value;
      if (v) {
        try { primenit(JSON.parse(v)); } catch(e) { zagruzitLocal(); }
      } else {
        zagruzitLocal();
      }
    })
    .catch(function() { zagruzitLocal(); });
}
