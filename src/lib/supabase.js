import { createClient } from "@supabase/supabase-js";

export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

export const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const AUTH_PROVIDERS = (import.meta.env.VITE_AUTH_PROVIDERS || "")
  .split(",")
  .map((provider) => provider.trim().toLowerCase())
  .filter(Boolean);

const REMEMBER_KEY = "eatbuddy.remember";

const readStorage = (storage, key) => {
  try {
    return storage.getItem(key);
  } catch {
    return null;
  }
};

let rememberMe = readStorage(localStorage, REMEMBER_KEY) !== "false";

export function setRememberMe(remember) {
  rememberMe = remember !== false;
  try {
    localStorage.setItem(REMEMBER_KEY, String(rememberMe));
  } catch {}
}

export const rememberSession = () => setRememberMe(true);

const authStorage = {
  getItem: (key) => readStorage(localStorage, key) ?? readStorage(sessionStorage, key),
  setItem: (key, value) => {
    try {
      (rememberMe ? localStorage : sessionStorage).setItem(key, value);
    } catch {}
  },
  removeItem: (key) => {
    try {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    } catch {}
  },
};

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    storage: authStorage,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: "pkce",
  },
});
