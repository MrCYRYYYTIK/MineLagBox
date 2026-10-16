// ============================================
// ЗАПУСК ИГРЫ
// ============================================

initVK();

// Автосохранение
setInterval(function() {
  if (vkLoaded) sohranit();
}, 10000);

// Сохранение при закрытии
window.addEventListener('beforeunload', function() {
  if (vkLoaded) sohranit();
});
