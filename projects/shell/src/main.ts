import { initFederation } from '@angular-architects/native-federation';

/**
 * ==============================
 * ENV DETECTION
 * ==============================
 */
const isLocalhost =
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1';

/**
 * ==============================
 * BASE URL (DYNAMIC)
 * ==============================
 * - Dev  : dùng port riêng
 * - Prod : dùng chung origin (nginx gateway)
 */
const baseUrl = `${window.location.protocol}//${window.location.host}`;

/**
 * ==============================
 * REMOTE CONFIG
 * ==============================
 */
const remoteUrls = isLocalhost
  ? {
    // ===== DEV MODE =====
    mfeDemo: 'http://localhost:4200/remoteEntry.json',
    remoteHome: 'http://localhost:4201/remoteEntry.json',
    remoteAbout: 'http://localhost:4202/remoteEntry.json',
    remoteProfile: 'http://localhost:4203/remoteEntry.json',
  }
  : {
    // ===== PROD / DOCKER / NGINX =====
    mfeDemo: `${baseUrl}/remoteEntry.json`,
    remoteHome: `${baseUrl}/remote-home/remoteEntry.json`,
    remoteAbout: `${baseUrl}/remote-about/remoteEntry.json`,
    remoteProfile: `${baseUrl}/remote-profile/remoteEntry.json`,
  };

/**
 * ==============================
 * INIT FEDERATION
 * ==============================
 */
initFederation(remoteUrls)
  .then(() => import('./bootstrap'))
  .catch((err) => {
    console.error('❌ Federation init failed', err);
  });
