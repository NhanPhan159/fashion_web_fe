import { create } from "zustand";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { db } from "@/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { FirebaseError } from "firebase/app";

interface User {
  id: string;
  email: string;
  role: string;
}

interface AuthState {
  currentUser: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, role?: string) => Promise<void>;
  logout: () => Promise<void>;
  fetchCurrentUser: () => Promise<void>;
  clearStore: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  currentUser: null,
  isAuthenticated: !!localStorage.getItem("accessToken"),
  loading: false,
  error: null,

  login: async (email, password) => {
    try {
      set({ loading: true, error: null });
      const auth = getAuth();
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      const token = await user.getIdToken();
      localStorage.setItem("accessToken", token);
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        set({
          currentUser: {
            id: user.uid,
            email: user.email!,
            role: userDoc.data().role,
          },
          isAuthenticated: true,
        });
      }
    } catch (error: unknown) {
      const errorMessage =
        (error as FirebaseError).message || "An error occurred during login";
      set({ error: errorMessage });
    } finally {
      set({ loading: false });
    }
  },

  register: async (email, password, role = "user") => {
    try {
      set({ loading: true, error: null });
      const auth = getAuth();
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const token = await user.getIdToken();
      localStorage.setItem("accessToken", token);
      await setDoc(doc(db, "users", user.uid), { email, role });
      set({
        currentUser: { id: user.uid, email, role },
        isAuthenticated: true,
      });
    } catch (error: unknown) {
      const errorMessage =
        (error as FirebaseError).message ||
        "An error occurred during registration";
      set({ error: errorMessage });
    } finally {
      set({ loading: false });
    }
  },

  logout: async () => {
    try {
      set({ loading: true, error: null });
      const auth = getAuth();
      await signOut(auth);
      localStorage.removeItem("accessToken");
      set({ currentUser: null, isAuthenticated: false });
    } catch (error: unknown) {
      const errorMessage =
        (error as FirebaseError).message || "An error occurred during logout";
      set({ error: errorMessage });
    } finally {
      set({ loading: false });
    }
  },

  fetchCurrentUser: async () => {
    try {
      set({ loading: true, error: null });
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          set({
            currentUser: {
              id: user.uid,
              email: user.email!,
              role: userDoc.data().role,
            },
            isAuthenticated: true,
          });
        } else {
          set({ currentUser: null, isAuthenticated: false });
        }
      } else {
        set({ currentUser: null, isAuthenticated: false });
      }
    } catch (error: unknown) {
      const errorMessage =
        (error as FirebaseError).message ||
        "An error occurred while fetching user";
      set({ error: errorMessage });
    } finally {
      set({ loading: false });
    }
  },

  clearStore: () => {
    set({ currentUser: null, isAuthenticated: false, error: null });
  },
}));
