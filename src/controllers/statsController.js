import { resumenStats } from "../api/fetch.js";
import { setStats, getState } from "../state/store.js";
import { byId, on } from "../utils/dom.js";
import { renderStats } from "../ui/renderers.js";

const containerId = "stats-container";
const refreshBtnId = "stats-refresh";

export function initStats() {
  const btn = byId(refreshBtnId);
  on(btn, "click", handleRefresh);
  loadStats();
}
export function loadStats() {
  resumenStats(3)
    .then(applyStats)
    .catch(handleStatsError);
}
export function handleRefresh() { loadStats(); }
export function applyStats(s) {
  setStats(s);
  const st = getState();
  const cont = byId(containerId);
  renderStats(cont, st.stats);
}
export function handleStatsError(err) { console.error(err); alert("No se pudo cargar estadísticas"); }
