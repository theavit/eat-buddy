import { Button } from "../components/Button";
import { Icon } from "../components/Icon";
import { LunchCard } from "../components/LunchCard";
import { useIsMobile } from "../hooks/useMediaQuery";
import { toLunchView } from "../lib/viewModels";
import { useApp } from "../state/AppContext";
import buddiesMark from "../assets/buddies-mark.png";
import buddiesWave from "../assets/buddies-wave.png";

export function HomeScreen() {
  const { state, go, openCreateLunch, openCreateGroup } = useApp();
  const isMobile = useIsMobile();
  const todayLunches = state.lunches
    .map((lunch, index) => toLunchView(lunch, index, state.groups))
    .filter((lunch) => lunch.today)
    .slice(0, 3);
  return (
    <section
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 20,
      }}
    >
      <div
        style={{
          position: "relative",
          overflow: "hidden",
          background: "linear-gradient(120deg,#FDE9D4,#FCD9B4 55%,#FBCB99)",
          borderRadius: 24,
          padding: isMobile ? "22px 18px" : "28px 32px",
          display: "flex",
          alignItems: "center",
          minHeight: isMobile ? 250 : 300,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 170,
            height: 170,
            backgroundImage: "radial-gradient(#F26A21 1.5px,transparent 1.5px)",
            backgroundSize: "14px 14px",
            opacity: 0.16,
            maskImage: "radial-gradient(circle at 20% 20%,#000 0%,transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: -60,
            bottom: -90,
            width: 420,
            height: 420,
            borderRadius: "50%",
            background: "#F9C48A",
            opacity: 0.55,
          }}
        />
        <div
          style={{
            position: "absolute",
            right: -40,
            bottom: -140,
            width: 520,
            height: 340,
            borderRadius: "48% 52% 40% 60%/60% 40% 60% 40%",
            background: "#F5A45C",
            opacity: 0.9,
            animation: "eb-drift 9s ease-in-out infinite",
          }}
        />
        <span
          style={{
            position: "absolute",
            top: "6%",
            right: "10%",
            color: "#F26A21",
            fontSize: 20,
            animation: "eb-twinkle 2.6s ease-in-out infinite",
          }}
        >
          ✦
        </span>
        <span
          style={{
            position: "absolute",
            top: "14%",
            right: "34%",
            color: "#fff",
            fontSize: 14,
            animation: "eb-twinkle 2.2s ease-in-out infinite .5s",
          }}
        >
          ✦
        </span>
        <div
          style={{
            position: "relative",
            zIndex: 3,
            maxWidth: isMobile ? 205 : 230,
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: "clamp(17px,2.2vw,22px)",
              lineHeight: 1.2,
              fontWeight: 700,
              color: "var(--color-neutral-900)",
              letterSpacing: "-0.5px",
              textWrap: "balance",
            }}
          >
            Good food brings
            <br />
            <span
              style={{
                color: "var(--color-primary-500)",
              }}
            >
              people together
            </span>
          </h1>
          <p
            style={{
              margin: "8px 0 16px",
              fontSize: 12,
              lineHeight: 1.5,
              color: "var(--color-neutral-700)",
              textWrap: "pretty",
            }}
          >
            Discover great food, plan meals with colleagues, vote on where to eat, and collect fun
            achievements.
          </p>
          <div
            style={{
              display: "flex",
              gap: 8,
              flexWrap: "wrap",
            }}
          >
            <Button
              variant="primary"
              size="sm"
              onClick={() => openCreateLunch()}
              iconLeft={<Icon name="restaurant" size={18} tone="#ffffff" />}
            >
              Plan a Meal
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => go("groups")}
              style={{
                background: "#fff",
              }}
            >
              Find Buddies
            </Button>
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            zIndex: 1,
            right: 8,
            bottom: 0,
            width: isMobile ? 120 : 170,
            height: isMobile ? 140 : 220,
            overflow: "visible",
          }}
        >
          <img
            src={buddiesMark}
            alt="Eat Buddy mascot"
            style={{
              height: isMobile ? 140 : 220,
              width: isMobile ? 140 : 220,
              objectFit: "contain",
              position: "absolute",
              right: 0,
              bottom: 0,
              animation: "eb-float 5s ease-in-out infinite",
            }}
          />
        </div>
      </div>
      <div
        style={{
          background: "var(--color-neutral-0)",
          border: "1px solid var(--border-default)",
          borderRadius: 20,
          padding: 24,
          boxShadow: "var(--shadow-xs)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 18,
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: 20,
              fontWeight: 600,
              color: "var(--text-heading)",
            }}
          >
            Happening Today
          </h2>
          <a
            href="#groups"
            onClick={(event) => {
              event.preventDefault();
              go("groups");
            }}
            style={{
              fontSize: "var(--type-body-sm-size)",
              fontWeight: 500,
            }}
          >
            View all
          </a>
        </div>
        <div
          className="eb-stagger"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
            gap: 16,
          }}
        >
          {todayLunches.map((lunch) => (
            <LunchCard lunch={lunch} variant="today" key={lunch.id} />
          ))}
        </div>
      </div>
      <div
        style={{
          background: "linear-gradient(100deg,#FDEBD8,#FCDCBB)",
          borderRadius: 20,
          padding: "20px 28px",
          display: "flex",
          alignItems: "center",
          gap: 20,
          flexWrap: "wrap",
        }}
      >
        <img
          src={buddiesWave}
          alt=""
          style={{
            height: 120,
            objectFit: "contain",
          }}
        />
        <div
          style={{
            flex: 1,
            minWidth: 220,
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: 18,
              fontWeight: 600,
              color: "var(--text-heading)",
            }}
          >
            Good food. Great people. Stronger teams.
          </p>
          <p
            style={{
              margin: "4px 0 0",
              fontSize: 15,
              color: "var(--color-neutral-700)",
            }}
          >
            Let's make every lunch an opportunity to connect.
          </p>
        </div>
        <Button variant="primary" onClick={openCreateGroup}>
          Create Group
        </Button>
      </div>
    </section>
  );
}
