export function isIsoDateString(s?: string | null) {
  if (!s) return false;
  // simple ISO-ish check
  return /^\d{4}-\d{2}-\d{2}T/.test(s);
}

export function formatTime(value?: string | null) {
  if (!value) return "";
  try {
    const d = new Date(String(value));
    if (Number.isNaN(d.getTime())) return String(value);
    return d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
  } catch (e) {
    return String(value);
  }
}

export function formatDate(value?: string | null) {
  if (!value) return "";
  try {
    const d = new Date(String(value));
    if (Number.isNaN(d.getTime())) return String(value);
    return d.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
  } catch (e) {
    return String(value);
  }
}

export function formatDateTimeRange(start?: string | null, end?: string | null) {
  const s = start ? formatTime(start) : "";
  const e = end ? formatTime(end) : "";
  if (s && e) return `${s} - ${e}`;
  return s || e || "";
}
