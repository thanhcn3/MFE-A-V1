import { initFederation } from '@angular-architects/native-federation';

const isLocalhost =
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1';

const baseUrl = `${window.location.protocol}//${window.location.host}`;

const remoteUrls = isLocalhost
  ? {
    mfeDemo: 'http://localhost:4200/remoteEntry.json',
    'remote-home': 'http://localhost:4201/remoteEntry.json',
    'remote-about': 'http://localhost:4202/remoteEntry.json',
    'remote-profile': 'http://localhost:4203/remoteEntry.json',
  }
  : {
    mfeDemo: `${baseUrl}/remoteEntry.json`,
    'remote-home': `${baseUrl}/remote-home/remoteEntry.json`,
    'remote-about': `${baseUrl}/remote-about/remoteEntry.json`,
    'remote-profile': `${baseUrl}/remote-profile/remoteEntry.json`,
  };

initFederation(remoteUrls)
  .then(() => import('./bootstrap'))
  .catch((err) => {
    console.error('Federation init failed', err);
  });
