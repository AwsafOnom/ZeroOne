import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  GoogleAuthProvider,
  OAuthProvider,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  updateProfile,
  type User,
} from "firebase/auth";
import { firebaseConfigurationAvailable, getFirebaseAuth } from "../auth/firebase";

export type AuthStatus = "loading" | "ready" | "empty" | "error";

export interface AuthUser {
  id: string;
  displayName: string;
  email?: string;
  avatarUrl?: string;
}

export interface AuthContextValue {
  status: AuthStatus;
  user: AuthUser | null;
  token?: string;
  unreadNotifications: number;
  errorMessage?: string;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signInDemo: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithApple: () => Promise<void>;
  signOut: () => Promise<void>;
}

const emptyAuthValue: AuthContextValue = {
  status: "loading",
  user: null,
  unreadNotifications: 0,
  signIn: async () => undefined,
  signUp: async () => undefined,
  signInDemo: async () => undefined,
  signInWithGoogle: async () => undefined,
  signInWithApple: async () => undefined,
  signOut: async () => undefined,
};

const AuthContext = createContext<AuthContextValue>(emptyAuthValue);

export interface AuthProviderProps {
  children: ReactNode;
  value?: AuthContextValue;
}

function mapFirebaseUser(firebaseUser: User): AuthUser {
  return {
    id: firebaseUser.uid,
    displayName: firebaseUser.displayName ?? firebaseUser.email?.split("@")[0] ?? "ZeroOne member",
    email: firebaseUser.email ?? undefined,
    avatarUrl: firebaseUser.photoURL ?? undefined,
  };
}

export function AuthProvider({ children, value }: AuthProviderProps) {
  const auth = useMemo(() => getFirebaseAuth(), []);
  const [status, setStatus] = useState<AuthStatus>(auth ? "loading" : "error");
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string>();
  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    firebaseConfigurationAvailable() ? undefined : "Firebase authentication is not configured.",
  );

  useEffect(() => {
    if (!auth) {
      return undefined;
    }

    return onAuthStateChanged(auth, (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setToken(undefined);
        setStatus("ready");
        return;
      }

      void firebaseUser
        .getIdToken()
        .then((idToken) => {
          setUser(mapFirebaseUser(firebaseUser));
          setToken(idToken);
          setErrorMessage(undefined);
          setStatus("ready");
        })
        .catch((error: unknown) => {
          setStatus("error");
          setErrorMessage(error instanceof Error ? error.message : "Unable to load your session.");
        });
    });
  }, [auth]);

  const runAuthAction = useCallback(
    async (action: () => Promise<User>) => {
      if (!auth) {
        throw new Error("Firebase authentication is not configured.");
      }
      setErrorMessage(undefined);
      const credentialUser = await action();
      setUser(mapFirebaseUser(credentialUser));
      setToken(await credentialUser.getIdToken());
      setStatus("ready");
    },
    [auth],
  );

  const signIn = useCallback(
    (email: string, password: string) =>
      runAuthAction(() => signInWithEmailAndPassword(auth!, email, password).then(({ user: nextUser }) => nextUser)),
    [auth, runAuthAction],
  );
  const signUp = useCallback(
    (email: string, password: string, displayName: string) =>
      runAuthAction(
        async () => {
          const credential = await createUserWithEmailAndPassword(auth!, email, password);
          await updateProfile(credential.user, { displayName });
          await credential.user.getIdToken(true);
          return credential.user;
        },
      ),
    [auth, runAuthAction],
  );
  const signInDemo = useCallback(
    () => {
      const email = import.meta.env.VITE_DEMO_EMAIL as string | undefined;
      const password = import.meta.env.VITE_DEMO_PASSWORD as string | undefined;
      if (!email || !password) {
        return Promise.reject(new Error("Demo access is not configured."));
      }
      return runAuthAction(() =>
        signInWithEmailAndPassword(auth!, email, password).then(({ user: nextUser }) => nextUser),
      );
    },
    [auth, runAuthAction],
  );
  const signInWithGoogle = useCallback(
    () => runAuthAction(() => signInWithPopup(auth!, new GoogleAuthProvider()).then(({ user: nextUser }) => nextUser)),
    [auth, runAuthAction],
  );
  const signInWithApple = useCallback(
    () =>
      runAuthAction(() =>
        signInWithPopup(auth!, new OAuthProvider("apple.com")).then(({ user: nextUser }) => nextUser),
      ),
    [auth, runAuthAction],
  );
  const signOut = useCallback(async () => {
    if (auth) {
      await firebaseSignOut(auth);
    }
    setUser(null);
    setToken(undefined);
  }, [auth]);

  const authValue = useMemo<AuthContextValue>(
    () =>
      value ?? {
        status,
        user,
        token,
        unreadNotifications: 0,
        errorMessage,
        signIn,
        signInDemo,
        signUp,
        signInWithGoogle,
        signInWithApple,
        signOut,
      },
    [
      errorMessage,
      signIn,
      signInWithApple,
      signInWithGoogle,
      signInDemo,
      signOut,
      signUp,
      status,
      token,
      user,
      value,
    ],
  );

  return <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  return useContext(AuthContext);
}
