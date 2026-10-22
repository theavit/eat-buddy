import { useApp } from "../state/AppContext";
import { GroupDetail } from "./groups/GroupDetail";
import { GroupsList } from "./groups/GroupsList";

export function GroupsScreen() {
  const { state } = useApp();
  if (state.selectedGroupId) {
    return <GroupDetail />;
  } else {
    return <GroupsList />;
  }
}
