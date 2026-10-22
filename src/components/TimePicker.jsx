import { usePopover } from "../hooks/usePopover";
import { DROPDOWN_STYLE, triggerStyle } from "../styles/shared";
import { Icon } from "./Icon";

const twoDigits = (value) => String(value).padStart(2, "0");

const HOURS = Array.from(
  {
    length: 12,
  },
  (_, index) => index + 1,
);

const MINUTES = Array.from(
  {
    length: 60,
  },
  (_, index) => index,
);

function parseTime(value) {
  const [hours, minutes] = (value || "").split(":").map(Number);
  if (Number.isInteger(hours) && Number.isInteger(minutes)) {
    return {
      h: hours,
      m: minutes,
    };
  } else {
    return null;
  }
}

function toTwelveHour(value) {
  const parsed = parseTime(value);
  if (parsed) {
    return {
      h12: parsed.h % 12 === 0 ? 12 : parsed.h % 12,
      minute: parsed.m,
      meridiem: parsed.h >= 12 ? "PM" : "AM",
    };
  } else {
    return {
      h12: null,
      minute: null,
      meridiem: "AM",
    };
  }
}

function formatTime(value) {
  const { h12, minute, meridiem } = toTwelveHour(value);
  if (h12 === null) {
    return "";
  } else {
    return `${h12}:${twoDigits(minute)} ${meridiem}`;
  }
}

function toTwentyFourHour(hour12, period) {
  if (period === "AM") {
    return hour12 % 12;
  } else {
    return (hour12 % 12) + 12;
  }
}

const TIME_COLUMN_STYLE = {
  flex: 1,
  maxHeight: 172,
  overflowY: "auto",
  display: "flex",
  flexDirection: "column",
  gap: 2,
};

const TIME_HEADING_STYLE = {
  flex: 1,
  textAlign: "center",
  fontSize: 11,
  fontWeight: 600,
  color: "var(--text-muted)",
  paddingBottom: 4,
};

function timeOptionStyle(selected) {
  return {
    padding: "7px 0",
    borderRadius: 8,
    border: "none",
    textAlign: "center",
    fontSize: 13,
    fontFamily: "var(--font-family-base)",
    cursor: "pointer",
    flexShrink: 0,
    background: selected ? "var(--color-primary-500)" : "transparent",
    color: selected ? "var(--text-on-primary)" : "var(--text-body)",
    fontWeight: selected ? 600 : 400,
  };
}

function scrollToCenter(element) {
  if (!element || !element.parentElement) {
    return;
  }
  const parentElement = element.parentElement;
  parentElement.scrollTop =
    element.offsetTop - parentElement.clientHeight / 2 + element.clientHeight / 2;
}

export function TimePicker({ value, onChange, invalid, placeholder = "Pick a time" }) {
  const { open, toggle, dropUp, ref } = usePopover(260);
  const { h12, minute, meridiem } = toTwelveHour(value);
  const choose = (nextHour, nextMinute, nextPeriod) => {
    const hour = nextHour ?? h12 ?? 12;
    const minuteValue = nextMinute ?? minute ?? 0;
    onChange(
      `${twoDigits(toTwentyFourHour(hour, nextPeriod ?? meridiem))}:${twoDigits(minuteValue)}`,
    );
  };
  return (
    <div
      ref={ref}
      style={{
        position: "relative",
      }}
    >
      <button
        type="button"
        onClick={toggle}
        aria-haspopup="dialog"
        aria-expanded={open}
        style={triggerStyle(open, invalid)}
      >
        <Icon name="schedule" size={18} tone="secondary" />
        <span
          style={{
            flex: 1,
            minWidth: 0,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            color: value ? "var(--text-body)" : "var(--text-muted)",
          }}
        >
          {formatTime(value) || placeholder}
        </span>
      </button>
      {open && (
        <div
          style={{
            ...DROPDOWN_STYLE,
            width: 220,
            padding: 10,
            ...(dropUp
              ? {
                  bottom: "calc(100% + 6px)",
                }
              : {
                  top: "calc(100% + 6px)",
                }),
          }}
        >
          <div
            style={{
              display: "flex",
              gap: 6,
            }}
          >
            <span style={TIME_HEADING_STYLE}>Hour</span>
            <span style={TIME_HEADING_STYLE}>Min</span>
            <span style={TIME_HEADING_STYLE}>AM/PM</span>
          </div>
          <div
            style={{
              display: "flex",
              gap: 6,
            }}
          >
            <div style={TIME_COLUMN_STYLE}>
              {HOURS.map((hour) => {
                const selected = hour === h12;
                return (
                  <button
                    type="button"
                    ref={selected ? scrollToCenter : undefined}
                    onClick={() => choose(hour, undefined, undefined)}
                    className={selected ? undefined : "eb-cal-day"}
                    style={timeOptionStyle(selected)}
                    key={hour}
                  >
                    {twoDigits(hour)}
                  </button>
                );
              })}
            </div>
            <div style={TIME_COLUMN_STYLE}>
              {MINUTES.map((option) => {
                const selected = option === minute;
                return (
                  <button
                    type="button"
                    ref={selected ? scrollToCenter : undefined}
                    onClick={() => choose(undefined, option, undefined)}
                    className={selected ? undefined : "eb-cal-day"}
                    style={timeOptionStyle(selected)}
                    key={option}
                  >
                    {twoDigits(option)}
                  </button>
                );
              })}
            </div>
            <div
              style={{
                ...TIME_COLUMN_STYLE,
                overflowY: "visible",
              }}
            >
              {["AM", "PM"].map((period) => {
                const selected = value ? period === meridiem : false;
                return (
                  <button
                    type="button"
                    onClick={() => choose(undefined, undefined, period)}
                    className={selected ? undefined : "eb-cal-day"}
                    style={timeOptionStyle(selected)}
                    key={period}
                  >
                    {period}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
