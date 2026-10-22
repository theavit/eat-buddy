import {
  AUTH_PROVIDERS,
  SUPABASE_KEY,
  SUPABASE_URL,
  rememberSession,
  setRememberMe,
  supabase,
} from "./supabase";

function toAppUser(authUser) {
  if (!authUser) {
    return null;
  }
  const meta = authUser.user_metadata || {};
  const fullName = (meta.full_name || meta.name || "").trim();
  const email = authUser.email || meta.email || "";
  const phone = authUser.phone || meta.phone || "";
  const phoneName = phone ? `Buddy ${phone.slice(-4)}` : "";
  const firstName = (
    meta.first_name ||
    fullName.split(" ")[0] ||
    email.split("@")[0] ||
    phoneName ||
    "Friend"
  ).trim();
  const lastName = (meta.last_name || fullName.split(" ").slice(1).join(" ") || "").trim();
  return {
    id: authUser.id,
    email,
    phone,
    firstName,
    lastName,
    name: `${firstName} ${lastName}`.trim(),
    initials:
      `${firstName[0] || ""}${lastName[0] || ""}`.toUpperCase() ||
      firstName.slice(0, 2).toUpperCase(),
    avatar: meta.avatar_url || meta.picture || "",
    dept: meta.dept || "Team member",
    bio: meta.bio || "",
    pronouns: meta.pronouns || "",
    birthday: meta.birthday || "",
    gender: meta.gender || "",
    vibeColor: meta.vibe_color || "",
    hatColor: meta.hat_color || "",
    scarfColor: meta.scarf_color || "",
    notifyInvites: meta.notify_invites !== false,
    notifyDigest: !!meta.notify_digest,
    showOnLeaderboard: meta.show_on_leaderboard !== false,
    provider: authUser.app_metadata?.provider || "email",
  };
}

function authErrorMessage(error) {
  const message = (error?.message || "").toLowerCase();
  if (message.includes("invalid login credentials")) {
    return "Email or password is incorrect.";
  } else if (message.includes("email not confirmed")) {
    return "Please confirm your email first — check your inbox for the link we sent.";
  } else if (
    message.includes("already registered") ||
    message.includes("already been registered")
  ) {
    return "An account with this email already exists. Try signing in.";
  } else if (message.includes("password should be")) {
    return "That password is too short — use at least 8 characters.";
  } else if (message.includes("rate limit") || message.includes("too many")) {
    return "Too many attempts. Please wait a minute and try again.";
  } else if (message.includes("signups not allowed for otp")) {
    return "No account uses that number yet. Switch to Sign up to create one.";
  } else if (
    message.includes("token has expired") ||
    message.includes("invalid token") ||
    message.includes("otp_expired")
  ) {
    return "That code is wrong or has expired. Request a new one.";
  } else if (
    message.includes("sms") ||
    message.includes("unsupported phone provider") ||
    message.includes("error sending confirmation otp")
  ) {
    return "Text-message sign-in is not switched on yet. Please use email instead.";
  } else if (
    message.includes("phone_provider_disabled") ||
    message.includes("phone signups are disabled")
  ) {
    return "Phone sign-in is switched off for this app.";
  } else if (message.includes("invalid phone") || message.includes("phone number")) {
    return "That phone number does not look right. Check the country and number.";
  } else if (message.includes("is not enabled") || message.includes("unsupported provider")) {
    return "That sign-in method is not switched on for this app yet.";
  } else if (message.includes("failed to fetch") || message.includes("network")) {
    return "Can't reach the server. Check your connection and try again.";
  } else {
    return error?.message || "Something went wrong. Please try again.";
  }
}

export async function registerWithEmail({ firstName, lastName, email, password }) {
  rememberSession();
  const { data, error } = await supabase.auth.signUp({
    email: email.trim(),
    password,
    options: {
      data: {
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        full_name: `${firstName.trim()} ${lastName.trim()}`.trim(),
      },
      emailRedirectTo: window.location.origin,
    },
  });
  if (error) {
    return {
      ok: false,
      error: authErrorMessage(error),
    };
  } else if (data.session) {
    return {
      ok: true,
      user: toAppUser(data.user),
    };
  } else {
    return {
      ok: false,
      needsConfirmation: true,
      email: email.trim(),
      error: "",
    };
  }
}

export async function loginWithEmail({ email, password, remember = true }) {
  setRememberMe(remember);
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  });
  if (error) {
    return {
      ok: false,
      error: authErrorMessage(error),
    };
  } else {
    return {
      ok: true,
      user: toAppUser(data.user),
    };
  }
}

export async function loginWithProvider(provider, remember = true) {
  setRememberMe(remember);
  const { error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: window.location.origin,
      queryParams:
        provider === "google"
          ? {
              access_type: "offline",
              prompt: "consent",
            }
          : undefined,
    },
  });
  if (error) {
    return {
      ok: false,
      error: authErrorMessage(error),
    };
  } else {
    return {
      ok: true,
      redirecting: true,
    };
  }
}

export async function sendPasswordReset(email) {
  rememberSession();
  const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
    redirectTo: `${window.location.origin}/?reset=1`,
  });
  if (error) {
    return {
      ok: false,
      error: authErrorMessage(error),
    };
  } else {
    return {
      ok: true,
    };
  }
}

export async function updateProfileData(profile) {
  const first_name = (profile.firstName ?? "").trim();
  const last_name = (profile.lastName ?? "").trim();
  const full_name = `${first_name} ${last_name}`.trim();
  const metadata = {
    first_name,
    last_name,
    full_name,
    dept: (profile.dept ?? "").trim(),
    bio: profile.bio ?? "",
    pronouns: profile.pronouns ?? "",
    birthday: profile.birthday ?? "",
    gender: profile.gender ?? "",
    vibe_color: profile.vibeColor ?? "",
    hat_color: profile.hatColor ?? "",
    scarf_color: profile.scarfColor ?? "",
    notify_invites: !!profile.notifyInvites,
    notify_digest: !!profile.notifyDigest,
    show_on_leaderboard: !!profile.showOnLeaderboard,
  };
  const { data, error } = await supabase.auth.updateUser({
    data: metadata,
  });
  if (error) {
    return {
      ok: false,
      error: authErrorMessage(error),
    };
  } else {
    if (full_name) {
      await supabase
        .from("profiles")
        .update({
          full_name,
          updated_at: new Date().toISOString(),
        })
        .eq("id", data.user.id);
    }
    return {
      ok: true,
      user: toAppUser(data.user),
    };
  }
}

export async function updatePassword(password) {
  const { data, error } = await supabase.auth.updateUser({
    password,
  });
  if (error) {
    return {
      ok: false,
      error: authErrorMessage(error),
    };
  } else {
    return {
      ok: true,
      user: toAppUser(data.user),
    };
  }
}

export async function resendSignupEmail(email) {
  const { error } = await supabase.auth.resend({
    type: "signup",
    email: email.trim(),
    options: {
      emailRedirectTo: window.location.origin,
    },
  });
  if (error) {
    return {
      ok: false,
      error: authErrorMessage(error),
    };
  } else {
    return {
      ok: true,
    };
  }
}

export async function fetchAuthSettings() {
  try {
    const result = await fetch(`${SUPABASE_URL}/auth/v1/settings`, {
      headers: {
        apikey: SUPABASE_KEY,
      },
    });
    if (!result.ok) {
      return null;
    }
    const external = (await result.json()).external || {};
    return {
      providers: AUTH_PROVIDERS.filter((authProvider) => external[authProvider]),
      phone: !!external.phone,
    };
  } catch {
    return null;
  }
}

export async function sendPhoneCode({ phone, firstName, lastName, isSignUp }) {
  const { error } = await supabase.auth.signInWithOtp({
    phone,
    options: {
      shouldCreateUser: !!isSignUp,
      data: isSignUp
        ? {
            first_name: (firstName || "").trim(),
            last_name: (lastName || "").trim(),
            full_name: `${(firstName || "").trim()} ${(lastName || "").trim()}`.trim(),
          }
        : undefined,
    },
  });
  if (error) {
    return {
      ok: false,
      error: authErrorMessage(error),
    };
  } else {
    return {
      ok: true,
    };
  }
}

export async function verifyPhoneCode({ phone, token }) {
  const { data, error } = await supabase.auth.verifyOtp({
    phone,
    token: (token || "").trim(),
    type: "sms",
  });
  if (error) {
    return {
      ok: false,
      error: authErrorMessage(error),
    };
  } else if (data.session) {
    return {
      ok: true,
      user: toAppUser(data.user),
    };
  } else {
    return {
      ok: false,
      error: "That code did not sign you in. Please try again.",
    };
  }
}

export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getSession();
  if (error || !data.session) {
    return null;
  } else {
    return toAppUser(data.session.user);
  }
}

export function onAuthChange(callback) {
  const { data } = supabase.auth.onAuthStateChange((event, session) => {
    callback({
      event,
      user: toAppUser(session?.user),
    });
  });
  return () => data.subscription.unsubscribe();
}

export async function logOut() {
  await supabase.auth.signOut();
}

function readAuthRedirect() {
  if (typeof window === "undefined") {
    return {
      error: "",
      recovery: false,
      present: false,
    };
  }
  const params = new URLSearchParams(window.location.search);
  const hash = window.location.hash.startsWith("#")
    ? window.location.hash.slice(1)
    : window.location.hash;
  const hashParams = new URLSearchParams(hash);
  const errorDescription =
    params.get("error_description") || hashParams.get("error_description") || "";
  return {
    error: errorDescription ? decodeURIComponent(errorDescription.replace(/\+/g, " ")) : "",
    recovery: params.get("reset") === "1" || hashParams.get("type") === "recovery",
    present:
      !!errorDescription ||
      params.has("code") ||
      params.has("reset") ||
      hashParams.has("access_token") ||
      hashParams.has("type"),
  };
}

export const AUTH_REDIRECT = readAuthRedirect();

export function clearAuthRedirect() {
  if (AUTH_REDIRECT.present) {
    window.history.replaceState({}, document.title, window.location.pathname);
  }
}
