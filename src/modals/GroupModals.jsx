import { Button } from "../components/Button";
import { TextInput } from "../components/Field";
import { Modal, ModalHeader } from "../components/Modal";
import { useApp } from "../state/AppContext";

const GROUP_MODAL_BODY_STYLE = {
  padding: 24,
  display: "flex",
  flexDirection: "column",
  gap: 16,
};

const GROUP_MODAL_TEXT_STYLE = {
  margin: 0,
  fontSize: 14,
  color: "var(--text-muted)",
};

export function CreateGroupModal() {
  const { state, patch, submitCreateGroup } = useApp();
  const canCreate = !!(state.createGroupName || "").trim();
  return (
    <Modal maxWidth={420}>
      <div style={GROUP_MODAL_BODY_STYLE}>
        <ModalHeader title="Create a group" />
        <p style={GROUP_MODAL_TEXT_STYLE}>
          You'll get a 6-digit code to invite people. Meal plans created in this group are visible
          to everyone in it.
        </p>
        <TextInput
          label="Group name"
          placeholder="Noodle Hunters Crew"
          value={state.createGroupName}
          onChange={(event) =>
            patch({
              createGroupName: event.target.value,
            })
          }
        />
        <Button
          variant="primary"
          disabled={!canCreate}
          onClick={submitCreateGroup}
          style={{
            width: "100%",
          }}
        >
          Create group
        </Button>
      </div>
    </Modal>
  );
}

export function JoinGroupModal() {
  const { state, patch, submitJoinCode } = useApp();
  const canJoin = (state.joinCode || "").length === 6;
  return (
    <Modal maxWidth={420}>
      <div style={GROUP_MODAL_BODY_STYLE}>
        <ModalHeader title="Join a group" />
        <p style={GROUP_MODAL_TEXT_STYLE}>Enter the 6-character code someone shared with you.</p>
        <TextInput
          label="Group code"
          placeholder="K7M2QP"
          autoCapitalize="characters"
          autoCorrect="off"
          spellCheck={false}
          value={state.joinCode}
          onChange={(event) =>
            patch({
              joinCode: event.target.value
                .toUpperCase()
                .replace(/[^A-Z0-9]/g, "")
                .slice(0, 6),
              joinError: "",
            })
          }
        />
        {state.joinError && (
          <span
            style={{
              fontSize: 13,
              color: "#C0392B",
            }}
          >
            {state.joinError}
          </span>
        )}
        <Button
          variant="primary"
          disabled={!canJoin}
          onClick={submitJoinCode}
          style={{
            width: "100%",
          }}
        >
          Join group
        </Button>
      </div>
    </Modal>
  );
}

export function LeaveGroupModal() {
  const { state, closeModal, leaveGroup } = useApp();
  const leaving = state.groups.find((group) => group.id === state.modal.id);
  return (
    <Modal maxWidth={380}>
      <div style={GROUP_MODAL_BODY_STYLE}>
        <h2
          style={{
            margin: 0,
            fontSize: 20,
            fontWeight: 600,
            color: "var(--text-heading)",
          }}
        >
          Leave {leaving?.name}?
        </h2>
        <p style={GROUP_MODAL_TEXT_STYLE}>
          You'll lose access to this group's meal plans. You can rejoin later with the group code.
        </p>
        <div
          style={{
            display: "flex",
            gap: 10,
          }}
        >
          <Button variant="outline" onClick={closeModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={() => leaveGroup(state.modal.id)}>
            Leave group
          </Button>
        </div>
      </div>
    </Modal>
  );
}
