import { Footer } from "../components/Footer";
import { Icon } from "../components/Icon";
import { useIsCompact, useIsMobile } from "../hooks/useMediaQuery";
import { initialsOf } from "../lib/format";
import { useApp } from "../state/AppContext";
import { PRIMARY_BUTTON_STYLE, stackAvatarStyle } from "../styles/shared";
import buddiesMark from "../assets/buddies-mark.png";
import buddiesWave from "../assets/buddies-wave.png";
import fishAmok from "../assets/fish-amok.jpg";
import kuyTeav from "../assets/kuy-teav.jpg";
import logoLockup from "../assets/logo-lockup.png";
import lokLak from "../assets/lok-lak.jpg";
import numBanhChok from "../assets/num-banh-chok.jpg";
import numPang from "../assets/num-pang.jpg";
import pepperCrab from "../assets/pepper-crab.jpg";

const FEATURES = [
  {
    icon: "event",
    title: "Plan a meal in seconds",
    text: "Pick a place, a date and a time, then invite colleagues. Everyone can see who is coming and how many seats are left.",
  },
  {
    icon: "how_to_vote",
    title: "Vote on where to eat",
    text: "Can't agree? Put a few places to a group vote and let the team decide, instead of scrolling through a long chat.",
  },
  {
    icon: "groups",
    title: "Groups for every team",
    text: "Make a group for your department or lunch crew and share its code so colleagues can join in one step.",
  },
  {
    icon: "photo_camera",
    title: "Share food moments",
    text: "Post photos of what you ate, see what your buddies are trying and find your next favourite dish.",
  },
  {
    icon: "casino",
    title: "Games for tough calls",
    text: "Spin the wheel, flip a coin or play Would You Rather when nobody can decide.",
  },
  {
    icon: "military_tech",
    title: "Earn achievements",
    text: "Unlock badges like First Bite, Plan Starter and Food Explorer as you eat together.",
  },
];

const STEPS = [
  {
    title: "Create your account",
    text: "Sign up with your email address and set up your profile.",
  },
  {
    title: "Start or join a group",
    text: "Bring your team together with a simple group code.",
  },
  {
    title: "Plan, vote and eat",
    text: "Make a lunch plan, settle on the place and enjoy the meal together.",
  },
];

const DISHES = [
  {
    name: "Kuy Teav",
    photo: kuyTeav,
  },
  {
    name: "Lok Lak",
    photo: lokLak,
  },
  {
    name: "Fish Amok",
    photo: fishAmok,
  },
  {
    name: "Num Banh Chok",
    photo: numBanhChok,
  },
  {
    name: "Num Pang",
    photo: numPang,
  },
  {
    name: "Pepper Crab",
    photo: pepperCrab,
  },
];

const FAQS = [
  {
    question: "What is Eat Buddy?",
    answer:
      "Eat Buddy is a web app for planning meals with your colleagues. You can create lunch plans, invite people, vote on where to eat, share photos of your food and collect achievements along the way.",
  },
  {
    question: "How do I invite my team?",
    answer:
      "Create a group and share its code. Colleagues who join the group can see its meal plans and join them.",
  },
  {
    question: "Do I need to install anything?",
    answer:
      "No. Eat Buddy runs in your web browser, so it works on your phone, tablet or computer.",
  },
  {
    question: "What if we can't decide where to eat?",
    answer:
      "Start a group vote, or let a game decide for you: spin the wheel, flip a coin or play Would You Rather.",
  },
];

const PREVIEW_PEOPLE = ["Sokha Chan", "Dara Pich", "Meylin Sok", "Vuthy Kim"];

// While true, "Sign in" and "Get started" open the demo instead of the real sign-in.
// Set back to false to bring real accounts back.
const DEMO_ONLY = true;

const SECTION_STYLE = {
  maxWidth: 1180,
  margin: "0 auto",
  padding: "0 24px",
};

const EYEBROW_STYLE = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  padding: "6px 14px",
  borderRadius: 999,
  background: "var(--color-primary-50)",
  color: "var(--color-primary-700)",
  fontSize: 13,
  fontWeight: 600,
};

const CARD_STYLE = {
  background: "var(--color-neutral-0)",
  border: "1px solid var(--border-default)",
  borderRadius: 20,
};

const GHOST_BUTTON_STYLE = {
  ...PRIMARY_BUTTON_STYLE,
  width: "auto",
  padding: "12px 22px",
  background: "var(--color-neutral-0)",
  color: "var(--color-primary-700)",
  border: "1px solid var(--color-primary-300)",
  cursor: "pointer",
};

const CTA_BUTTON_STYLE = {
  ...PRIMARY_BUTTON_STYLE,
  width: "auto",
  padding: "12px 24px",
  cursor: "pointer",
  boxShadow: "0 8px 20px -8px rgba(242, 106, 33, 0.7)",
};

function sectionHeading(isMobile) {
  return {
    fontSize: isMobile ? 28 : 36,
    lineHeight: isMobile ? "36px" : "44px",
    fontWeight: 700,
    color: "var(--text-heading)",
  };
}

function PlanPreviewCard({ style }) {
  return (
    <div
      style={{
        ...CARD_STYLE,
        position: "absolute",
        width: 236,
        padding: 14,
        display: "flex",
        gap: 12,
        alignItems: "center",
        boxShadow: "0 18px 40px -18px rgba(107, 43, 9, 0.45)",
        ...style,
      }}
    >
      <img
        src={kuyTeav}
        alt=""
        style={{
          width: 54,
          height: 54,
          borderRadius: 12,
          objectFit: "cover",
          flexShrink: 0,
        }}
      />
      <div
        style={{
          minWidth: 0,
        }}
      >
        <p
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: "var(--text-heading)",
          }}
        >
          Friday lunch
        </p>
        <p
          style={{
            fontSize: 12,
            color: "var(--text-muted)",
          }}
        >
          Kuy Teav · 12:30
        </p>
        <div
          style={{
            marginTop: 6,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <div
            style={{
              display: "flex",
            }}
          >
            {PREVIEW_PEOPLE.slice(0, 3).map((person, index) => (
              <span style={stackAvatarStyle(index)} key={person}>
                {initialsOf(person)}
              </span>
            ))}
          </div>
          <span
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: "var(--color-primary-700)",
              whiteSpace: "nowrap",
            }}
          >
            4 / 6 joined
          </span>
        </div>
      </div>
    </div>
  );
}

function VotePreviewCard({ style }) {
  const options = [
    {
      label: "Lok Lak",
      pct: 62,
    },
    {
      label: "Fish Amok",
      pct: 38,
    },
  ];
  return (
    <div
      style={{
        ...CARD_STYLE,
        position: "absolute",
        width: 212,
        padding: 14,
        boxShadow: "0 18px 40px -18px rgba(107, 43, 9, 0.45)",
        ...style,
      }}
    >
      <p
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          fontSize: 13,
          fontWeight: 600,
          color: "var(--text-heading)",
        }}
      >
        <Icon name="how_to_vote" size={18} tone="primary" />
        Where should we eat?
      </p>
      <div
        style={{
          marginTop: 10,
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        {options.map((option, index) => (
          <div key={option.label}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 12,
                color: "var(--text-body)",
              }}
            >
              <span>{option.label}</span>
              <span
                style={{
                  fontWeight: 600,
                }}
              >
                {option.pct}%
              </span>
            </div>
            <div
              style={{
                marginTop: 4,
                height: 6,
                borderRadius: 999,
                background: "var(--color-neutral-100)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${option.pct}%`,
                  height: "100%",
                  borderRadius: 999,
                  background: index === 0 ? "var(--color-primary-500)" : "var(--color-primary-300)",
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function HeroArt({ isMobile }) {
  return (
    <div
      style={{
        position: "relative",
        minHeight: isMobile ? 380 : 480,
        borderRadius: 32,
        overflow: "hidden",
        background: "linear-gradient(165deg, #FFFBF7 0%, #FDE2C8 45%, #F7AB73 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <img
        src={buddiesWave}
        alt="Two Eat Buddy mascots waving at each other"
        width={700}
        height={467}
        style={{
          width: isMobile ? "78%" : "74%",
          height: "auto",
          animation: "eb-float 5s ease-in-out infinite",
        }}
      />
      <PlanPreviewCard
        style={{
          top: isMobile ? 16 : 28,
          left: isMobile ? 16 : 24,
          animation: "eb-float-sm 6s ease-in-out infinite",
        }}
      />
      <VotePreviewCard
        style={{
          bottom: isMobile ? 16 : 28,
          right: isMobile ? 16 : 24,
          animation: "eb-float-sm2 7s ease-in-out infinite",
        }}
      />
    </div>
  );
}

export function LandingScreen() {
  const { setAuthMode, startDemo } = useApp();
  const isMobile = useIsMobile();
  const isCompact = useIsCompact();
  const openAuth = (authMode) => {
    if (DEMO_ONLY) {
      startDemo();
      window.scrollTo(0, 0);
      return;
    }
    window.history.pushState(
      {
        ebAuth: authMode,
      },
      "",
    );
    setAuthMode(authMode);
    window.scrollTo(0, 0);
  };
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "#FFFBF7",
      }}
    >
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          background: "rgba(255, 251, 247, 0.92)",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid var(--color-primary-50)",
        }}
      >
        <nav
          aria-label="Main"
          style={{
            ...SECTION_STYLE,
            height: 72,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
          }}
        >
          <a href="/" aria-label="Eat Buddy home">
            <img
              src={logoLockup}
              alt="Eat Buddy"
              width={400}
              height={172}
              style={{
                width: isMobile ? 112 : 132,
                height: "auto",
                display: "block",
              }}
            />
          </a>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: isMobile ? 8 : 28,
            }}
          >
            {!isMobile &&
              [
                ["Features", "#features"],
                ["How it works", "#how-it-works"],
                ["FAQ", "#faq"],
              ].map(([label, href]) => (
                <a
                  href={href}
                  style={{
                    fontSize: 15,
                    fontWeight: 500,
                    color: "var(--text-body)",
                  }}
                  key={href}
                >
                  {label}
                </a>
              ))}
            <button
              type="button"
              onClick={() => openAuth("signin")}
              style={{
                ...GHOST_BUTTON_STYLE,
                padding: isMobile ? "8px 14px" : "10px 20px",
              }}
            >
              Sign in
            </button>
            {!isMobile && (
              <button
                type="button"
                onClick={() => openAuth("signup")}
                style={{
                  ...CTA_BUTTON_STYLE,
                  padding: "10px 20px",
                }}
              >
                Get started
              </button>
            )}
          </div>
        </nav>
      </header>
      <main>
        <section
          style={{
            ...SECTION_STYLE,
            paddingTop: isMobile ? 32 : 64,
            paddingBottom: isMobile ? 56 : 88,
            display: "grid",
            gridTemplateColumns: isCompact ? "1fr" : "1.05fr 1fr",
            gap: isCompact ? 36 : 56,
            alignItems: "center",
          }}
        >
          <div>
            <span style={EYEBROW_STYLE}>
              <Icon name="restaurant" size={16} tone="primary" />
              Team lunch, sorted
            </span>
            <h1
              style={{
                marginTop: 18,
                fontSize: isMobile ? 36 : 54,
                lineHeight: isMobile ? "44px" : "64px",
                fontWeight: 700,
                letterSpacing: "-0.02em",
                color: "var(--text-heading)",
              }}
            >
              Plan lunch with your colleagues,{" "}
              <span
                style={{
                  color: "var(--color-primary-500)",
                }}
              >
                and actually decide where to eat.
              </span>
            </h1>
            <p
              style={{
                marginTop: 18,
                maxWidth: 520,
                fontSize: isMobile ? 16 : 18,
                lineHeight: isMobile ? "26px" : "30px",
                color: "var(--text-body)",
              }}
            >
              Eat Buddy brings your team together around food. Create a meal plan, invite your
              buddies, vote on the restaurant and share the moments, all in one place.
            </p>
            <div
              style={{
                marginTop: 28,
                display: "flex",
                flexWrap: "wrap",
                gap: 12,
              }}
            >
              <button type="button" onClick={() => openAuth("signup")} style={CTA_BUTTON_STYLE}>
                Get started
                <Icon name="arrow_forward" size={20} tone="inverse" />
              </button>
              <button
                type="button"
                onClick={() => {
                  startDemo();
                  window.scrollTo(0, 0);
                }}
                style={GHOST_BUTTON_STYLE}
              >
                <Icon name="play_circle" size={20} tone="var(--color-primary-700)" />
                Try the demo
              </button>
            </div>
            <div
              style={{
                marginTop: 28,
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <div
                style={{
                  display: "flex",
                }}
              >
                {PREVIEW_PEOPLE.map((person, index) => (
                  <span
                    style={{
                      ...stackAvatarStyle(index),
                      width: 34,
                      height: 34,
                      fontSize: 12,
                    }}
                    key={person}
                  >
                    {initialsOf(person)}
                  </span>
                ))}
              </div>
              <span
                style={{
                  fontSize: 14,
                  color: "var(--text-muted)",
                }}
              >
                Bring the whole team to the table.
              </span>
            </div>
          </div>
          <HeroArt isMobile={isMobile} />
        </section>
        <section
          id="features"
          style={{
            background: "var(--color-neutral-0)",
            padding: isMobile ? "56px 0" : "88px 0",
            scrollMarginTop: 72,
          }}
        >
          <div style={SECTION_STYLE}>
            <div
              style={{
                maxWidth: 640,
              }}
            >
              <span style={EYEBROW_STYLE}>Features</span>
              <h2
                style={{
                  ...sectionHeading(isMobile),
                  marginTop: 14,
                }}
              >
                Everything your team needs for lunch
              </h2>
              <p
                style={{
                  marginTop: 12,
                  fontSize: 16,
                  lineHeight: "26px",
                }}
              >
                From the first “where should we go?” to the last bite, Eat Buddy keeps everyone on
                the same plate.
              </p>
            </div>
            <div
              style={{
                marginTop: 40,
                display: "grid",
                gridTemplateColumns: isMobile
                  ? "1fr"
                  : isCompact
                    ? "repeat(2, 1fr)"
                    : "repeat(3, 1fr)",
                gap: 18,
              }}
            >
              {FEATURES.map((feature) => (
                <article
                  style={{
                    ...CARD_STYLE,
                    padding: 24,
                    background: "#FFFBF7",
                    borderColor: "var(--color-primary-50)",
                  }}
                  key={feature.title}
                >
                  <span
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 14,
                      background: "var(--color-primary-100)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Icon name={feature.icon} size={26} tone="var(--color-primary-700)" />
                  </span>
                  <h3
                    style={{
                      marginTop: 16,
                      fontSize: 18,
                      lineHeight: "26px",
                      fontWeight: 600,
                      color: "var(--text-heading)",
                    }}
                  >
                    {feature.title}
                  </h3>
                  <p
                    style={{
                      marginTop: 6,
                      fontSize: 15,
                      lineHeight: "24px",
                    }}
                  >
                    {feature.text}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>
        <section
          id="how-it-works"
          style={{
            ...SECTION_STYLE,
            padding: isMobile ? "56px 24px" : "88px 24px",
            scrollMarginTop: 72,
          }}
        >
          <div
            style={{
              textAlign: "center",
              maxWidth: 640,
              margin: "0 auto",
            }}
          >
            <span style={EYEBROW_STYLE}>How it works</span>
            <h2
              style={{
                ...sectionHeading(isMobile),
                marginTop: 14,
              }}
            >
              Lunch plans in three easy steps
            </h2>
          </div>
          <ol
            style={{
              listStyle: "none",
              margin: "40px 0 0",
              padding: 0,
              display: "grid",
              gridTemplateColumns: isCompact ? "1fr" : "repeat(3, 1fr)",
              gap: 18,
            }}
          >
            {STEPS.map((step, index) => (
              <li
                style={{
                  ...CARD_STYLE,
                  padding: 24,
                  display: "flex",
                  gap: 16,
                  alignItems: "flex-start",
                }}
                key={step.title}
              >
                <span
                  aria-hidden="true"
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    flexShrink: 0,
                    background: "var(--color-primary-500)",
                    color: "var(--text-on-primary)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 17,
                    fontWeight: 700,
                  }}
                >
                  {index + 1}
                </span>
                <div>
                  <h3
                    style={{
                      fontSize: 18,
                      lineHeight: "26px",
                      fontWeight: 600,
                      color: "var(--text-heading)",
                    }}
                  >
                    {step.title}
                  </h3>
                  <p
                    style={{
                      marginTop: 4,
                      fontSize: 15,
                      lineHeight: "24px",
                    }}
                  >
                    {step.text}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>
        <section
          style={{
            background: "var(--color-neutral-0)",
            padding: isMobile ? "56px 0" : "88px 0",
          }}
        >
          <div style={SECTION_STYLE}>
            <div
              style={{
                maxWidth: 640,
              }}
            >
              <span style={EYEBROW_STYLE}>Food moments</span>
              <h2
                style={{
                  ...sectionHeading(isMobile),
                  marginTop: 14,
                }}
              >
                From kuy teav to pepper crab
              </h2>
              <p
                style={{
                  marginTop: 12,
                  fontSize: 16,
                  lineHeight: "26px",
                }}
              >
                See what your colleagues are eating, from Khmer classics to street food, and add
                your own photos to the feed.
              </p>
            </div>
            <ul
              style={{
                listStyle: "none",
                margin: "36px 0 0",
                padding: 0,
                display: "grid",
                gridTemplateColumns: isMobile
                  ? "repeat(2, 1fr)"
                  : isCompact
                    ? "repeat(3, 1fr)"
                    : "repeat(6, 1fr)",
                gap: 14,
              }}
            >
              {DISHES.map((dish) => (
                <li key={dish.name}>
                  <figure
                    style={{
                      margin: 0,
                    }}
                  >
                    <img
                      src={dish.photo}
                      alt={dish.name}
                      width={640}
                      height={428}
                      loading="lazy"
                      style={{
                        width: "100%",
                        height: "auto",
                        aspectRatio: "1",
                        objectFit: "cover",
                        borderRadius: 18,
                        display: "block",
                      }}
                    />
                    <figcaption
                      style={{
                        marginTop: 8,
                        fontSize: 14,
                        fontWeight: 600,
                        color: "var(--text-heading)",
                      }}
                    >
                      {dish.name}
                    </figcaption>
                  </figure>
                </li>
              ))}
            </ul>
          </div>
        </section>
        <section
          id="faq"
          style={{
            ...SECTION_STYLE,
            maxWidth: 820,
            padding: isMobile ? "56px 24px" : "88px 24px",
            scrollMarginTop: 72,
          }}
        >
          <div
            style={{
              textAlign: "center",
            }}
          >
            <span style={EYEBROW_STYLE}>FAQ</span>
            <h2
              style={{
                ...sectionHeading(isMobile),
                marginTop: 14,
              }}
            >
              Questions, answered
            </h2>
          </div>
          <div
            style={{
              marginTop: 32,
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            {FAQS.map((faq) => (
              <details
                style={{
                  ...CARD_STYLE,
                  padding: "18px 22px",
                }}
                key={faq.question}
              >
                <summary
                  style={{
                    cursor: "pointer",
                    fontSize: 16,
                    fontWeight: 600,
                    color: "var(--text-heading)",
                  }}
                >
                  {faq.question}
                </summary>
                <p
                  style={{
                    marginTop: 10,
                    fontSize: 15,
                    lineHeight: "24px",
                  }}
                >
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </section>
        <section
          style={{
            ...SECTION_STYLE,
            paddingBottom: isMobile ? 48 : 72,
          }}
        >
          <div
            style={{
              borderRadius: 32,
              padding: isMobile ? "36px 24px" : "48px 56px",
              background: "linear-gradient(135deg, #F26A21 0%, #D95A15 100%)",
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              alignItems: "center",
              gap: isMobile ? 20 : 36,
              textAlign: isMobile ? "center" : "left",
            }}
          >
            <img
              src={buddiesMark}
              alt=""
              width={600}
              height={600}
              loading="lazy"
              style={{
                width: isMobile ? 120 : 150,
                height: "auto",
                flexShrink: 0,
                borderRadius: "50%",
                background: "#FFFBF7",
              }}
            />
            <div
              style={{
                flex: 1,
              }}
            >
              <h2
                style={{
                  fontSize: isMobile ? 26 : 32,
                  lineHeight: isMobile ? "34px" : "40px",
                  fontWeight: 700,
                  color: "var(--text-on-primary)",
                }}
              >
                Ready for lunch?
              </h2>
              <p
                style={{
                  marginTop: 8,
                  fontSize: 16,
                  lineHeight: "26px",
                  color: "var(--color-primary-50)",
                }}
              >
                Create your account, invite your buddies and plan your next meal together.
              </p>
            </div>
            <button
              type="button"
              onClick={() => openAuth("signup")}
              style={{
                ...GHOST_BUTTON_STYLE,
                border: "none",
                fontWeight: 700,
              }}
            >
              Get started
            </button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
