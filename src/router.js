
// router.js
import { byId } from "./utils/dom.js";
const routes = Object.freeze({
  "#/login": "view-login",
  "#/cola": "view-cola",
  "#/stats": "view-stats"
});
export function initRouter() {
  window.addEventListener("hashchange", handleRouteChange, false);
  handleRouteChange();
}
export function handleRouteChange() {
  const hash = window.location.hash || "#/login";
  showView(hash);
}
export function showView(hash) {
  const all = document.querySelectorAll("[data-view]");
  let i = 0;
  while (i < all.length) { all[i].classList.add("hidden"); i += 1; }
  const id = routes[hash] || "view-login";
  const el = byId(id);
  if (el) el.classList.remove("hidden");
}
