import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  UserCredential,
} from "firebase/auth";
import { auth } from "./client";

function requireAuth() {
  if (!auth) {
    throw new Error(
      "Firebase Auth is not configured. Set NEXT_PUBLIC_FIREBASE_* env vars and redeploy."
    );
  }
  return auth;
}

export const signUpWithEmail = async (email: string, password: string): Promise<UserCredential> => {
  return await createUserWithEmailAndPassword(requireAuth(), email, password);
};

export const signInWithEmail = async (email: string, password: string): Promise<UserCredential> => {
  return await signInWithEmailAndPassword(requireAuth(), email, password);
};

export const signInWithGoogle = async (): Promise<UserCredential> => {
  const provider = new GoogleAuthProvider();
  return await signInWithPopup(requireAuth(), provider);
};

export const signInWithApple = async (): Promise<UserCredential> => {
  const { OAuthProvider } = await import("firebase/auth");
  return signInWithPopup(requireAuth(), new OAuthProvider("apple.com"));
};

export const signOut = async (): Promise<void> => {
  return await firebaseSignOut(requireAuth());
};
