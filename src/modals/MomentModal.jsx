import { Icon } from "../components/Icon";
import { Modal } from "../components/Modal";
import { MOMENTS, MOMENT_COMMENTS } from "../data/moments";
import { PHOTO_CREDITS } from "../data/photoCredits";
import { useIsMobile } from "../hooks/useMediaQuery";
import { initialsOf } from "../lib/format";
import { useApp } from "../state/AppContext";
import { CARD_GRADIENTS, RATING_TAG_STYLES } from "../styles/shared";

const COMMENT_COLORS = ["var(--color-primary-500)", "#8FA36A", "#C97A44", "#6FA8E8"];

function commentAvatarStyle(idx, size = 36) {
  return {
    width: size,
    height: size,
    borderRadius: "50%",
    background: COMMENT_COLORS[idx % COMMENT_COLORS.length],
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: size >= 40 ? 14 : 13,
    fontWeight: 700,
    flexShrink: 0,
  };
}

const YOU_AVATAR_STYLE = {
  width: 30,
  height: 30,
  borderRadius: "50%",
  background: "var(--color-neutral-100)",
  color: "var(--text-heading)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 11,
  fontWeight: 700,
  flexShrink: 0,
};

export function MomentModal() {
  const { state, closeModal } = useApp();
  const user = state.user;
  const isMobile = useIsMobile();
  const idx = state.modal.idx;
  const moment = MOMENTS[idx];
  if (!moment) {
    return null;
  }
  const override = (state.photoOverrides || {})[idx];
  const credit = override ? null : PHOTO_CREDITS[moment.photo];
  return (
    <Modal
      maxWidth={920}
      panelStyle={{
        borderRadius: 20,
        overflow: "hidden",
        display: "grid",
        gridTemplateColumns: isMobile ? "minmax(0,1fr)" : "1.1fr 1fr",
        gridTemplateRows: isMobile ? "auto 1fr" : undefined,
      }}
    >
      <div
        style={{
          position: "relative",
          minHeight: isMobile ? 220 : "100%",
          background: CARD_GRADIENTS[idx % CARD_GRADIENTS.length],
          ...(override || moment.photo
            ? {
                backgroundImage: `url("${override || moment.photo}")`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }
            : null),
        }}
      >
        {credit && (
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              padding: "18px 14px 10px",
              fontSize: 11,
              lineHeight: "15px",
              color: "rgba(255,255,255,.92)",
              background: "linear-gradient(to top, rgba(0,0,0,.62), transparent)",
            }}
          >
            Photo:{" "}
            <a
              href={credit.source}
              target="_blank"
              rel="noreferrer noopener"
              style={{
                color: "#fff",
                textDecoration: "underline",
              }}
            >
              {credit.by}
            </a>{" "}
            · {credit.license}
          </div>
        )}
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          maxHeight: "88vh",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "16px 20px",
            borderBottom: "1px solid var(--border-default)",
          }}
        >
          <span style={commentAvatarStyle(idx, 40)}>{initialsOf(moment.user)}</span>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
            }}
          >
            <span
              style={{
                fontSize: 15,
                fontWeight: 600,
                color: "var(--text-heading)",
              }}
            >
              {moment.user}
            </span>
            <span
              style={{
                fontSize: 12,
                color: "var(--text-muted)",
              }}
            >
              {moment.time}
            </span>
          </div>
          <button
            onClick={closeModal}
            aria-label="Close"
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              border: "1px solid var(--border-default)",
              background: "none",
              cursor: "pointer",
              flexShrink: 0,
            }}
          >
            ✕
          </button>
        </div>
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "16px 20px",
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 8,
            }}
          >
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: 15,
                fontWeight: 600,
                color: "var(--text-heading)",
              }}
            >
              <Icon name="location_on" size={18} tone="primary" />
              {moment.restaurant}
            </span>
            <span style={RATING_TAG_STYLES[moment.tag]}>{moment.tag}</span>
          </div>
          <p
            style={{
              margin: 0,
              fontSize: 14,
              color: "var(--text-body)",
            }}
          >
            {moment.caption}
          </p>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 20,
              padding: "10px 0",
              borderTop: "1px solid var(--border-default)",
              borderBottom: "1px solid var(--border-default)",
            }}
          >
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: 14,
                color: "var(--color-primary-500)",
                fontWeight: 600,
              }}
            >
              <Icon name="favorite" size={18} tone="primary" />
              {moment.likes} likes
            </span>
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: 14,
                color: "var(--text-muted)",
              }}
            >
              <Icon name="chat_bubble" size={18} tone="muted" />
              {moment.comments} comments
            </span>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 14,
            }}
          >
            {MOMENT_COMMENTS.map((momentComment) => (
              <div
                style={{
                  display: "flex",
                  gap: 10,
                }}
                key={momentComment.name}
              >
                <span style={YOU_AVATAR_STYLE}>{initialsOf(momentComment.name)}</span>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                  }}
                >
                  <span
                    style={{
                      fontSize: 13,
                      color: "var(--text-heading)",
                    }}
                  >
                    <strong>{momentComment.name}</strong> {momentComment.text}
                  </span>
                  <span
                    style={{
                      fontSize: 11,
                      color: "var(--text-muted)",
                    }}
                  >
                    {momentComment.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "14px 20px",
            borderTop: "1px solid var(--border-default)",
          }}
        >
          <span
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: "var(--color-primary-500)",
              color: "#fff",
              fontSize: 12,
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            {user.initials}
          </span>
          <input
            placeholder="Add a comment..."
            style={{
              flex: 1,
              border: "1px solid var(--border-default)",
              borderRadius: 999,
              padding: "9px 16px",
              fontFamily: "var(--font-family-base)",
              fontSize: 13,
              outline: "none",
            }}
          />
        </div>
      </div>
    </Modal>
  );
}
