import { useApp } from "../state/AppContext";
import { AddMomentModal } from "./AddMomentModal";
import { CreateLunchModal } from "./CreateLunchModal";
import { CreateGroupModal, JoinGroupModal, LeaveGroupModal } from "./GroupModals";
import { LunchModal } from "./LunchModal";
import { MomentModal } from "./MomentModal";
import { NotificationsDrawer } from "./NotificationsDrawer";
import { RestaurantModal } from "./RestaurantModal";
import { SettingsModal } from "./SettingsModal";

const MODALS = {
  lunch: LunchModal,
  moment: MomentModal,
  restaurant: RestaurantModal,
  create: CreateLunchModal,
  addPlace: AddMomentModal,
  notifications: NotificationsDrawer,
  settings: SettingsModal,
  createGroup: CreateGroupModal,
  joinGroup: JoinGroupModal,
  confirmLeave: LeaveGroupModal,
};

export function ModalRoot() {
  const { state } = useApp();
  if (!state.modal) {
    return null;
  }
  const ActiveModal = MODALS[state.modal.type];
  if (ActiveModal) {
    return <ActiveModal />;
  } else {
    return null;
  }
}
