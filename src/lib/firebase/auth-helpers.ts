import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  OAuthProvider,
  signOut as firebaseSignOut,
  updateProfile,
  UserCredential,
} from "firebase/auth";
import { auth } from "./client";

export const signUpWithEmail = async (
  email: string,
  password: string,
  displayName?: string
): Promise<UserCredential> => {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  if (displayName && credential.user) {
    await updateProfile(credential.user, { displayName });
  }
  return credential;
};

export const signInWithEmail = async (
  email: string,
  password: string
): Promise<UserCredential> => {
  return await signInWithEmailAndPassword(auth, email, password);
};

export const signInWithGoogle = async (): Promise<UserCredential> => {
  const provider = new GoogleAuthProvider();
  return await signInWithPopup(auth, provider);
};

export const signInWithApple = async (): Promise<UserCredential> => {
  const provider = new OAuthProvider("apple.com");
  provider.addScope("email");
  provider.addScope("name");
  return await signInWithPopup(auth, provider);
};

export const signOut = async (): Promise<void> => {
  return await firebaseSignOut(auth);
};

/**
 * Map Firebase Auth error codes to friendly, non-technical messages.
 */
export const getFriendlyAuthError = (error: unknown): string => {
  const code =
    typeof error === "object" && error !== null && "code" in error
      ? String((error as { code: unknown }).code)
      : "";

  switch (code) {
    case "auth/email-already-in-use":
      return "An account with this email already exists. Try signing in instead.";
    case "auth/invalid-email":
      return "That email address doesn't look right. Please check it and try again.";
    case "auth/weak-password":
      return "Your password should be at least 6 characters long.";
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "Incorrect email or password. Please try again.";
    case "auth/too-many-requests":
      return "Too many attempts. Please wait a moment and try again.";
    case "auth/popup-closed-by-user":
      return "The sign-in window was closed before finishing. Please try again.";
    case "auth/popup-blocked":
      return "Your browser blocked the sign-in window. Please allow popups and try again.";
    case "auth/account-exists-with-different-credential":
      return "This email is already registered with a different sign-in method. Try that method instead.";
    case "auth/network-request-failed":
      return "Network error. Please check your connection and try again.";
    case "auth/operation-not-allowed":
      return "This sign-in method is not enabled yet. Please use email sign-in.";
    default:
      return "Something went wrong. Please try again.";
  }
};
