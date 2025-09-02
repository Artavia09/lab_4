export const initialState = Object.freeze({
  user: null,
  solicitudes: [],
  filtros: { estado: "pendiente", q: "" },
  stats: { desde: null, hasta: null, porEstudiante: {}, porEstado: {}, recientes: [] }
});
let _state = { ...initialState };
export function getState() { return _state; }
export function setUser(user) { _state = { ..._state, user }; return _state; }
export function setSolicitudes(items) {
  _state = { ..._state, solicitudes: Array.isArray(items) ? items.slice() : [] };
  return _state;
}
export function setFiltros(next) {
  const prev = _state.filtros || {};
  _state = { ..._state, filtros: { ...prev, ...next } };
  return _state;
}
export function setStats(stats) {
  const safe = stats || {};
  _state = { ..._state, stats: {
    desde: safe.desde || null,
    hasta: safe.hasta || null,
    porEstudiante: safe.porEstudiante || {},
    porEstado: safe.porEstado || {},
    recientes: Array.isArray(safe.recientes) ? safe.recientes.slice() : []
  }};
  return _state;
}
export function resetState() { _state = { ...initialState }; return _state; }
