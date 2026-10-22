import { Icon } from "../../components/Icon";
import { useApp } from "../../state/AppContext";
import { INPUT_STYLE } from "../../styles/shared";
import { EMPTY_HINT_STYLE, ROUND_BUTTON_STYLE } from "./gameStyles";
import voteBuddy from "../../assets/vote-buddy.png";

export function GroupVote() {
  const { state, patch, addVoteOption, removeVoteOption, castVote, resetVotes } = useApp();
  const { voteOptions, newVoteInput } = state;
  const totalVotes = voteOptions.reduce((sum, option) => sum + option.votes, 0);
  const topVotes = Math.max(0, ...voteOptions.map((voteOption) => voteOption.votes));
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))",
        gap: 32,
        alignItems: "start",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 16,
          maxWidth: 560,
        }}
      >
        <div>
          <h3
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: "var(--text-heading)",
            }}
          >
            Put it to a group vote
          </h3>
          <p
            style={{
              marginTop: 6,
              fontSize: 14,
              lineHeight: "20px",
              color: "var(--text-muted)",
            }}
          >
            Add the places you're choosing between, then everyone taps <strong>Vote</strong> on the
            one they want. Each card fills up with its share of the votes, and whichever is ahead
            gets the <strong>Leading</strong> badge.
          </p>
        </div>
        <div
          style={{
            display: "flex",
            gap: 8,
          }}
        >
          <input
            type="text"
            placeholder="e.g. Mori Kitchen"
            value={newVoteInput}
            onChange={(event) =>
              patch({
                newVoteInput: event.target.value,
              })
            }
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                addVoteOption();
              }
            }}
            style={{
              ...INPUT_STYLE,
              flex: 1,
            }}
          />
          <button onClick={addVoteOption} aria-label="Add vote option" style={ROUND_BUTTON_STYLE}>
            <Icon name="add" size={20} tone="#ffffff" />
          </button>
        </div>
        {voteOptions.length === 0 ? (
          <div
            style={{
              padding: "32px 20px",
              textAlign: "center",
              border: "1px dashed var(--border-default)",
              borderRadius: 16,
              background: "var(--color-neutral-100)",
            }}
          >
            <Icon name="how_to_vote" size={30} tone="disabled" />
            <p
              style={{
                marginTop: 8,
                fontSize: 13,
                color: "var(--text-muted)",
              }}
            >
              Add the restaurants you're deciding between to start the vote.
            </p>
          </div>
        ) : (
          <>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
                padding: "10px 14px",
                borderRadius: 12,
                background: "var(--color-neutral-100)",
              }}
            >
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 13,
                  fontWeight: 600,
                  color: "var(--text-body)",
                }}
              >
                <Icon name="how_to_vote" size={17} tone="muted" />
                {totalVotes === 0
                  ? "No votes yet — tap Vote to cast the first one"
                  : `${totalVotes} ${totalVotes === 1 ? "vote" : "votes"} cast`}
              </span>
              {totalVotes > 0 && (
                <button
                  onClick={resetVotes}
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: "var(--text-muted)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                    fontFamily: "var(--font-family-base)",
                  }}
                >
                  Reset
                </button>
              )}
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              {voteOptions.map((voteOption, index) => {
                const percent =
                  totalVotes > 0 ? Math.round((voteOption.votes / totalVotes) * 100) : 0;
                const leading = topVotes > 0 && voteOption.votes === topVotes;
                return (
                  <div
                    className="eb-vote-row"
                    style={{
                      position: "relative",
                      overflow: "hidden",
                      padding: "12px 14px",
                      borderRadius: 14,
                      background: "var(--color-neutral-0)",
                      border: `1px solid ${leading ? "var(--color-primary-300)" : "var(--border-default)"}`,
                    }}
                    key={`${voteOption.name}-${index}`}
                  >
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        width: `${percent}%`,
                        background: leading
                          ? "var(--color-primary-100)"
                          : "var(--color-primary-50)",
                        transition: "width .35s ease",
                        pointerEvents: "none",
                      }}
                    />
                    <div
                      style={{
                        position: "relative",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 10,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          minWidth: 0,
                        }}
                      >
                        <span
                          style={{
                            flexShrink: 0,
                            width: 26,
                            height: 26,
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 12,
                            fontWeight: 700,
                            background: leading
                              ? "var(--color-primary-500)"
                              : "var(--color-neutral-100)",
                            color: leading ? "var(--text-on-primary)" : "var(--text-muted)",
                          }}
                        >
                          {index + 1}
                        </span>
                        <div
                          style={{
                            minWidth: 0,
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 6,
                            }}
                          >
                            <span
                              style={{
                                fontSize: 14,
                                fontWeight: 600,
                                color: "var(--text-heading)",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {voteOption.name}
                            </span>
                            {leading && totalVotes > 0 && (
                              <span
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 3,
                                  flexShrink: 0,
                                  padding: "2px 8px",
                                  borderRadius: 999,
                                  background: "var(--color-primary-500)",
                                  color: "var(--text-on-primary)",
                                  fontSize: 11,
                                  fontWeight: 600,
                                }}
                              >
                                <Icon name="emoji_events" size={13} tone="inverse" />
                                Leading
                              </span>
                            )}
                          </div>
                          <span
                            style={{
                              fontSize: 12,
                              color: "var(--text-muted)",
                            }}
                          >
                            {voteOption.votes} {voteOption.votes === 1 ? "vote" : "votes"}
                            {totalVotes > 0 && ` · ${percent}%`}
                          </span>
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                          flexShrink: 0,
                        }}
                      >
                        <button
                          onClick={() => castVote(index)}
                          className="eb-vote-btn"
                          style={{
                            padding: "7px 16px",
                            borderRadius: 999,
                            border: "1px solid var(--color-primary-500)",
                            background: "var(--color-neutral-0)",
                            color: "var(--color-primary-500)",
                            fontSize: 13,
                            fontWeight: 600,
                            cursor: "pointer",
                            fontFamily: "var(--font-family-base)",
                          }}
                        >
                          Vote
                        </button>
                        <button
                          onClick={() => removeVoteOption(index)}
                          aria-label={`Remove ${voteOption.name}`}
                          className="eb-remove-btn"
                          style={{
                            width: 30,
                            height: 30,
                            borderRadius: "50%",
                            border: "none",
                            background: "transparent",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                          }}
                        >
                          <Icon name="close" size={17} tone="muted" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            {voteOptions.length < 2 && (
              <span style={EMPTY_HINT_STYLE}>Add at least 2 options for the group to vote on.</span>
            )}
          </>
        )}
      </div>
      <div
        style={{
          position: "relative",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: 300,
        }}
      >
        <div
          style={{
            position: "absolute",
            width: "min(100%, 380px)",
            aspectRatio: "1 / 1",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(242,106,33,.22) 0%, rgba(242,106,33,.08) 45%, rgba(242,106,33,0) 70%)",
            pointerEvents: "none",
          }}
        />
        <img
          src={voteBuddy}
          alt="The Eat Buddy mascot dropping a vote into a ballot box"
          width={680}
          height={566}
          style={{
            position: "relative",
            width: "min(100%, 360px)",
            height: "auto",
            animation: "eb-float 5s ease-in-out infinite",
          }}
        />
      </div>
    </div>
  );
}
