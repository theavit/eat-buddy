import { supabase } from "./supabase";

function toGroup(row, currentUserId) {
  const memberRows = (row.group_members || [])
    .map((member) => {
      return {
        id: member.user_id,
        name: member.profiles?.full_name || "Someone",
        avatar: member.profiles?.avatar_url || "",
        role: member.role,
      };
    })
    .sort((first, second) =>
      first.role === second.role
        ? first.name.localeCompare(second.name)
        : first.role === "admin"
          ? -1
          : 1,
    );
  const admin = memberRows.find((memberRow) => memberRow.role === "admin");
  return {
    id: row.id,
    name: row.name,
    code: row.code,
    createdAt: row.created_at,
    adminId: admin?.id || row.created_by,
    admin: admin?.name || "",
    members: memberRows.map((memberRow) => memberRow.name),
    memberRows,
    isAdmin: !!admin && admin.id === currentUserId,
  };
}

const groupFailure = (error, fallback) => ({
  ok: false,
  error: groupErrorMessage(error) || fallback,
});

function groupErrorMessage(error) {
  const message = (error?.message || "").toLowerCase();
  if (message.includes("no_such_group")) {
    return "No group found with that code.";
  } else if (message.includes("empty_name")) {
    return "Give the group a name first.";
  } else if (message.includes("not_signed_in")) {
    return "Please sign in again.";
  } else if (message.includes("code_exhausted")) {
    return "Could not allocate a code. Try once more.";
  } else if (message.includes("failed to fetch") || message.includes("network")) {
    return "Can't reach the server. Check your connection.";
  } else if (
    (message.includes("relation") && message.includes("does not exist")) ||
    message.includes("schema cache") ||
    message.includes("could not find the table") ||
    message.includes("could not find the function")
  ) {
    return "Groups are not set up on the server yet — run supabase/01-groups.sql in the SQL editor.";
  } else {
    return error?.message || "";
  }
}

export async function fetchGroups(userId) {
  const { data, error } = await supabase
    .from("groups")
    .select(
      "id, name, code, created_by, created_at, group_members(user_id, role, profiles(full_name, avatar_url))",
    )
    .order("created_at", {
      ascending: true,
    });
  if (error) {
    return groupFailure(error, "Could not load your groups.");
  } else {
    return {
      ok: true,
      groups: (data || []).map((row) => toGroup(row, userId)),
    };
  }
}

export async function createGroup(p_name, id) {
  const { data, error } = await supabase.rpc("create_group", {
    p_name,
  });
  if (error) {
    return groupFailure(error, "Could not create the group.");
  }
  const created = Array.isArray(data) ? data[0] : data;
  return {
    ok: true,
    group: await fetchGroup(created.id, id, created),
  };
}

export async function joinGroupWithCode(p_code, id) {
  const { data, error } = await supabase.rpc("join_group", {
    p_code,
  });
  if (error) {
    return groupFailure(error, "Could not join that group.");
  }
  const joined = Array.isArray(data) ? data[0] : data;
  return {
    ok: true,
    group: await fetchGroup(joined.id, id, joined),
  };
}

async function fetchGroup(id, currentUserId, fallbackRow) {
  const { data, error } = await supabase
    .from("groups")
    .select(
      "id, name, code, created_by, created_at, group_members(user_id, role, profiles(full_name, avatar_url))",
    )
    .eq("id", id)
    .single();
  return toGroup(
    error || !data
      ? {
          ...fallbackRow,
          group_members: [],
        }
      : data,
    currentUserId,
  );
}

export async function leaveGroupMembership(p_group) {
  const { error } = await supabase.rpc("leave_group", {
    p_group,
  });
  if (error) {
    return groupFailure(error, "Could not leave the group.");
  } else {
    return {
      ok: true,
    };
  }
}

export async function removeGroupMember(groupId, userId) {
  const { error } = await supabase
    .from("group_members")
    .delete()
    .eq("group_id", groupId)
    .eq("user_id", userId);
  if (error) {
    return groupFailure(error, "Could not remove that member.");
  } else {
    return {
      ok: true,
    };
  }
}
