/**
 * Inicializa o Google Analytics
 */
export function initGoogleAnalytics() {
  const gaId = import.meta.env.VITE_GA_ID;

  if (!gaId) {
    console.warn('Google Analytics ID não configurado. Defina VITE_GA_ID no arquivo .env');
    return;
  }

  // Carrega o script do Google Analytics
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
  document.head.appendChild(script);

  // Inicializa o dataLayer e a função gtag
  window.dataLayer = window.dataLayer || [];
  function gtag(...args: unknown[]) {
    window.dataLayer.push(args);
  }

  window.gtag = gtag;

  gtag('js', new Date());
  gtag('config', gaId);
}

// Declaração de tipos para TypeScript
declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

