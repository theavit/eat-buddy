import { useEffect } from "react";
import { BOTTOM_NAV_HEIGHT, BottomNav } from "./components/BottomNav";
import { Footer } from "./components/Footer";
import { GroupManagePanel } from "./components/GroupManagePanel";
import { ProgressRail } from "./components/ProgressRail";
import { Sidebar } from "./components/Sidebar";
import { Toast } from "./components/Toast";
import { useIsCompact, useIsMobile } from "./hooks/useMediaQuery";
import { ModalRoot } from "./modals/ModalRoot";
import { AchievementsScreen } from "./screens/AchievementsScreen";
import { AuthScreen } from "./screens/AuthScreen";
import { GamesScreen } from "./screens/GamesScreen";
import { GroupsScreen } from "./screens/GroupsScreen";
import { HomeScreen } from "./screens/HomeScreen";
import { LandingScreen } from "./screens/LandingScreen";
import { MealPlansScreen } from "./screens/MealPlansScreen";
import { MomentsScreen } from "./screens/MomentsScreen";
import { ProfileScreen } from "./screens/ProfileScreen";
import { useApp } from "./state/AppContext";
import logoLockup from "./assets/logo-lockup.png";

const SCREENS = {
  home: HomeScreen,
  discover: MomentsScreen,
  mealplans: MealPlansScreen,
  games: GamesScreen,
  groups: GroupsScreen,
  profile: ProfileScreen,
  achievements: AchievementsScreen,
};

const FULL_WIDTH_TABS = new Set(["mealplans", "games"]);

export function App() {
  const { state, goHome, setAuthMode } = useApp();
  const isMobile = useIsMobile();
  const isCompact = useIsCompact();
  // The landing page pushes a history entry before showing sign-in, so Back returns to it.
  useEffect(() => {
    const handlePopState = (event) => {
      if (!state.authed) {
        setAuthMode(event.state?.ebAuth || "landing");
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [state.authed, setAuthMode]);
  if (!state.authReady) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#FFFBF7",
        }}
      >
        <img
          src={logoLockup}
          alt="Eat Buddy"
          style={{
            width: 170,
            height: "auto",
            objectFit: "contain",
            animation: "eb-splash 1.4s ease-in-out infinite",
          }}
        />
      </div>
    );
  }
  if (!state.authed && state.authMode === "landing") {
    return <LandingScreen />;
  }
  if (!state.authed) {
    return (
      <>
        <AuthScreen />
        <Toast />
      </>
    );
  }
  const Screen = SCREENS[state.tab] || HomeScreen;
  const groupsList = state.tab === "groups" && !state.selectedGroupId;
  const groupDetail = state.tab === "groups" && !!state.selectedGroupId;
  const singleColumn = FULL_WIDTH_TABS.has(state.tab) || groupsList || isCompact;
  const showProgress =
    !FULL_WIDTH_TABS.has(state.tab) &&
    !groupsList &&
    state.tab !== "profile" &&
    state.tab !== "groups";
  const sidePanel = (groupDetail || showProgress) && (
    <aside
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 20,
        ...(isCompact
          ? null
          : {
              position: "sticky",
              top: 24,
              alignSelf: "start",
            }),
      }}
    >
      {groupDetail && <GroupManagePanel />}
      {showProgress && <ProgressRail />}
    </aside>
  );
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#FFFBF7",
        fontFamily: "var(--font-family-base)",
        color: "var(--text-body)",
        display: "flex",
      }}
    >
      {!isMobile && <Sidebar />}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
        }}
      >
        {isMobile && (
          <header
            style={{
              position: "sticky",
              top: 0,
              zIndex: 30,
              display: "flex",
              alignItems: "center",
              height: 56,
              padding: "0 16px",
              background: "var(--color-neutral-0)",
              borderBottom: "1px solid var(--border-default)",
            }}
          >
            <button
              type="button"
              onClick={goHome}
              aria-label="Eat Buddy home"
              style={{
                background: "none",
                border: "none",
                padding: 0,
                cursor: "pointer",
                display: "flex",
              }}
            >
              <img
                src={logoLockup}
                alt="Eat Buddy"
                style={{
                  height: 30,
                  width: "auto",
                  objectFit: "contain",
                  display: "block",
                }}
              />
            </button>
          </header>
        )}
        <div
          style={{
            maxWidth: 1400,
            margin: "0 auto",
            padding: isMobile ? "16px 16px 0" : "24px 28px 0",
            display: "grid",
            gridTemplateColumns: singleColumn ? "minmax(0,1fr)" : "minmax(0,1fr) 360px",
            gap: isMobile ? 16 : 24,
            alignItems: "start",
            width: "100%",
            boxSizing: "border-box",
            flex: 1,
          }}
        >
          <main
            className="eb-page"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 20,
              minWidth: 0,
            }}
            key={state.tab}
          >
            <Screen />
          </main>
          {sidePanel}
        </div>
        <Footer />
        {isMobile && (
          <div
            style={{
              height: BOTTOM_NAV_HEIGHT,
            }}
            aria-hidden="true"
          />
        )}
      </div>
      {isMobile && <BottomNav />}
      <ModalRoot />
      <Toast />
    </div>
  );
}
