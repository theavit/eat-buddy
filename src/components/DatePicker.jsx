import { useState } from "react";
import { usePopover } from "../hooks/usePopover";
import { DROPDOWN_STYLE, triggerStyle } from "../styles/shared";
import { Icon } from "./Icon";

const WEEKDAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const pad2 = (value) => String(value).padStart(2, "0");

const toISODate = (year, month, day) => `${year}-${pad2(month + 1)}-${pad2(day)}`;

function parseISODate(value) {
  const [year, month, day] = (value || "").split("-").map(Number);
  if (year && month && day) {
    return {
      y: year,
      m: month - 1,
      d: day,
    };
  } else {
    return null;
  }
}

function formatISODate(value) {
  const parsed = parseISODate(value);
  if (parsed) {
    return `${parsed.d} ${MONTHS[parsed.m].slice(0, 3)} ${parsed.y}`;
  } else {
    return "";
  }
}

const CALENDAR_NAV_STYLE = {
  width: 30,
  height: 30,
  borderRadius: 8,
  border: "none",
  background: "transparent",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

export function DatePicker({ value, onChange, min, invalid, placeholder = "Pick a date" }) {
  const { open, setOpen, toggle, dropUp, ref } = usePopover(360);
  const now = new Date();
  const today = toISODate(now.getFullYear(), now.getMonth(), now.getDate());
  const [view, setView] = useState(() => {
    const parsed = parseISODate(value);
    if (parsed) {
      return {
        y: parsed.y,
        m: parsed.m,
      };
    } else {
      return {
        y: now.getFullYear(),
        m: now.getMonth(),
      };
    }
  });
  const handleClick = () => {
    if (!open) {
      const parsed = parseISODate(value);
      setView(
        parsed
          ? {
              y: parsed.y,
              m: parsed.m,
            }
          : {
              y: now.getFullYear(),
              m: now.getMonth(),
            },
      );
    }
    toggle();
  };
  const shiftMonth = (delta) => {
    const target = new Date(view.y, view.m + delta, 1);
    setView({
      y: target.getFullYear(),
      m: target.getMonth(),
    });
  };
  const daysInMonth = new Date(view.y, view.m + 1, 0).getDate();
  const leadingBlanks = (new Date(view.y, view.m, 1).getDay() + 6) % 7;
  const selectDate = (date) => {
    onChange(date);
    setOpen(false);
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
        onClick={handleClick}
        aria-haspopup="dialog"
        aria-expanded={open}
        style={triggerStyle(open, invalid)}
      >
        <Icon name="calendar_today" size={18} tone="secondary" />
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
          {formatISODate(value) || placeholder}
        </span>
      </button>
      {open && (
        <div
          style={{
            ...DROPDOWN_STYLE,
            width: 280,
            padding: 12,
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
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 8,
            }}
          >
            <button
              type="button"
              onClick={() => shiftMonth(-1)}
              aria-label="Previous month"
              className="eb-cal-nav"
              style={CALENDAR_NAV_STYLE}
            >
              <Icon name="chevron_left" size={20} tone="secondary" />
            </button>
            <span
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: "var(--text-heading)",
              }}
            >
              {MONTHS[view.m]} {view.y}
            </span>
            <button
              type="button"
              onClick={() => shiftMonth(1)}
              aria-label="Next month"
              className="eb-cal-nav"
              style={CALENDAR_NAV_STYLE}
            >
              <Icon name="chevron_right" size={20} tone="secondary" />
            </button>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(7, 1fr)",
              gap: 2,
              marginBottom: 4,
            }}
          >
            {WEEKDAYS.map((weekday) => (
              <span
                style={{
                  textAlign: "center",
                  fontSize: 11,
                  fontWeight: 600,
                  color: "var(--text-muted)",
                  padding: "4px 0",
                }}
                key={weekday}
              >
                {weekday}
              </span>
            ))}
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(7, 1fr)",
              gap: 2,
            }}
          >
            {Array.from(
              {
                length: leadingBlanks,
              },
              (blank, index) => (
                <span key={`lead-${index}`} />
              ),
            )}
            {Array.from(
              {
                length: daysInMonth,
              },
              (slot, index) => {
                const dayNumber = index + 1;
                const iso = toISODate(view.y, view.m, dayNumber);
                const isSelected = iso === value;
                const isToday = iso === today;
                const isDisabled = min ? iso < min : false;
                return (
                  <button
                    type="button"
                    disabled={isDisabled}
                    onClick={() => selectDate(iso)}
                    className={isDisabled || isSelected ? undefined : "eb-cal-day"}
                    style={{
                      height: 34,
                      borderRadius: 9,
                      fontSize: 13,
                      fontFamily: "var(--font-family-base)",
                      cursor: isDisabled ? "not-allowed" : "pointer",
                      border:
                        isToday && !isSelected
                          ? "1px solid var(--color-primary-500)"
                          : "1px solid transparent",
                      background: isSelected ? "var(--color-primary-500)" : "transparent",
                      fontWeight: isSelected || isToday ? 600 : 400,
                      color: isDisabled
                        ? "var(--color-neutral-300)"
                        : isSelected
                          ? "var(--text-on-primary)"
                          : isToday
                            ? "var(--color-primary-500)"
                            : "var(--text-body)",
                    }}
                    key={iso}
                  >
                    {dayNumber}
                  </button>
                );
              },
            )}
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 8,
              marginTop: 10,
              paddingTop: 10,
              borderTop: "1px solid var(--border-default)",
            }}
          >
            <button
              type="button"
              onClick={() => {
                onChange("");
                setOpen(false);
              }}
              style={{
                background: "none",
                border: "none",
                padding: 0,
                fontSize: 13,
                fontWeight: 600,
                color: "var(--text-muted)",
                cursor: "pointer",
                fontFamily: "var(--font-family-base)",
              }}
            >
              Clear
            </button>
            <button
              type="button"
              onClick={() => selectDate(today)}
              style={{
                background: "none",
                border: "none",
                padding: 0,
                fontSize: 13,
                fontWeight: 600,
                color: "var(--color-primary-500)",
                cursor: "pointer",
                fontFamily: "var(--font-family-base)",
              }}
            >
              Today
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
