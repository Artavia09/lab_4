
// dom.js
export function byId(id) { return document.getElementById(id); }
export function setText(el, text) { if (el) el.textContent = text; }
export function setHTML(el, html) { if (el) el.innerHTML = html; }
export function on(el, type, handler) { if (el) el.addEventListener(type, handler, false); }
export function valueOf(el) { return el ? el.value : ""; }
export function setDisabled(el, disabled) { if (el) el.disabled = !!disabled; }
export function clearChildren(el) {
  if (!el) return;
  while (el.firstChild) el.removeChild(el.firstChild);
}
