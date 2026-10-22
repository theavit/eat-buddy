import { Icon } from "../../components/Icon";
import { COUNTRIES, countryByCode } from "../../lib/phone";
import { INPUT_STYLE, LABEL_STYLE } from "../../styles/shared";
import { passwordStrength } from "./passwords";

export function IconInput({ icon, invalid, ...rest }) {
  return (
    <div
      style={{
        position: "relative",
      }}
    >
      <span
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: 14,
          display: "flex",
          alignItems: "center",
          pointerEvents: "none",
        }}
      >
        <Icon name={icon} size={18} tone="muted" />
      </span>
      <input
        {...rest}
        style={{
          ...INPUT_STYLE,
          height: 48,
          padding: "0 14px 0 42px",
          borderColor: invalid ? "var(--color-error-500)" : "var(--border-default)",
        }}
      />
    </div>
  );
}

export function AuthField({ label, children }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 6,
      }}
    >
      <label style={LABEL_STYLE}>{label}</label>
      {children}
    </div>
  );
}

export function MethodTabs({ method, onChange }) {
  const methods = [
    {
      key: "email",
      label: "Email",
      icon: "mail",
    },
    {
      key: "phone",
      label: "Phone",
      icon: "smartphone",
    },
  ];
  return (
    <div
      role="tablist"
      aria-label="Sign-in method"
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 4,
        padding: 4,
        borderRadius: 999,
        background: "var(--color-neutral-100)",
      }}
    >
      {methods.map((option) => {
        const active = method === option.key;
        return (
          <button
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(option.key)}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 7,
              height: 38,
              borderRadius: 999,
              border: "none",
              cursor: "pointer",
              fontFamily: "var(--font-family-base)",
              fontSize: 14,
              fontWeight: 600,
              color: active ? "var(--color-primary-600)" : "var(--text-muted)",
              background: active ? "var(--color-neutral-0)" : "transparent",
              boxShadow: active ? "var(--shadow-sm)" : "none",
              transition: "background .18s ease, color .18s ease",
            }}
            key={option.key}
          >
            <Icon name={option.icon} size={17} tone={active ? "primary" : "muted"} />
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

export function PhoneInput({ country, onCountry, number, onNumber, invalid }) {
  return (
    <div
      style={{
        display: "flex",
        gap: 8,
      }}
    >
      <select
        aria-label="Country code"
        value={country.code}
        onChange={(event) => onCountry(countryByCode(event.target.value))}
        style={{
          ...INPUT_STYLE,
          height: 48,
          width: 118,
          flexShrink: 0,
          padding: "0 6px 0 10px",
          cursor: "pointer",
          fontFamily: "var(--font-family-base)",
        }}
      >
        {COUNTRIES.map((option) => (
          <option value={option.code} key={option.code}>
            {option.flag} +{option.dial}
          </option>
        ))}
      </select>
      <input
        type="tel"
        inputMode="tel"
        autoComplete="tel-national"
        placeholder="012 345 678"
        value={number}
        onChange={(event) => onNumber(event.target.value)}
        style={{
          ...INPUT_STYLE,
          height: 48,
          flex: 1,
          padding: "0 14px",
          borderColor: invalid ? "var(--color-error-500)" : "var(--border-default)",
        }}
      />
    </div>
  );
}

export function PasswordStrength({ password, rules }) {
  const strength = passwordStrength(password);
  const filled = password ? strength.bars : 0;
  return (
    <div className="eb-reveal" data-open={!!password} aria-hidden={!password}>
      <div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <div
              style={{
                display: "flex",
                gap: 6,
                flex: 1,
              }}
            >
              {[0, 1, 2].map((bar) => (
                <span
                  style={{
                    flex: 1,
                    height: 4,
                    borderRadius: 999,
                    background: "var(--color-neutral-300)",
                    overflow: "hidden",
                  }}
                  key={bar}
                >
                  <span
                    style={{
                      display: "block",
                      height: "100%",
                      borderRadius: 999,
                      background: strength.color,
                      transformOrigin: "left center",
                      transform: `scaleX(${bar < filled ? 1 : 0})`,
                      transition: `transform .35s cubic-bezier(.34,1.25,.64,1) ${bar * 60}ms, background-color .25s ease`,
                    }}
                  />
                </span>
              ))}
            </div>
            <span
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: strength.color,
                animation: "eb-strength-label .3s cubic-bezier(.34,1.4,.64,1)",
              }}
              key={strength.label}
            >
              {strength.label}
            </span>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
              gap: "6px 14px",
            }}
          >
            {rules.map((rule) => (
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  fontSize: 13,
                  color: rule.ok ? "var(--color-success-text)" : "var(--text-muted)",
                  transition: "color .2s ease",
                }}
                key={rule.key}
              >
                <Icon
                  name={rule.ok ? "check_circle" : "radio_button_unchecked"}
                  size={16}
                  tone={rule.ok ? "success" : "disabled"}
                  style={
                    rule.ok
                      ? {
                          animation: "eb-rule-pop .32s cubic-bezier(.34,1.5,.64,1)",
                        }
                      : undefined
                  }
                  key={rule.ok ? "on" : "off"}
                />
                {rule.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
