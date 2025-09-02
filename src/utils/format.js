export function fmtDateTime(iso) {
  const d = new Date(iso);
  if (isNaN(d)) return "";
  return d.toLocaleString();
}
export function capitalize(s) {
  return typeof s === "string" && s.length ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}
