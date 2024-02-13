import { initializeApp } from 'firebase/app';
import { getMessaging } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

// Initialze service worker
export const initFCMServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    window.navigator.serviceWorker
      .getRegistration('/firebase-cloud-messaging-push-scope')
      .then((serviceWorker) => {
        if (!serviceWorker) {
          window.navigator.serviceWorker
            .register('/firebase-messaging-sw.js')
            .then(() => {
              console.log('success registering SW');
            })
            .catch((err) => {
              console.log('registering failed', err);
            });
        } else console.log('success registering SW');
      });
  }
  console.error('The browser doesn`t support service worker.');
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

// Initialize Firebase Cloud Messaging and get a reference to the service
export const messaging = getMessaging(firebaseApp);
