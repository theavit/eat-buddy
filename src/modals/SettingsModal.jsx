import { useState } from "react";
import { Button } from "../components/Button";
import { Select, TextArea, TextInput } from "../components/Field";
import { Icon } from "../components/Icon";
import { Modal, ModalHeader } from "../components/Modal";
import { Toggle } from "../components/Toggle";
import {
  DEFAULT_BIO,
  GENDERS,
  HAT_COLORS,
  PRONOUNS,
  SCARF_COLORS,
  VIBE_COLORS,
} from "../data/profile";
import { useApp } from "../state/AppContext";

const SECTION_STYLE = {
  margin: 0,
  fontSize: 16,
  fontWeight: 600,
  color: "var(--text-heading)",
};

const SWATCH_LABEL_STYLE = {
  fontSize: 14,
  fontWeight: 500,
  color: "var(--text-heading)",
};

function swatchStyle(color, selected, size) {
  return {
    width: size,
    height: size,
    borderRadius: "50%",
    cursor: "pointer",
    background: color,
    border: selected ? "3px solid var(--color-neutral-0)" : "3px solid transparent",
    ...(selected
      ? {
          boxShadow: `0 0 0 2px ${color}`,
        }
      : null),
  };
}

function ColorSwatches({ label, colors, selected, onSelect, size = 36 }) {
  return (
    <div>
      <span style={SWATCH_LABEL_STYLE}>{label}</span>
      <div
        style={{
          display: "flex",
          gap: 10,
          flexWrap: "wrap",
          marginTop: 8,
        }}
      >
        {colors.map((color) => (
          <button
            aria-label={color}
            onClick={() => onSelect(color)}
            style={swatchStyle(color, selected === color, size)}
            key={color}
          />
        ))}
      </div>
    </div>
  );
}

function SettingToggle({ title, desc, checked, onChange }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <span
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: "var(--text-heading)",
          }}
        >
          {title}
        </span>
        <span
          style={{
            fontSize: 12,
            color: "var(--text-muted)",
          }}
        >
          {desc}
        </span>
      </div>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  );
}

export function SettingsModal() {
  const { state, patch, closeModal, saveProfile, showToast } = useApp();
  const user = state.user;
  const bio = state.bioText ?? DEFAULT_BIO;
  const [form, setForm] = useState({
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    dept: user.dept || "",
    pronouns: user.pronouns || "",
    birthday: user.birthday || "",
    notifyInvites: user.notifyInvites !== false,
    notifyDigest: !!user.notifyDigest,
    showOnLeaderboard: user.showOnLeaderboard !== false,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const updateField = (field) => (value) =>
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  const handleClick = async () => {
    if (!saving) {
      setSaving(true);
      setError("");
      try {
        const result = await saveProfile({
          ...form,
          bio,
          gender: state.gender,
          vibeColor: state.vibeColor,
          hatColor: state.hatColor,
          scarfColor: state.scarfColor,
        });
        if (!result.ok) {
          return setError(result.error);
        }
        showToast("Profile saved.");
        closeModal();
      } finally {
        setSaving(false);
      }
    }
  };
  return (
    <Modal maxWidth={640}>
      <div
        style={{
          padding: 28,
          display: "flex",
          flexDirection: "column",
          gap: 18,
        }}
      >
        <ModalHeader title="Edit profile" />
        <h3 style={SECTION_STYLE}>Avatar</h3>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 6,
          }}
        >
          <div
            style={{
              width: 90,
              height: 90,
              position: "relative",
            }}
          >
            <span
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "50%",
                background: state.vibeColor,
                color: "#fff",
                fontSize: 28,
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "3px solid var(--color-neutral-0)",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              {user.initials}
            </span>
            <span
              style={{
                position: "absolute",
                top: -10,
                left: "50%",
                transform: "translateX(-50%)",
                width: 44,
                height: 22,
                borderRadius: "22px 22px 0 0",
                background: state.hatColor,
                border: "2px solid #1A1410",
              }}
            />
            <span
              style={{
                position: "absolute",
                bottom: 2,
                left: "50%",
                transform: "translateX(-50%)",
                width: 60,
                height: 14,
                borderRadius: 8,
                background: state.scarfColor,
                border: "2px solid #1A1410",
              }}
            />
          </div>
        </div>
        <ColorSwatches
          label="Avatar color"
          colors={VIBE_COLORS}
          selected={state.vibeColor}
          onSelect={(vibeColor) =>
            patch({
              vibeColor,
            })
          }
          size={44}
        />
        <ColorSwatches
          label="Hat color"
          colors={HAT_COLORS}
          selected={state.hatColor}
          onSelect={(hatColor) =>
            patch({
              hatColor,
            })
          }
        />
        <ColorSwatches
          label="Scarf color"
          colors={SCARF_COLORS}
          selected={state.scarfColor}
          onSelect={(scarfColor) =>
            patch({
              scarfColor,
            })
          }
        />
        <h3 style={SECTION_STYLE}>Personal information</h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 14,
          }}
        >
          <TextInput
            label="Display name"
            value={form.firstName}
            onChange={(event) => updateField("firstName")(event.target.value)}
          />
          <TextInput label="Email" value={user.email || ""} readOnly={true} disabled={true} />
        </div>
        <div>
          <span style={SWATCH_LABEL_STYLE}>Gender</span>
          <div
            style={{
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
              marginTop: 8,
            }}
          >
            {GENDERS.map((gender) => {
              const active = state.gender === gender.key;
              return (
                <button
                  onClick={() =>
                    patch({
                      gender: gender.key,
                    })
                  }
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "11px 18px",
                    borderRadius: 999,
                    cursor: "pointer",
                    fontFamily: "var(--font-family-base)",
                    fontSize: 14,
                    fontWeight: 500,
                    color: "var(--text-heading)",
                    ...(active
                      ? {
                          background: "var(--color-primary-50)",
                          border: "2px solid var(--color-primary-500)",
                        }
                      : {
                          background: "var(--color-neutral-0)",
                          border: "1px solid var(--border-default)",
                        }),
                  }}
                  key={gender.key}
                >
                  <Icon name={gender.icon} size={18} tone={active ? "primary" : "muted"} />
                  {gender.key}
                </button>
              );
            })}
          </div>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 14,
          }}
        >
          <Select
            label="Pronouns (optional)"
            options={PRONOUNS}
            value={form.pronouns}
            onChange={(event) => updateField("pronouns")(event.target.value)}
          />
          <TextInput
            label="Birthday (optional)"
            type="date"
            value={form.birthday}
            onChange={(event) => updateField("birthday")(event.target.value)}
          />
        </div>
        <div>
          <TextArea
            label="Bio (optional)"
            value={bio}
            maxLength={160}
            onChange={(event) =>
              patch({
                bioText: event.target.value,
              })
            }
          />
          <div
            style={{
              textAlign: "right",
              fontSize: 12,
              color: "var(--text-muted)",
              marginTop: 4,
            }}
          >
            {bio.length} / 160
          </div>
        </div>
        <TextInput
          label="Department"
          value={form.dept}
          onChange={(event) => updateField("dept")(event.target.value)}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
            borderTop: "1px solid var(--border-default)",
            paddingTop: 16,
          }}
        >
          <SettingToggle
            title="Lunch invitations"
            desc="Notify me when someone invites me."
            checked={form.notifyInvites}
            onChange={updateField("notifyInvites")}
          />
          <SettingToggle
            title="Weekly digest"
            desc="A Monday summary of open tables."
            checked={form.notifyDigest}
            onChange={updateField("notifyDigest")}
          />
          <SettingToggle
            title="Show me on the leaderboard"
            desc="Your points stay private if off."
            checked={form.showOnLeaderboard}
            onChange={updateField("showOnLeaderboard")}
          />
        </div>
        {error && (
          <div
            role="alert"
            style={{
              padding: "10px 12px",
              borderRadius: 12,
              background: "var(--color-error-bg)",
              border: "1px solid var(--color-error-border)",
              fontSize: 13,
              color: "var(--color-error-text)",
            }}
          >
            {error}
          </div>
        )}
        <div
          style={{
            display: "flex",
            gap: 10,
          }}
        >
          <Button variant="primary" onClick={handleClick} disabled={saving}>
            {saving ? "Saving…" : "Save changes"}
          </Button>
          <Button variant="outline" onClick={closeModal} disabled={saving}>
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
}
