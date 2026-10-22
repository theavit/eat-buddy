export const PASSWORD_RULES = [
  {
    key: "length",
    label: "At least 8 characters",
    test: (password) => password.length >= 8,
  },
  {
    key: "upper",
    label: "One uppercase letter",
    test: (password) => /[A-Z]/.test(password),
  },
  {
    key: "number",
    label: "One number",
    test: (password) => /\d/.test(password),
  },
  {
    key: "special",
    label: "One special character",
    test: (password) => /[^A-Za-z0-9]/.test(password),
  },
];

const STRENGTH_LEVELS = [
  {
    label: "Weak",
    color: "var(--color-error-500)",
    bars: 1,
  },
  {
    label: "Fair",
    color: "var(--color-warning-500)",
    bars: 2,
  },
  {
    label: "Strong",
    color: "var(--color-success-500)",
    bars: 3,
  },
];

export function passwordStrength(password) {
  const passed = PASSWORD_RULES.filter((passwordRule) => passwordRule.test(password)).length;
  if (passed <= 1) {
    return STRENGTH_LEVELS[0];
  } else if (passed <= 3) {
    return STRENGTH_LEVELS[1];
  } else {
    return STRENGTH_LEVELS[2];
  }
}

export const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
