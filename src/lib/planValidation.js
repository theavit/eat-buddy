export function todayISO() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

export function dateError(createForm) {
  if (createForm.date && createForm.date < todayISO()) {
    return "Date can't be in the past";
  } else {
    return "";
  }
}

export function timeError(createForm) {
  if (!createForm.date || !createForm.time) {
    return "";
  }
  if (createForm.date === todayISO()) {
    const now = new Date();
    const [hours, minutes] = createForm.time.split(":").map(Number);
    const chosen = new Date();
    chosen.setHours(hours, minutes, 0, 0);
    if (chosen <= now) {
      return "Time must be later than now";
    }
  }
  return "";
}

export function isPlanReady(createForm) {
  return (
    !!createForm.name &&
    !!createForm.time &&
    !!createForm.date &&
    !dateError(createForm) &&
    !timeError(createForm)
  );
}
