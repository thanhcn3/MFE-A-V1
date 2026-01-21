import { initFederation } from '@angular-architects/native-federation';

// Detect environment: production (Docker) or development
const isProduction = window.location.hostname !== 'localhost' || window.location.port === '8080';

const remoteUrls = isProduction ? {
  'mfeDemo': `${window.location.protocol}//${window.location.hostname}:8080/remoteEntry.json`,
  'remoteHome': `${window.location.protocol}//${window.location.hostname}:8081/remoteEntry.json`,
  'remoteAbout': `${window.location.protocol}//${window.location.hostname}:8082/remoteEntry.json`,
  'remoteProfile': `${window.location.protocol}//${window.location.hostname}:8083/remoteEntry.json`
} : {
  'mfeDemo': 'http://localhost:4200/remoteEntry.json',
  'remoteHome': 'http://localhost:4201/remoteEntry.json',
  'remoteAbout': 'http://localhost:4202/remoteEntry.json',
  'remoteProfile': 'http://localhost:4203/remoteEntry.json'
};

initFederation(remoteUrls)
  .catch(err => console.error(err))
  .then(_ => import('./bootstrap'))
  .catch(err => console.error(err));
