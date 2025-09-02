import { setHTML, setText } from "../utils/dom.js";
export function showLoading(container, show) {
  if (!container) return;
  container.dataset.loading = show ? "1" : "0";
}
export function showError(container, message) {
  if (!container) return;
  setHTML(container, `<div class="error">${message}</div>`);
}
export function clearError(container) {
  if (!container) return;
  setHTML(container, "");
}
export function setBadge(el, value) {
  if (!el) return;
  setText(el, String(value));
}
