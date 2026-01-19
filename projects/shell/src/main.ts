import { initFederation } from '@angular-architects/native-federation';

initFederation({
  'mfeDemo': 'http://localhost:4200/remoteEntry.json',
  'remoteHome': 'http://localhost:4201/remoteEntry.json',
  'remoteAbout': 'http://localhost:4202/remoteEntry.json',
  'remoteProfile': 'http://localhost:4203/remoteEntry.json'
})
  .catch(err => console.error(err))
  .then(_ => import('./bootstrap'))
  .catch(err => console.error(err));
