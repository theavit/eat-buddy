import { useEffect, useRef, useState } from "react";
import { Checkbox } from "../components/Checkbox";
import { Icon } from "../components/Icon";
import { PasswordInput } from "../components/PasswordInput";
import { DEFAULT_COUNTRY, isValidPhone, toE164 } from "../lib/phone";
import { useApp } from "../state/AppContext";
import { INPUT_STYLE, PRIMARY_BUTTON_STYLE } from "../styles/shared";
import { AuthField, IconInput, MethodTabs, PasswordStrength, PhoneInput } from "./auth/fields";
import { PASSWORD_RULES, isValidEmail } from "./auth/passwords";
import { ENABLED_SOCIAL_PROVIDERS, SOCIAL_PROVIDERS } from "./auth/socialProviders";
import buddiesWave from "../assets/buddies-wave.png";
import logoLockup from "../assets/logo-lockup.png";

const TEXT_BUTTON_STYLE = {
  background: "none",
  border: "none",
  padding: 0,
  fontFamily: "var(--font-family-base)",
  fontSize: 14,
  fontWeight: 600,
  color: "var(--color-primary-500)",
  cursor: "pointer",
};

const noticeStyle = (kind) => ({
  display: "flex",
  alignItems: "flex-start",
  gap: 8,
  padding: "10px 12px",
  borderRadius: 12,
  background: kind === "error" ? "var(--color-error-bg)" : "var(--color-success-bg)",
  border: `1px solid ${kind === "error" ? "var(--color-error-border)" : "var(--color-success-border)"}`,
});

const RESEND_SECONDS = 60;

export function AuthScreen() {
  const {
    state,
    signIn,
    signUp,
    setAuthMode,
    signInWithProvider,
    requestPasswordReset,
    completePasswordReset,
    resendConfirmationEmail,
    requestPhoneCode,
    confirmPhoneCode,
    showToast,
  } = useApp();
  const isSignUp = state.authMode === "signup";
  const isReset = state.authMode === "reset";
  const providers =
    state.enabledProviders === null
      ? ENABLED_SOCIAL_PROVIDERS
      : state.enabledProviders.filter((enabledProvider) => SOCIAL_PROVIDERS[enabledProvider]);
  const [step, setStep] = useState("form");
  const [sentTo, setSentTo] = useState({
    kind: "",
    email: "",
  });
  const [method, setMethod] = useState("email");
  const usePhone = method === "phone" && state.phoneEnabled && !isReset;
  const [country, setCountry] = useState(DEFAULT_COUNTRY);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [code, setCode] = useState("");
  const [sentPhone, setSentPhone] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const codeInputRef = useRef(null);
  useEffect(() => {
    if (cooldown <= 0) {
      return;
    }
    const timer = setTimeout(() => setCooldown((seconds) => seconds - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);
  useEffect(() => {
    if (step === "otp" && codeInputRef.current) {
      codeInputRef.current.focus();
    }
  }, [step]);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirm: "",
    agree: false,
    remember: true,
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState("");
  const updateField = (field) => (value) =>
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  const rules = PASSWORD_RULES.map((passwordRule) => ({
    ...passwordRule,
    ok: passwordRule.test(form.password),
  }));
  const passwordOk = rules.every((rule) => rule.ok);
  const choosingPassword = isSignUp || isReset;
  const errors = {
    firstName: isSignUp && !form.firstName.trim() ? "Enter your first name" : "",
    lastName: isSignUp && !form.lastName.trim() ? "Enter your last name" : "",
    phone: usePhone && !isValidPhone(country, phoneNumber) ? "Enter your phone number" : "",
    email:
      isReset || usePhone
        ? ""
        : form.email.trim()
          ? isValidEmail(form.email)
            ? ""
            : "Enter a valid email address"
          : "Enter your email address",
    password: usePhone
      ? ""
      : form.password
        ? choosingPassword && !passwordOk
          ? "Password is too weak. Please meet all four requirements below."
          : ""
        : "Enter your password",
    confirm:
      !usePhone && choosingPassword && form.confirm !== form.password
        ? "Passwords don't match"
        : "",
    agree: isSignUp && !form.agree ? "Please accept the Terms & Conditions" : "",
  };
  const firstError = Object.values(errors).find(Boolean) || "";
  const handleClick = async () => {
    setSubmitted(true);
    setError("");
    if (!firstError && !busy) {
      setBusy("submit");
      try {
        if (isReset) {
          const result = await completePasswordReset(form.password);
          if (result.ok) {
            return showToast("Password updated — you’re signed in.");
          } else {
            return setError(result.error);
          }
        }
        if (usePhone) {
          return sendCode();
        }
        const outcome = isSignUp
          ? await signUp({
              firstName: form.firstName,
              lastName: form.lastName,
              email: form.email,
              password: form.password,
            })
          : await signIn({
              email: form.email,
              password: form.password,
              remember: form.remember,
            });
        if (outcome.needsConfirmation) {
          setSentTo({
            kind: "confirm",
            email: outcome.email,
          });
          setStep("sent");
          return;
        }
        if (!outcome.ok) {
          return setError(outcome.error);
        }
        showToast(
          isSignUp
            ? `Welcome to Eat Buddy, ${outcome.user.firstName}!`
            : `Welcome back, ${outcome.user.firstName}!`,
        );
      } finally {
        setBusy("");
      }
    }
  };
  const sendCode = async () => {
    const phone = toE164(country, phoneNumber);
    setError("");
    setBusy("sms");
    try {
      const result = await requestPhoneCode({
        phone,
        firstName: form.firstName,
        lastName: form.lastName,
        isSignUp,
      });
      if (!result.ok) {
        return setError(result.error);
      }
      setSentPhone(phone);
      setCode("");
      setCooldown(RESEND_SECONDS);
      setStep("otp");
    } finally {
      setBusy("");
    }
  };
  const verifyCode = async () => {
    if (code.trim().length < 6) {
      return setError("Enter the 6-digit code from the text.");
    }
    setError("");
    setBusy("otp");
    try {
      const result = await confirmPhoneCode({
        phone: sentPhone,
        token: code,
      });
      if (!result.ok) {
        return setError(result.error);
      }
      showToast(`Welcome${isSignUp ? " to Eat Buddy" : " back"}, ${result.user.firstName}!`);
    } finally {
      setBusy("");
    }
  };
  const resendCode = async () => {
    if (!(cooldown > 0)) {
      setError("");
      setBusy("resend");
      try {
        const result = await requestPhoneCode({
          phone: sentPhone,
          firstName: form.firstName,
          lastName: form.lastName,
          isSignUp,
        });
        if (!result.ok) {
          return setError(result.error);
        }
        setCooldown(RESEND_SECONDS);
        showToast("New code sent.");
      } finally {
        setBusy("");
      }
    }
  };
  const continueWith = async (provider) => {
    setError("");
    setBusy(provider);
    const result = await signInWithProvider(provider, form.remember);
    if (!result.ok) {
      setError(result.error);
      setBusy("");
    }
  };
  const sendResetLink = async () => {
    setSubmitted(true);
    setError("");
    if (isValidEmail(form.email)) {
      setBusy("reset");
      try {
        const result = await requestPasswordReset(form.email);
        if (!result.ok) {
          return setError(result.error);
        }
        setSentTo({
          kind: "reset",
          email: form.email.trim(),
        });
        setStep("sent");
      } finally {
        setBusy("");
      }
    }
  };
  const resendEmail = async () => {
    setBusy("resend");
    try {
      const outcome =
        sentTo.kind === "reset"
          ? await requestPasswordReset(sentTo.email)
          : await resendConfirmationEmail(sentTo.email);
      showToast(outcome.ok ? "Sent — check your inbox again." : outcome.error);
    } finally {
      setBusy("");
    }
  };
  const switchMode = (mode) => {
    setAuthMode(mode);
    setStep("form");
    setSubmitted(false);
    setError("");
    setForm((current) => ({
      ...current,
      password: "",
      confirm: "",
      agree: false,
    }));
  };
  const fieldError = (field) => (submitted ? errors[field] : "");
  const notice = error || state.authNotice;
  const title = isReset
    ? "Set a new password"
    : step === "otp"
      ? "Enter your code"
      : step === "forgot"
        ? "Reset your password"
        : step === "sent"
          ? "Check your email"
          : isSignUp
            ? "Create an account"
            : "Welcome Back";
  const subtitle = isReset
    ? "Choose a password you haven’t used here before"
    : step === "otp"
      ? `We texted a 6-digit code to ${sentPhone}`
      : step === "forgot"
        ? "We’ll email you a link to set a new one"
        : step === "sent"
          ? ""
          : isSignUp
            ? "Join your team and start planning lunch"
            : "Sign in to your account";
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 460px), 1fr))",
        fontFamily: "var(--font-family-base)",
        background: "var(--color-neutral-0)",
      }}
    >
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 22,
          padding: 48,
          minHeight: 320,
          overflow: "hidden",
          background: "linear-gradient(165deg, #FFFBF7 0%, #FDE2C8 45%, #F7AB73 100%)",
        }}
      >
        <img
          src={buddiesWave}
          alt=""
          style={{
            width: "min(340px, 70%)",
            height: "auto",
            objectFit: "contain",
          }}
        />
        <div
          style={{
            textAlign: "center",
            maxWidth: 380,
          }}
        >
          <h2
            style={{
              fontSize: 26,
              fontWeight: 700,
              color: "var(--color-primary-900)",
            }}
          >
            Lunch is better together.
          </h2>
          <p
            style={{
              marginTop: 8,
              fontSize: 15,
              lineHeight: "22px",
              color: "var(--color-primary-700)",
            }}
          >
            Plan meals with your team, discover new places, and never argue about where to eat
            again.
          </p>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "40px 24px 56px",
          overflowY: "auto",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 420,
          }}
        >
          <button
            type="button"
            aria-label="Back to the Eat Buddy home page"
            onClick={() =>
              window.history.state?.ebAuth ? window.history.back() : setAuthMode("landing")
            }
            style={{
              display: "block",
              padding: 0,
              border: "none",
              background: "none",
              cursor: "pointer",
            }}
          >
            <img
              src={logoLockup}
              alt="Eat Buddy"
              style={{
                width: 150,
                height: "auto",
                objectFit: "contain",
                display: "block",
              }}
            />
          </button>
          <h1
            style={{
              marginTop: 40,
              fontSize: 32,
              fontWeight: 700,
              color: "var(--text-heading)",
            }}
          >
            {title}
          </h1>
          {subtitle && (
            <p
              style={{
                marginTop: 6,
                fontSize: 15,
                color: "var(--text-muted)",
              }}
            >
              {subtitle}
            </p>
          )}
          {step === "otp" ? (
            <div
              style={{
                marginTop: 24,
                display: "flex",
                flexDirection: "column",
                gap: 14,
              }}
            >
              <AuthField label="6-digit code">
                <input
                  ref={codeInputRef}
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  placeholder="••••••"
                  value={code}
                  onChange={(event) => setCode(event.target.value.replace(/\D/g, ""))}
                  onKeyDown={(event) => event.key === "Enter" && verifyCode()}
                  style={{
                    ...INPUT_STYLE,
                    height: 56,
                    padding: "0 16px",
                    fontSize: 26,
                    fontWeight: 700,
                    letterSpacing: "0.45em",
                    textAlign: "center",
                  }}
                />
              </AuthField>
              {notice && (
                <div style={noticeStyle("error")} role="alert">
                  <Icon name="error" size={17} tone="error" />
                  <span
                    style={{
                      fontSize: 13,
                      color: "var(--color-error-text)",
                    }}
                  >
                    {notice}
                  </span>
                </div>
              )}
              <button
                onClick={verifyCode}
                disabled={!!busy || code.length < 6}
                style={{
                  ...PRIMARY_BUTTON_STYLE,
                  marginTop: 4,
                  border: "none",
                  cursor: busy ? "progress" : "pointer",
                  opacity: busy || code.length < 6 ? 0.7 : 1,
                }}
              >
                {busy === "otp" ? "Checking…" : "Verify and continue"}
              </button>
              <button
                type="button"
                onClick={resendCode}
                disabled={cooldown > 0 || !!busy}
                style={{
                  ...TEXT_BUTTON_STYLE,
                  textAlign: "center",
                  color: cooldown > 0 ? "var(--text-muted)" : "var(--color-primary-500)",
                  cursor: cooldown > 0 ? "default" : "pointer",
                }}
              >
                {cooldown > 0 ? `Resend code in ${cooldown}s` : "Send a new code"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setStep("form");
                  setCode("");
                  setError("");
                }}
                style={{
                  ...TEXT_BUTTON_STYLE,
                  textAlign: "center",
                  color: "var(--text-muted)",
                }}
              >
                Use a different number
              </button>
            </div>
          ) : step === "sent" ? (
            <div
              style={{
                marginTop: 24,
                display: "flex",
                flexDirection: "column",
                gap: 16,
              }}
            >
              <div style={noticeStyle("success")}>
                <Icon name="mark_email_read" size={18} tone="success" />
                <span
                  style={{
                    fontSize: 13,
                    color: "var(--color-success-text)",
                    lineHeight: "19px",
                  }}
                >
                  {sentTo.kind === "reset"
                    ? "If an account exists for "
                    : "We sent a confirmation link to "}
                  <strong>{sentTo.email}</strong>
                  {sentTo.kind === "reset"
                    ? ", a reset link is on its way. The link expires in an hour."
                    : ". Click it to activate your account, then sign in."}
                </span>
              </div>
              <p
                style={{
                  fontSize: 13,
                  color: "var(--text-muted)",
                  lineHeight: "19px",
                }}
              >
                Nothing after a minute or two? It’s worth checking the spam folder — confirmation
                mail from a new app often lands there.
              </p>
              <button
                type="button"
                onClick={resendEmail}
                disabled={!!busy}
                style={{
                  ...PRIMARY_BUTTON_STYLE,
                  border: "none",
                  cursor: busy ? "progress" : "pointer",
                }}
              >
                {busy === "resend" ? "Sending…" : "Send it again"}
              </button>
              <button
                type="button"
                onClick={() => switchMode("signin")}
                style={{
                  ...TEXT_BUTTON_STYLE,
                  textAlign: "center",
                }}
              >
                Back to sign in
              </button>
            </div>
          ) : step === "forgot" ? (
            <div
              style={{
                marginTop: 24,
                display: "flex",
                flexDirection: "column",
                gap: 14,
              }}
            >
              <AuthField label="Email address">
                <IconInput
                  icon="mail"
                  type="email"
                  autoComplete="email"
                  placeholder="name@company.com"
                  value={form.email}
                  onChange={(event) => updateField("email")(event.target.value)}
                  invalid={submitted && !isValidEmail(form.email)}
                />
              </AuthField>
              {notice && (
                <div style={noticeStyle("error")} role="alert">
                  <Icon name="error" size={17} tone="error" />
                  <span
                    style={{
                      fontSize: 13,
                      color: "var(--color-error-text)",
                    }}
                  >
                    {notice}
                  </span>
                </div>
              )}
              <button
                onClick={sendResetLink}
                disabled={!!busy}
                style={{
                  ...PRIMARY_BUTTON_STYLE,
                  marginTop: 4,
                  border: "none",
                  cursor: busy ? "progress" : "pointer",
                  opacity: busy ? 0.7 : 1,
                }}
              >
                {busy === "reset" ? "Sending…" : "Email me a reset link"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setStep("form");
                  setSubmitted(false);
                  setError("");
                }}
                style={{
                  ...TEXT_BUTTON_STYLE,
                  textAlign: "center",
                }}
              >
                Back to sign in
              </button>
            </div>
          ) : (
            <div
              style={{
                marginTop: 24,
                display: "flex",
                flexDirection: "column",
                gap: 14,
              }}
            >
              {state.phoneEnabled && !isReset && (
                <MethodTabs
                  method={method}
                  onChange={(nextMethod) => {
                    setMethod(nextMethod);
                    setSubmitted(false);
                    setError("");
                  }}
                />
              )}
              {isSignUp && (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 12,
                  }}
                >
                  <AuthField label="First name">
                    <IconInput
                      icon="person"
                      type="text"
                      placeholder="Sok"
                      value={form.firstName}
                      onChange={(event) => updateField("firstName")(event.target.value)}
                      invalid={!!fieldError("firstName")}
                    />
                  </AuthField>
                  <AuthField label="Last name">
                    <IconInput
                      icon="person"
                      type="text"
                      placeholder="Mean"
                      value={form.lastName}
                      onChange={(event) => updateField("lastName")(event.target.value)}
                      invalid={!!fieldError("lastName")}
                    />
                  </AuthField>
                </div>
              )}
              {usePhone ? (
                <AuthField label="Phone number">
                  <PhoneInput
                    country={country}
                    onCountry={setCountry}
                    number={phoneNumber}
                    onNumber={setPhoneNumber}
                    invalid={!!fieldError("phone")}
                  />
                </AuthField>
              ) : (
                <>
                  {!isReset && (
                    <AuthField label="Email address">
                      <IconInput
                        icon="mail"
                        type="email"
                        autoComplete="email"
                        placeholder="name@company.com"
                        value={form.email}
                        onChange={(event) => updateField("email")(event.target.value)}
                        invalid={!!fieldError("email")}
                      />
                    </AuthField>
                  )}
                  <AuthField label={isReset ? "New password" : "Password"}>
                    <PasswordInput
                      value={form.password}
                      onChange={updateField("password")}
                      placeholder={isReset ? "Choose a new password" : "Enter your password"}
                      autoComplete={choosingPassword ? "new-password" : "current-password"}
                      invalid={!!fieldError("password")}
                    />
                  </AuthField>
                  {choosingPassword && <PasswordStrength password={form.password} rules={rules} />}
                  {choosingPassword && (
                    <AuthField label="Confirm password">
                      <PasswordInput
                        value={form.confirm}
                        onChange={updateField("confirm")}
                        placeholder="Confirm your password"
                        autoComplete="new-password"
                        invalid={!!fieldError("confirm")}
                      />
                    </AuthField>
                  )}
                </>
              )}
              {isSignUp && (
                <Checkbox
                  checked={form.agree}
                  onChange={updateField("agree")}
                  label={
                    <span
                      style={{
                        fontSize: 14,
                      }}
                    >
                      I agree to the{" "}
                      <span
                        style={{
                          color: "var(--color-primary-500)",
                          fontWeight: 600,
                        }}
                      >
                        Terms & Conditions
                      </span>
                    </span>
                  }
                />
              )}
              {!isSignUp && !isReset && !usePhone && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 12,
                  }}
                >
                  <Checkbox
                    checked={form.remember}
                    onChange={updateField("remember")}
                    label={
                      <span
                        style={{
                          fontSize: 14,
                        }}
                      >
                        Remember me
                      </span>
                    }
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setStep("forgot");
                      setSubmitted(false);
                      setError("");
                    }}
                    style={TEXT_BUTTON_STYLE}
                  >
                    Forgot password?
                  </button>
                </div>
              )}
              {notice && (
                <div style={noticeStyle("error")} role="alert">
                  <Icon name="error" size={17} tone="error" />
                  <span
                    style={{
                      fontSize: 13,
                      color: "var(--color-error-text)",
                    }}
                  >
                    {notice}
                  </span>
                </div>
              )}
              {submitted && firstError && !notice && (
                <div style={noticeStyle("error")}>
                  <Icon name="error" size={17} tone="error" />
                  <span
                    style={{
                      fontSize: 13,
                      color: "var(--color-error-text)",
                    }}
                  >
                    {firstError}
                  </span>
                </div>
              )}
              <button
                onClick={handleClick}
                disabled={!!busy}
                style={{
                  ...PRIMARY_BUTTON_STYLE,
                  marginTop: 4,
                  border: "none",
                  cursor: busy ? "progress" : "pointer",
                  opacity: busy ? 0.7 : 1,
                }}
              >
                {busy === "sms"
                  ? "Texting your code…"
                  : busy === "submit"
                    ? isReset
                      ? "Saving…"
                      : isSignUp
                        ? "Creating account…"
                        : "Signing in…"
                    : usePhone
                      ? "Text me a code"
                      : isReset
                        ? "Save new password"
                        : isSignUp
                          ? "Create Account"
                          : "Sign In"}
              </button>
              {!isReset && providers.length > 0 && (
                <>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      margin: "2px 0",
                    }}
                  >
                    <span
                      style={{
                        flex: 1,
                        height: 1,
                        background: "var(--border-default)",
                      }}
                    />
                    <span
                      style={{
                        fontSize: 13,
                        color: "var(--text-muted)",
                      }}
                    >
                      or
                    </span>
                    <span
                      style={{
                        flex: 1,
                        height: 1,
                        background: "var(--border-default)",
                      }}
                    />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 10,
                    }}
                  >
                    {providers.map((provider) => {
                      const { label, Mark } = SOCIAL_PROVIDERS[provider];
                      return (
                        <button
                          type="button"
                          onClick={() => continueWith(provider)}
                          disabled={!!busy}
                          className="eb-menu-item"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 10,
                            width: "100%",
                            height: 48,
                            borderRadius: 999,
                            border: "1px solid var(--border-default)",
                            background: "var(--color-neutral-0)",
                            cursor: busy ? "progress" : "pointer",
                            fontFamily: "var(--font-family-base)",
                            fontSize: 15,
                            fontWeight: 500,
                            color: "var(--text-heading)",
                          }}
                          key={provider}
                        >
                          <Mark />
                          {busy === provider ? `Opening ${label}…` : `Continue with ${label}`}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
              {!isReset && (
                <p
                  style={{
                    marginTop: 10,
                    textAlign: "center",
                    fontSize: 14,
                    color: "var(--text-muted)",
                  }}
                >
                  {isSignUp ? "Already have an account? " : "New to Eat Buddy? "}
                  <button
                    type="button"
                    onClick={() => switchMode(isSignUp ? "signin" : "signup")}
                    style={TEXT_BUTTON_STYLE}
                  >
                    {isSignUp ? "Sign in" : "Sign up"}
                  </button>
                </p>
              )}
            </div>
          )}
          {false}
        </div>
      </div>
    </div>
  );
}
