// Service Worker
importScripts(
  'https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js',
);
importScripts(
  'https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js',
);

// TODO: you need to put the configuration of your firebase project
const firebaseConfig = {
  apiKey: 'apiKey',
  authDomain: 'authDomain',
  projectId: 'projectId',
  messagingSenderId: 'messagingSenderId',
  appId: 'appId',
  measurementId: 'measurementId',
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  // let clicked = false;
  self.addEventListener('notificationclick', (event) => {
    if (event.action === 'close') {
      event.notification.close();
    } else {
      // if (clicked) return;
      // clicked = true;
      clients.openWindow(event.notification.data.link || '/');
      event.notification.close();
    }
  });
  let vibration;
  if (payload.data.vibration)
    vibration = payload.data.vibration
      .split(',')
      .map((val) => Number.parseInt(val));
  const notificationOptions = {
    body: payload.data.body,
    image: payload.data.image,
    badge: payload.data.badge,
    icon: payload.data.icon || './favicon.ico',
    tag: payload.messageId,
    data: payload.data,
    vibrate: payload.data.vibrate
      ? payload.data.vibrate.split(',').map((val) => Number.parseInt(val))
      : undefined,
    silent: payload.data.silent === 'true',
    requireInteraction: payload.data.requireInteraction === 'true',
    actions: [
      {
        action: 'open',
        title: '✅ Open',
      },
      {
        action: 'close',
        title: '❌ Close',
      },
    ],
  };
  self.registration.showNotification(payload.data.title, notificationOptions);
});
