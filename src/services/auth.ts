import { supabase } from "@/utils/supabase";
import { User, Provider } from "@supabase/supabase-js";

export interface AuthResponse {
  user: User | null;
  error: Error | null;
}

export const authService = {
  signUp: async (
    email: string,
    password: string,
    options?: { data?: any }
  ): Promise<AuthResponse> => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options,
    });
    return { user: data.user, error: error ? new Error(error.message) : null };
  },

  signInWithPassword: async (
    email: string,
    password: string
  ): Promise<AuthResponse> => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { user: data.user, error: error ? new Error(error.message) : null };
  },

  signInWithGoogle: async (): Promise<AuthResponse> => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google" as Provider,
      options: {
        redirectTo: window.location.origin + "/admin",
      },
    });

    return { user: null, error: error ? new Error(error.message) : null };
  },

  signInWithMicrosoft: async (): Promise<AuthResponse> => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "azure" as Provider,
      options: {
        redirectTo: window.location.origin + "/admin",
        scopes: "email profile openid",
      },
    });

    return { user: null, error: error ? new Error(error.message) : null };
  },

  signOut: async (): Promise<void> => {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message);
  },

  getSession: async (): Promise<User | null> => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    return session?.user ?? null;
  },
};
