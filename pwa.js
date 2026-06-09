let deferredPrompt = null;
const installBtn = document.getElementById('installBtn');

async function limparCachesAntigosMyPDV() {
  try {
    if ('caches' in window) {
      const keys = await caches.keys();
      await Promise.all(keys.filter(k => !k.includes('v1-0-7')).map(k => caches.delete(k)));
    }
  } catch (e) { console.warn(e); }
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    await limparCachesAntigosMyPDV();
    navigator.serviceWorker.register('./service-worker.js?v=107')
      .then(registration => registration.update())
      .catch(console.warn);
  });
}

window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault();
  deferredPrompt = event;
  if (installBtn) installBtn.style.display = 'inline-flex';
});

if (installBtn) {
  installBtn.addEventListener('click', async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    deferredPrompt = null;
    installBtn.style.display = 'none';
  });
}

window.addEventListener('appinstalled', () => {
  deferredPrompt = null;
  if (installBtn) installBtn.style.display = 'none';
});
