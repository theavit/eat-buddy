import { Icon } from "../components/Icon";
import { GAME_TABS } from "../data/games";
import { useApp } from "../state/AppContext";
import { CoinFlip } from "./games/CoinFlip";
import { GroupVote } from "./games/GroupVote";
import { SpinWheel } from "./games/SpinWheel";
import { WouldYouRather } from "./games/WouldYouRather";

function GameTab({ game, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "10px 16px",
        borderRadius: 999,
        fontSize: 14,
        fontWeight: 500,
        fontFamily: "var(--font-family-base)",
        cursor: "pointer",
        ...(active
          ? {
              background: "var(--color-primary-50)",
              color: "var(--color-primary-500)",
              border: "1px solid var(--color-primary-500)",
            }
          : {
              background: "var(--color-neutral-0)",
              color: "var(--text-body)",
              border: "1px solid var(--border-default)",
            }),
      }}
    >
      <Icon name={game.icon} size={18} tone={active ? "primary" : "secondary"} />
      {game.label}
    </button>
  );
}

const GAMES = {
  wheel: SpinWheel,
  yesno: CoinFlip,
  vote: GroupVote,
  wyr: WouldYouRather,
};

export function GamesScreen() {
  const { state, setActiveGame, toggleSound } = useApp();
  const ActiveGame = GAMES[state.activeGame] || SpinWheel;
  return (
    <section
      style={{
        background: "var(--color-neutral-0)",
        border: "1px solid var(--border-default)",
        borderRadius: 20,
        padding: 24,
        display: "flex",
        flexDirection: "column",
        gap: 20,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: 26,
              fontWeight: 600,
              color: "var(--text-heading)",
            }}
          >
            Games
          </h1>
          <p
            style={{
              margin: "4px 0 0",
              fontSize: 15,
              color: "var(--text-muted)",
            }}
          >
            Can't decide where to eat? Play a quick game with your group.
          </p>
        </div>
        <button
          onClick={toggleSound}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "8px 14px",
            borderRadius: 999,
            border: "1px solid var(--border-default)",
            background: "var(--color-neutral-0)",
            color: "var(--text-body)",
            fontSize: 13,
            fontWeight: 500,
            cursor: "pointer",
            fontFamily: "var(--font-family-base)",
          }}
        >
          <Icon name={state.soundOn ? "volume_up" : "volume_off"} size={18} tone="secondary" />
          {state.soundOn ? "Sound on" : "Sound off"}
        </button>
      </div>
      <div
        style={{
          display: "flex",
          gap: 10,
          flexWrap: "wrap",
        }}
      >
        {GAME_TABS.map((gameTab) => (
          <GameTab
            game={gameTab}
            active={state.activeGame === gameTab.key}
            onClick={() => setActiveGame(gameTab.key)}
            key={gameTab.key}
          />
        ))}
      </div>
      <ActiveGame />
    </section>
  );
}
