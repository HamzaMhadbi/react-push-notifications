import * as admin from 'firebase-admin';
import { getMessaging } from 'firebase-admin/messaging';

// initialize firebase admin APP
const firebaseApp = admin.initializeApp({
  projectId: process.env.FIREBASE_PROJECT_ID,
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  }),
});

// initialize FCM service and export him
export const FMCService = getMessaging(firebaseApp);
