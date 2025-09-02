import {
  getSolicitudes,
  crearSolicitud,
  atenderSolicitud,
  aprobarSolicitud,
  rechazarSolicitud
} from "../api/fetch.js";
import { getState, setSolicitudes, setFiltros } from "../state/store.js";
import { byId, on, valueOf } from "../utils/dom.js";
import { renderSolicitudesList } from "../ui/renderers.js";
import { showLoading } from "../ui/components.js";
import { validateSolicitudPayload } from "../utils/validate.js";
const containerId = "lista-solicitudes";
const formNuevaId = "form-nueva";
const filtroEstadoId = "filtro-estado";
const filtroTextoId = "filtro-texto";
export function initQueue() {
  const form = byId(formNuevaId);
  const selectEstado = byId(filtroEstadoId);
  const inputQ = byId(filtroTextoId);
  on(form, "submit", handleCrear);
  on(selectEstado, "change", handleFiltroEstado);
  on(inputQ, "input", handleFiltroTexto);
  on(document, "click", handleActionButtons);
  refreshLista();
}
export function refreshLista() {
  const cont = byId(containerId);
  showLoading(cont, true);
  const st = getState();
  const params = { estado: st.filtros.estado, q: st.filtros.q, sort: "createdAt", order: "asc" };
  getSolicitudes(params)
    .then(applySolicitudes)
    .catch(logAndAlert)
    .finally(endLoading);
}
export function applySolicitudes(items) {
  setSolicitudes(items);
  const cont = byId(containerId);
  renderSolicitudesList(cont, items);
}
export function endLoading() {
  const cont = byId(containerId);
  showLoading(cont, false);
}
export function handleCrear(e) {
  e.preventDefault();
  const form = e.currentTarget;
  const payload = {
    userId: Number(form.userId.value),
    nombre: form.nombre.value,
    sede: form.sede.value,
    computadoraCodigo: form.computadoraCodigo.value,
    motivo: form.motivo.value,
    fechaInicio: form.fechaInicio.value,
    fechaFin: form.fechaFin.value,
    aceptaCondiciones: form.aceptaCondiciones.checked
  };
  const valid = validateSolicitudPayload(payload);
  if (!valid) { alert("Completa todos los campos de la solicitud."); return; }
  crearSolicitud(payload)
    .then(afterCrear)
    .catch(logAndAlert);
}
export function afterCrear() { refreshLista(); }

export function handleFiltroEstado(e) {
  const estado = valueOf(e.currentTarget);
  setFiltros({ estado });
  refreshLista();
}
export function handleFiltroTexto(e) {
  const q = valueOf(e.currentTarget);
  setFiltros({ q });
  refreshLista();
}
export function handleActionButtons(e) {
  const target = e.target;
  if (!target || !target.classList) return;
  const root = target.closest(".card-actions");
  if (!root) return;
  const id = Number(root.dataset.id);
  if (!id) return;
  if (target.classList.contains("btn-attend")) onAttend(id);
  if (target.classList.contains("btn-approve")) onApprove(id);
  if (target.classList.contains("btn-reject")) onReject(id);
}
export function onAttend(id) {
  atenderSolicitud(id, "Atendida desde panel")
    .then(refreshLista)
    .catch(logAndAlert);
}
export function onApprove(id) {
  const fechaAtencion = prompt("Fecha/hora de atención (ISO o deja vacío):", "");
  const adminId = 99;
  aprobarSolicitud(id, adminId, fechaAtencion || undefined)
    .then(refreshLista)
    .catch(logAndAlert);
}
export function onReject(id) {
  const adminId = 99;
  rechazarSolicitud(id, adminId, "Falta información")
    .then(refreshLista)
    .catch(logAndAlert);
}
export function logAndAlert(err) { console.error(err); alert("Ocurrió un error. Revisa la consola."); }
