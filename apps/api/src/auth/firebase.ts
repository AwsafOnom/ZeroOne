import "dotenv/config";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth, type DecodedIdToken } from "firebase-admin/auth";

function getFirebaseAuth() {
  const existingApp = getApps()[0];
  if (existingApp) {
    return getAuth(existingApp);
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  const app = projectId && clientEmail && privateKey
    ? initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      })
    : initializeApp();

  return getAuth(app);
}

export function verifyFirebaseIdToken(idToken: string): Promise<DecodedIdToken> {
  return getFirebaseAuth().verifyIdToken(idToken);
}

export async function getFirebaseUidByEmail(email: string): Promise<string | null> {
  try {
    const record = await getFirebaseAuth().getUserByEmail(email);
    return record.uid;
  } catch {
    return null;
  }
}
