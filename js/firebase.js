import { initializeApp } from 'firebase/app';
import { getAnalytics }  from 'firebase/analytics';

const firebaseConfig = {
  apiKey:            'AIzaSyCOTBpJqPlsBu8C7TZG1fEKWvupNsBxWPk',
  authDomain:        'mygin-co.firebaseapp.com',
  projectId:         'mygin-co',
  storageBucket:     'mygin-co.firebasestorage.app',
  messagingSenderId: '767726395124',
  appId:             '1:767726395124:web:a1a3c84f4f2ca12d1cc8a1',
  measurementId:     'G-6RG7SEN9XG',
};

export const app       = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
