(() => {
  const EXT = globalThis.browser ?? globalThis.chrome;
  if (!EXT?.runtime?.getURL) return;

  const injectorUrl = EXT.runtime.getURL('core/injector.js');
  const SCRIPT_ID = 'omni-messenger-loud-mic-injector';

  function sendHeartbeat() {
    try {
      const result = EXT.runtime.sendMessage({ type: 'MICMAX_HEARTBEAT' });
      if (result?.catch) result.catch(() => {});
    } catch (_) {}
  }

  function inject() {
    if (window.__micMaxInjectorReady || document.getElementById(SCRIPT_ID)) {
      sendHeartbeat();
      return;
    }
    const root = document.documentElement || document.head;
    if (!root) return;
    const script = document.createElement('script');
    script.id = SCRIPT_ID;
    script.src = injectorUrl;
    script.async = false;
    script.dataset.omniMessengerLoudMic = 'injector';
    script.onload = () => {
      document.documentElement.dataset.micMaxLoaderInjected = '1';
      sendHeartbeat();
      script.remove();
    };
    script.onerror = () => script.remove();
    (document.head || root).appendChild(script);
  }

  inject();
  window.addEventListener('message', (event) => {
    if (event.source === window && event.data?.type === 'MIC_MAXIMIZER_READY') sendHeartbeat();
  });
  document.addEventListener('DOMContentLoaded', inject, { once: true });
  setTimeout(inject, 1200);
})();
