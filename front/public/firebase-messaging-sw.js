// Service Worker
importScripts(
  'https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js',
);
importScripts(
  'https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js',
);

const firebaseConfig = {
  apiKey: 'AIzaSyAwPqmGYiPJ-xPo2g1SYRujfjEEoyrXvzU',
  authDomain: 'web-push-notifications-99dc0.firebaseapp.com',
  projectId: 'web-push-notifications-99dc0',
  messagingSenderId: '76728868413',
  appId: '1:76728868413:web:4ef0be3b4995bfa380d454',
  measurementId: 'G-X8QYXRJXTK',
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
