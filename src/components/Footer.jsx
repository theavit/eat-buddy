import { useState } from "react";
import { PHOTO_CREDITS } from "../data/photoCredits";

const FOOTER_LINKS = ["About", "Help Center", "Privacy", "Terms"];

const CREDITS_TOGGLE_STYLE = {
  color: "var(--color-primary-600)",
  fontSize: 14,
  background: "none",
  border: "none",
  padding: 0,
  cursor: "pointer",
  fontFamily: "var(--font-family-base)",
};

function PhotoCredits() {
  const credits = Object.values(PHOTO_CREDITS);
  return (
    <div
      style={{
        marginTop: 16,
        padding: "14px 16px",
        borderRadius: 12,
        background: "var(--color-neutral-50, #faf7f4)",
        border: "1px solid var(--border-default)",
      }}
    >
      <p
        style={{
          fontSize: 13,
          color: "var(--text-muted)",
          marginBottom: 8,
        }}
      >
        Sample photography from Wikimedia Commons, reused under the licences below.
      </p>
      <ul
        style={{
          listStyle: "none",
          margin: 0,
          padding: 0,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
          gap: "4px 18px",
        }}
      >
        {credits.map((credit) => (
          <li
            style={{
              fontSize: 12,
              color: "var(--text-muted)",
            }}
            key={credit.source}
          >
            <a
              href={credit.source}
              target="_blank"
              rel="noreferrer noopener"
              style={{
                color: "var(--color-primary-600)",
              }}
            >
              {credit.by}
            </a>{" "}
            · {credit.license}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  const [showCredits, setShowCredits] = useState(false);
  return (
    <footer
      style={{
        maxWidth: 1400,
        margin: "28px auto 0",
        padding: "0 28px 28px",
        width: "100%",
        boxSizing: "border-box",
        marginTop: "auto",
      }}
    >
      <div
        style={{
          borderTop: "1px solid var(--border-default)",
          paddingTop: 20,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 20,
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 28,
            flexWrap: "wrap",
          }}
        >
          {FOOTER_LINKS.map((footerLink) => (
            <a
              href={`#${footerLink.toLowerCase().replace(/\s+/g, "-")}`}
              onClick={(event) => event.preventDefault()}
              style={{
                color: "var(--color-primary-600)",
                fontSize: 14,
              }}
              key={footerLink}
            >
              {footerLink}
            </a>
          ))}
          <button
            type="button"
            onClick={() => setShowCredits((shown) => !shown)}
            aria-expanded={showCredits}
            style={CREDITS_TOGGLE_STYLE}
          >
            Photo credits
          </button>
        </div>
        <span
          style={{
            color: "var(--text-muted)",
            fontSize: 13,
          }}
        >
          © 2026 Eat Buddy. All rights reserved.
        </span>
      </div>
      {showCredits && <PhotoCredits />}
    </footer>
  );
}
