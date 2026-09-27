import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId &&
    firebaseConfig.appId
);

let app: FirebaseApp | null = null;
let auth: Auth | null = null;

if (isFirebaseConfigured) {
  try {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    auth = getAuth(app);
  } catch (error) {
    console.warn("Firebase client SDK failed to initialize:", error);
    app = null;
    auth = null;
  }
} else if (typeof window !== "undefined") {
  // Client-side without env vars: warn once and run in "auth disabled" mode
  // instead of throwing at import time (which would black-screen every page
  // under RootLayout with "Application error: a client-side exception...").
  console.warn(
    "Missing NEXT_PUBLIC_FIREBASE_* env vars. Running without Firebase Auth. " +
      "Set them in Vercel Project Settings > Environment Variables and redeploy."
  );
}

export { app, auth, isFirebaseConfigured };
