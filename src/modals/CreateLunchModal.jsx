import { Checkbox } from "../components/Checkbox";
import { DatePicker } from "../components/DatePicker";
import { TextInput } from "../components/Field";
import { Icon } from "../components/Icon";
import { Drawer, ModalHeader } from "../components/Modal";
import { SelectMenu } from "../components/SelectMenu";
import { TimePicker } from "../components/TimePicker";
import { COLLEAGUES } from "../data/people";
import { initialsOf } from "../lib/format";
import { dateError, isPlanReady, timeError, todayISO } from "../lib/planValidation";
import { useApp } from "../state/AppContext";
import { INPUT_STYLE, LABEL_STYLE, PRIMARY_BUTTON_STYLE } from "../styles/shared";

const INVITE_MODES = [
  {
    v: "group",
    label: "Group",
    icon: "groups",
  },
  {
    v: "individual",
    label: "Individuals",
    icon: "person",
  },
];

function FormField({ label, children }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 6,
      }}
    >
      <label style={LABEL_STYLE}>{label}</label>
      {children}
    </div>
  );
}

export function CreateLunchModal() {
  const { state, setCreateField, submitCreate, toggleInvitee } = useApp();
  const createForm = state.createForm;
  const dateProblem = dateError(createForm);
  const timeProblem = timeError(createForm);
  const ready = isPlanReady(createForm);
  const restaurantNames = state.restaurants.map((restaurant) => restaurant.name);
  const groupNames = ["No group", ...state.groups.map((group) => group.name)];
  return (
    <Drawer>
      <div
        style={{
          padding: 24,
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        <ModalHeader title="Plan a Meal" />
        <TextInput
          label="Plan name"
          placeholder="Noodle Hunters"
          value={createForm.name}
          onChange={(event) => setCreateField("name", event.target.value)}
        />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 12,
          }}
        >
          <FormField label="Date">
            <DatePicker
              value={createForm.date}
              min={todayISO()}
              invalid={!!dateProblem}
              onChange={(date) => setCreateField("date", date)}
            />
            {dateProblem && (
              <span
                style={{
                  fontSize: 12,
                  color: "var(--color-error-500)",
                }}
              >
                {dateProblem}
              </span>
            )}
          </FormField>
          <FormField label="Time">
            <TimePicker
              value={createForm.time}
              invalid={!!timeProblem}
              onChange={(time) => setCreateField("time", time)}
            />
            {timeProblem && (
              <span
                style={{
                  fontSize: 12,
                  color: "var(--color-error-500)",
                }}
              >
                {timeProblem}
              </span>
            )}
          </FormField>
        </div>
        <FormField label="Place">
          <SelectMenu
            icon="location_on"
            value={createForm.restaurant}
            onChange={(restaurant) => setCreateField("restaurant", restaurant)}
            options={restaurantNames}
          />
        </FormField>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 6,
          }}
        >
          <label style={LABEL_STYLE}>
            Meeting point{" "}
            <span
              style={{
                fontWeight: 400,
                color: "var(--text-muted)",
              }}
            >
              (optional)
            </span>
          </label>
          <input
            type="text"
            placeholder="Main Lobby"
            value={createForm.meta}
            onChange={(event) => setCreateField("meta", event.target.value)}
            style={INPUT_STYLE}
          />
        </div>
        <FormField label="Invite">
          <div
            style={{
              display: "flex",
              gap: 8,
            }}
          >
            {INVITE_MODES.map((inviteMode) => {
              const active = createForm.inviteMode === inviteMode.v;
              return (
                <button
                  onClick={() => setCreateField("inviteMode", inviteMode.v)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "10px 16px",
                    borderRadius: 999,
                    fontSize: 14,
                    fontWeight: 500,
                    cursor: "pointer",
                    fontFamily: "var(--font-family-base)",
                    ...(active
                      ? {
                          background: "var(--color-primary-500)",
                          color: "var(--text-on-primary)",
                          border: "1px solid var(--color-primary-500)",
                        }
                      : {
                          background: "var(--color-neutral-0)",
                          color: "var(--text-body)",
                          border: "1px solid var(--border-default)",
                        }),
                  }}
                  key={inviteMode.v}
                >
                  <Icon name={inviteMode.icon} size={16} tone={active ? "inverse" : "secondary"} />
                  {inviteMode.label}
                </button>
              );
            })}
          </div>
        </FormField>
        {createForm.inviteMode === "group" && (
          <FormField label="Group">
            <SelectMenu
              icon="groups"
              value={createForm.groupName}
              onChange={(groupName) => setCreateField("groupName", groupName)}
              options={groupNames}
            />
          </FormField>
        )}
        {createForm.inviteMode === "individual" && (
          <div>
            <span
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: "var(--text-heading)",
              }}
            >
              Invite people
            </span>
            <div
              style={{
                maxHeight: 170,
                overflowY: "auto",
                border: "1px solid var(--border-default)",
                borderRadius: 12,
                padding: 8,
                marginTop: 8,
                display: "flex",
                flexDirection: "column",
                gap: 4,
              }}
            >
              {COLLEAGUES.map((colleague) => {
                const invited = state.invitees.includes(colleague.id);
                return (
                  <div
                    onClick={() => toggleInvitee(colleague.id)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: 8,
                      borderRadius: 8,
                      cursor: "pointer",
                      background: invited ? "var(--color-primary-50)" : "transparent",
                    }}
                    key={colleague.id}
                  >
                    <Checkbox checked={invited} onChange={() => toggleInvitee(colleague.id)} />
                    <span
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: "50%",
                        background: "var(--color-neutral-100)",
                        color: "var(--text-heading)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 10,
                        fontWeight: 700,
                        flexShrink: 0,
                      }}
                    >
                      {initialsOf(colleague.name)}
                    </span>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <span
                        style={{
                          fontSize: 14,
                          fontWeight: 500,
                          color: "var(--text-heading)",
                        }}
                      >
                        {colleague.name}
                      </span>
                      <span
                        style={{
                          fontSize: 12,
                          color: "var(--text-muted)",
                        }}
                      >
                        {colleague.dept}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        <button
          onClick={submitCreate}
          disabled={!ready}
          style={{
            ...PRIMARY_BUTTON_STYLE,
            cursor: ready ? "pointer" : "not-allowed",
            opacity: ready ? 1 : 0.45,
          }}
        >
          Create lunch
        </button>
      </div>
    </Drawer>
  );
}
